import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { convertToPdf } from "../../../utils/convertToPdf";

export const generatePdf = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const finalPdf = await PDFDocument.create();

        for (const file of files) {
            const ext = path.extname(file.originalname).toLowerCase();

            // 🖼️ IMAGE
            if ([".png", ".jpg", ".jpeg"].includes(ext)) {
                const imgBytes = fs.readFileSync(file.path);

                const image =
                    ext === ".png"
                        ? await finalPdf.embedPng(imgBytes)
                        : await finalPdf.embedJpg(imgBytes);

                const page = finalPdf.addPage([595, 842]); // A4
                const scale = Math.min(
                    500 / image.width,
                    700 / image.height
                );

                page.drawImage(image, {
                    x: 50,
                    y: 800 - image.height * scale,
                    width: image.width * scale,
                    height: image.height * scale,
                });
            }

            // 📄 DOC / XLS / PDF
            else {
                const pdfPath = await convertToPdf(file.path);
                const pdfBytes = fs.readFileSync(pdfPath);

                const pdf = await PDFDocument.load(pdfBytes);
                const pages = await finalPdf.copyPages(
                    pdf,
                    pdf.getPageIndices()
                );

                pages.forEach(p => finalPdf.addPage(p));
            }
        }

        const finalBytes = await finalPdf.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=final-report.pdf"
        );

        return res.send(Buffer.from(finalBytes));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "PDF generation failed" });
    }
};

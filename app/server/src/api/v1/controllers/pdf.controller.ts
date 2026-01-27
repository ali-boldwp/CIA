import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from "pdf-lib";
import { convertToHtml } from "../../../utils/convertToHtml";

// =======================
// THEME + CONSTANTS
// =======================
const PAGE_W = 595;
const PAGE_H = 880;
const MARGIN_X = 45;
const TOP_Y = 760; // content start (after header)
const BOTTOM_Y = 60; // bottom safe area (above footer)
const CONTENT_W = PAGE_W - MARGIN_X * 2;

// ✅ spacing control (fix extra gaps in circled areas)
const SPACING = {
    afterSection: 10, // gap after section header
    afterKV: 6,       // gap after project-details key value list
    betweenBlocks: 8, // gap between OP BRIEF items, feedback, clarifications
};


const IMAGE_SCALE_MULTIPLIER = 0.50;

const THEME = {
    headerBg: rgb(0.05, 0.15, 0.3),
    headerText: rgb(1, 1, 1),
    text: rgb(0.1, 0.1, 0.1),
    muted: rgb(0.45, 0.45, 0.45),
    border: rgb(0.86, 0.86, 0.86),

    blueBg: rgb(0.92, 0.96, 1),
    amberBg: rgb(1, 0.96, 0.9),
    redBg: rgb(1, 0.92, 0.92),
    greenBg: rgb(0.94, 1, 0.94),
};

// =======================
// TYPES
// =======================
type PageRef = { page: PDFPage; y: number; pageNo: number };
type Fonts = { font: PDFFont; bold: PDFFont };

// =======================
// CORE DRAW HELPERS
// =======================
const drawHeader = (page: PDFPage, fonts: Fonts, title: string) => {
    page.drawRectangle({
        x: 0,
        y: PAGE_H - 62,
        width: PAGE_W,
        height: 62,
        color: THEME.headerBg,
    });

    page.drawText(title, {
        x: MARGIN_X,
        y: PAGE_H - 42,
        size: 18,
        font: fonts.bold,
        color: THEME.headerText,
    });

    page.drawText("Confidential Document", {
        x: MARGIN_X,
        y: PAGE_H - 56,
        size: 9,
        font: fonts.font,
        color: rgb(0.85, 0.85, 0.85),
    });

    const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const right = `Generated: ${date}`;
    const w = fonts.font.widthOfTextAtSize(right, 9);

    page.drawText(right, {
        x: PAGE_W - MARGIN_X - w,
        y: PAGE_H - 42,
        size: 9,
        font: fonts.font,
        color: THEME.headerText,
    });
};

const drawFooter = (page: PDFPage, font: PDFFont, pageNo: number) => {
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 26, color: rgb(0.98, 0.98, 0.98) });

    page.drawText(`Page ${pageNo}`, {
        x: MARGIN_X,
        y: 8,
        size: 9,
        font,
        color: THEME.muted,
    });

    const mark = "© HUMINT Operations";
    const w = font.widthOfTextAtSize(mark, 9);
    page.drawText(mark, { x: PAGE_W - MARGIN_X - w, y: 8, size: 9, font, color: THEME.muted });
};

const newStyledPage = (pdf: PDFDocument, fonts: Fonts, title: string, pageNo: number): PageRef => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    drawHeader(page, fonts, title);
    drawFooter(page, fonts.font, pageNo);
    return { page, y: TOP_Y, pageNo };
};

const ensureSpace = (pdf: PDFDocument, ref: PageRef, fonts: Fonts, title: string, needed: number): PageRef => {
    if (ref.y - needed > BOTTOM_Y) return ref;
    return newStyledPage(pdf, fonts, title, ref.pageNo + 1);
};

const drawSectionTitle = (ref: PageRef, fonts: Fonts, label: string, bg: any): PageRef => {
    ref.page.drawRectangle({
        x: MARGIN_X,
        y: ref.y - 6,
        width: CONTENT_W,
        height: 26,
        color: bg,
        borderColor: THEME.border,
        borderWidth: 0.7,
    });

    ref.page.drawText(label, {
        x: MARGIN_X + 12,
        y: ref.y,
        size: 12,
        font: fonts.bold,
        color: THEME.text,
    });

    // ✅ slightly less drop than before + controlled gap
    return { ...ref, y: ref.y - 30 - SPACING.afterSection };
};

const wrapLines = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
    const words = (text || "").split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";

    for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test;
        else {
            if (line) lines.push(line);
            line = w;
        }
    }
    if (line) lines.push(line);
    return lines.length ? lines : ["-"];
};

const drawKeyValue = (pdf: PDFDocument, ref: PageRef, fonts: Fonts, title: string, key: string, value: string) => {
    ref = ensureSpace(pdf, ref, fonts, title, 18);

    const keyText = `${key}:`;
    ref.page.drawText(keyText, {
        x: MARGIN_X + 10,
        y: ref.y,
        size: 10.5,
        font: fonts.bold,
        color: THEME.muted,
    });

    const keyW = fonts.bold.widthOfTextAtSize(keyText, 10.5);
    ref.page.drawText(value?.trim() ? value : "-", {
        x: MARGIN_X + 16 + keyW,
        y: ref.y,
        size: 10.5,
        font: fonts.font,
        color: THEME.text,
    });

    return { ...ref, y: ref.y - 16 }; // ✅ tighter than 18
};

const drawLabeledParagraph = (
    pdf: PDFDocument,
    ref: PageRef,
    fonts: Fonts,
    title: string,
    label: string,
    value: string,
    labelColor = THEME.text
) => {
    ref = ensureSpace(pdf, ref, fonts, title, 22);

    ref.page.drawText(`${label}:`, {
        x: MARGIN_X + 10,
        y: ref.y,
        size: 10.5,
        font: fonts.bold,
        color: labelColor,
    });

    ref = { ...ref, y: ref.y - 14 }; // ✅ tighter

    const lines = wrapLines(value || "-", fonts.font, 10.5, CONTENT_W - 20);
    for (const ln of lines) {
        ref = ensureSpace(pdf, ref, fonts, title, 13);
        ref.page.drawText(ln, {
            x: MARGIN_X + 14,
            y: ref.y,
            size: 10.5,
            font: fonts.font,
            color: THEME.text,
        });
        ref = { ...ref, y: ref.y - 13 }; // ✅ tighter
    }

    return { ...ref, y: ref.y - SPACING.betweenBlocks }; // ✅ controlled
};

// ✅ Card on attachment page (prevents extra blank pages)
const drawAttachmentCard = (
    page: PDFPage,
    fonts: Fonts,
    attachmentNo: number,
    originalName: string,
    ext: string,
    fileSize: string
) => {
    page.drawRectangle({
        x: MARGIN_X,
        y: TOP_Y - 10,
        width: CONTENT_W,
        height: 64,
        color: rgb(0.98, 0.98, 0.98),
        borderColor: THEME.border,
        borderWidth: 0.8,
    });

    page.drawText(`Attachment ${attachmentNo}`, {
        x: MARGIN_X + 14,
        y: TOP_Y + 34,
        size: 11,
        font: fonts.bold,
        color: THEME.muted,
    });

    page.drawText(originalName, {
        x: MARGIN_X + 14,
        y: TOP_Y + 16,
        size: 13,
        font: fonts.bold,
        color: THEME.text,
    });

    page.drawText(`Type: ${ext.toUpperCase().replace(".", "")} | Size: ${fileSize}`, {
        x: MARGIN_X + 14,
        y: TOP_Y + 2,
        size: 9.5,
        font: fonts.font,
        color: THEME.muted,
    });

    return TOP_Y - 30; // content top Y
};

// =======================
// MAIN CONTROLLER
// =======================
export const generatePdf = async (req: Request, res: Response) => {
    try {
        const uploadedFiles = (req.files as Express.Multer.File[]) || [];
        const data = req.body.data ? JSON.parse(req.body.data) : null;
        const existingAttachments = req.body.existingAttachments ? JSON.parse(req.body.existingAttachments) : [];
        const allFiles = [...uploadedFiles, ...existingAttachments];

        const finalPdf = await PDFDocument.create();
        const fonts: Fonts = {
            font: await finalPdf.embedFont(StandardFonts.Helvetica),
            bold: await finalPdf.embedFont(StandardFonts.HelveticaBold),
        };

        // =======================
        // PAGE 1 – HUMINT DATA
        // =======================
        let ref: PageRef = newStyledPage(finalPdf, fonts, "HUMINT OPERATIONAL BRIEF", 1);

        if (data) {
            // PROJECT DETAILS
            ref = drawSectionTitle(ref, fonts, "PROJECT DETAILS", THEME.blueBg);
            ref = drawKeyValue(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Project", data.projectName || "");
            ref = drawKeyValue(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Report type", data.reportType || "");
            ref = drawKeyValue(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Responsible Analyst", data.projectOwner || "");
            ref = drawKeyValue(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Deadline", data.deadline || "");
            ref = drawKeyValue(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Priority", data.priority || "");

            // ✅ IMPORTANT: reduce big gap between PROJECT DETAILS and OPERATIONAL BRIEF
            ref = { ...ref, y: ref.y - SPACING.afterKV };

            // OPERATIONAL BRIEF
            ref = drawSectionTitle(ref, fonts, "OPERATIONAL BRIEF", THEME.amberBg);
            ref = drawLabeledParagraph(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Brief objective", data.briefObjective || "");
            ref = drawLabeledParagraph(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Key questions", data.keyQuestions || "");
            ref = drawLabeledParagraph(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Targets", data.targets || "");
            ref = drawLabeledParagraph(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Locations", data.locations || "");
            ref = drawLabeledParagraph(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", "Restrictions", data.restrictions || "");

            // MANAGER FEEDBACK
            if (data.managerFeedback) {
                ref = ensureSpace(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", 34); // ✅ smaller needed space
                ref = drawSectionTitle(ref, fonts, "MANAGER FEEDBACK", THEME.redBg);
                ref = drawLabeledParagraph(
                    finalPdf,
                    ref,
                    fonts,
                    "HUMINT OPERATIONAL BRIEF",
                    "Feedback",
                    data.managerFeedback || "",
                    rgb(0.55, 0.12, 0.12)
                );
            }

            // CLARIFICATIONS
            if (Array.isArray(data.clarifications) && data.clarifications.length) {
                ref = ensureSpace(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", 34); // ✅ smaller
                ref = drawSectionTitle(ref, fonts, "CLARIFICATION HISTORY", THEME.greenBg);

                for (const c of data.clarifications) {
                    const userName = c.userId?.name || c.userId || "Unknown User";
                    const date = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "";
                    const header = `${userName} — ${date}`;
                    const text = c.clarificationText || "-";

                    ref = ensureSpace(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", 22);
                    ref.page.drawText(header, {
                        x: MARGIN_X + 10,
                        y: ref.y,
                        size: 10.5,
                        font: fonts.bold,
                        color: rgb(0.35, 0.2, 0.2),
                    });
                    ref = { ...ref, y: ref.y - 12 }; // ✅ tighter

                    const lines = wrapLines(text, fonts.font, 10, CONTENT_W - 20);
                    for (const ln of lines) {
                        ref = ensureSpace(finalPdf, ref, fonts, "HUMINT OPERATIONAL BRIEF", 13);
                        ref.page.drawText(ln, {
                            x: MARGIN_X + 14,
                            y: ref.y,
                            size: 10,
                            font: fonts.font,
                            color: THEME.text,
                        });
                        ref = { ...ref, y: ref.y - 13 };
                    }
                    ref = { ...ref, y: ref.y - SPACING.betweenBlocks };
                }
            }
        }

        // =======================
        // ATTACHMENTS INDEX (same page if space) - keep your logic
        // =======================
        if (allFiles.length > 0) {
            const canFitOnSamePage = allFiles.length <= 6 && ref.y > 230;

            if (!canFitOnSamePage) {
                ref = newStyledPage(finalPdf, fonts, "DOCUMENT ATTACHMENTS", ref.pageNo + 1);
            } else {
                // ✅ reduce gap before attachments index when it is on same page
                ref = { ...ref, y: ref.y - 6 };
            }

            ref = drawSectionTitle(ref, fonts, "ATTACHMENTS INDEX", THEME.blueBg);

            ref.page.drawText(`Total: ${allFiles.length} file${allFiles.length !== 1 ? "s" : ""}`, {
                x: MARGIN_X + 10,
                y: ref.y,
                size: 10,
                font: fonts.font,
                color: THEME.muted,
            });
            ref = { ...ref, y: ref.y - 18 }; // ✅ tighter than 22

            for (let index = 0; index < allFiles.length; index++) {
                const fileObj = allFiles[index];

                const originalName =
                    fileObj && typeof fileObj === "object" && "originalname" in fileObj
                        ? (fileObj as Express.Multer.File).originalname
                        : (fileObj as any).originalName || (fileObj as any).fileName || "Unknown file";

                const ext = path.extname(originalName).toLowerCase();
                let filePrefix = "FILE";
                if (ext === ".pdf") filePrefix = "PDF";
                else if ([".png", ".jpg", ".jpeg", ".gif", ".bmp"].includes(ext)) filePrefix = "IMG";
                else if ([".doc", ".docx"].includes(ext)) filePrefix = "DOC";
                else if ([".xls", ".xlsx"].includes(ext)) filePrefix = "XLS";
                else if ([".txt", ".csv"].includes(ext)) filePrefix = "TXT";

                ref = ensureSpace(finalPdf, ref, fonts, "DOCUMENT ATTACHMENTS", 16);

                ref.page.drawText(`${index + 1}. [${filePrefix}] ${originalName}`, {
                    x: MARGIN_X + 10,
                    y: ref.y,
                    size: 10.5,
                    font: fonts.font,
                    color: THEME.text,
                });

                const extRight = `(${ext.toUpperCase().replace(".", "")})`;
                const extW = fonts.font.widthOfTextAtSize(extRight, 9);
                ref.page.drawText(extRight, {
                    x: PAGE_W - MARGIN_X - extW,
                    y: ref.y,
                    size: 9,
                    font: fonts.font,
                    color: THEME.muted,
                });

                ref = { ...ref, y: ref.y - 16 }; // ✅ tighter

                if (ref.y < 100 && index < allFiles.length - 1) {
                    ref.page.drawText("... more files follow in actual content", {
                        x: MARGIN_X + 10,
                        y: ref.y,
                        size: 9,
                        font: fonts.font,
                        color: rgb(0.7, 0.7, 0.7),
                    });
                    ref = { ...ref, y: ref.y - 14 };
                    break;
                }
            }
        }

        // =======================
        // PROCESS EACH ATTACHMENT (NO EXTRA HEADER PAGE)
        // =======================
        let attachmentCount = 0;
        const UPLOADS_BASE_DIR = path.join(process.cwd(), "uploads");

        for (const fileObj of allFiles) {
            try {
                let filePath: string;
                let originalName: string;

                if (fileObj && typeof fileObj === "object") {
                    if ("path" in fileObj && "originalname" in fileObj) {
                        filePath = (fileObj as Express.Multer.File).path;
                        originalName = (fileObj as Express.Multer.File).originalname;
                    } else {
                        originalName = (fileObj as any).originalName || (fileObj as any).fileName || "unknown";
                        const fileName = (fileObj as any).fileName;
                        filePath = path.join(UPLOADS_BASE_DIR, fileName);
                    }
                } else continue;

                const ext = path.extname(originalName).toLowerCase();

                if (!fs.existsSync(filePath)) {
                    addFileNotFoundPage(finalPdf, originalName, attachmentCount + 1, fonts.font);
                    attachmentCount++;
                    continue;
                }

                const fileStats = fs.statSync(filePath);
                const fileSize =
                    fileStats.size > 1024 * 1024
                        ? `${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(fileStats.size / 1024).toFixed(2)} KB`;

                // IMAGES: 1 page (card + image) ✅ image 1/4
                if ([".png", ".jpg", ".jpeg", ".gif", ".bmp"].includes(ext)) {
                    try {
                        const imgBytes = fs.readFileSync(filePath);
                        const image = ext === ".png" ? await finalPdf.embedPng(imgBytes) : await finalPdf.embedJpg(imgBytes);

                        const imgRef = newStyledPage(finalPdf, fonts, "ATTACHMENT IMAGE", finalPdf.getPageCount() + 1);
                        const imgPage = imgRef.page;

                        const contentTopY = drawAttachmentCard(imgPage, fonts, attachmentCount + 1, originalName, ext, fileSize);

                        const maxWidth = CONTENT_W;
                        const maxHeight = contentTopY - BOTTOM_Y;

                        // ✅ original scale * 0.25 (1/4)
                        const baseScale = Math.min(maxWidth / image.width, maxHeight / image.height);
                        const scale = baseScale * IMAGE_SCALE_MULTIPLIER;

                        const drawW = image.width * scale;
                        const drawH = image.height * scale;

                        const xPos = (PAGE_W - drawW) / 2;
                        const yPos = contentTopY - drawH; // top aligned under card

                        imgPage.drawImage(image, {
                            x: xPos,
                            y: yPos,
                            width: drawW,
                            height: drawH,
                        });
                    } catch (imgError: any) {
                        addErrorPage(finalPdf, originalName, `Image embedding error: ${imgError.message}`, fonts.font);
                    }
                }
                // PDF: direct merge only (NO header page)
                else if (ext === ".pdf") {
                    try {
                        const pdfBytes = fs.readFileSync(filePath);
                        const pdfLoaded = await PDFDocument.load(pdfBytes);
                        const pages = await finalPdf.copyPages(pdfLoaded, pdfLoaded.getPageIndices());
                        pages.forEach((p) => finalPdf.addPage(p));
                    } catch (pdfError: any) {
                        addErrorPage(finalPdf, originalName, `PDF processing error: ${pdfError.message}`, fonts.font);
                    }
                }
                // OTHER: HTML render
                else {
                    try {
                        const { html, metadata } = await convertToHtml(filePath);

                        if (html && html.trim() !== "") {
                            await addHtmlContentToPdf(finalPdf, html, originalName, fonts.font, fonts.bold, fileStats);
                        } else {
                            addUnsupportedFilePage(finalPdf, originalName, metadata.fileType, fileStats, fonts.font);
                        }
                    } catch (conversionError: any) {
                        addErrorPage(finalPdf, originalName, `Conversion error: ${conversionError.message}`, fonts.font);
                    }
                }

                attachmentCount++;
            } catch (fileError: any) {
                addErrorPage(finalPdf, "Unknown file", `Processing error: ${fileError.message}`, fonts.font);
                attachmentCount++;
            }
        }

        // =======================
        // FINAL PAGE
        // =======================
        const endRef = newStyledPage(finalPdf, fonts, "END OF REPORT", finalPdf.getPageCount() + 1);
        let endY = TOP_Y;

        endRef.page.drawText("Document Summary", {
            x: MARGIN_X,
            y: endY,
            size: 16,
            font: fonts.bold,
            color: THEME.text,
        });

        endY -= 30;

        const totalPages = finalPdf.getPageCount();
        endRef.page.drawText(`Total Pages: ${totalPages}`, { x: MARGIN_X, y: endY, size: 11, font: fonts.font, color: THEME.muted });
        endY -= 18;
        endRef.page.drawText(`Attachments: ${attachmentCount}`, { x: MARGIN_X, y: endY, size: 11, font: fonts.font, color: THEME.muted });
        endY -= 18;

        const fullDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        endRef.page.drawText(`Generated: ${fullDate}`, { x: MARGIN_X, y: endY, size: 11, font: fonts.font, color: THEME.muted });

        endRef.page.drawText("This document contains confidential information", {
            x: MARGIN_X,
            y: 40,
            size: 9,
            font: fonts.font,
            color: THEME.muted,
        });

        const finalBytes = await finalPdf.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="humint-brief-${Date.now()}.pdf"`);
        res.setHeader("Content-Length", finalBytes.length);
        res.send(Buffer.from(finalBytes));
    } catch (err: any) {
        console.error("PDF generation failed:", err);
        res.status(500).json({
            message: "PDF generation failed",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};

// =======================
// HTML CONTENT TO PDF (STYLED)
// =======================
const addHtmlContentToPdf = async (
    pdfDoc: PDFDocument,
    htmlContent: string,
    title: string,
    font: PDFFont,
    boldFont: PDFFont,
    fileStats: fs.Stats
) => {
    try {
        const fonts: Fonts = { font, bold: boldFont };

        let ref = newStyledPage(pdfDoc, fonts, "ATTACHMENT CONTENT", pdfDoc.getPageCount() + 1);
        ref = drawSectionTitle(ref, fonts, "Content Preview", THEME.blueBg);

        const fileSize =
            fileStats.size > 1024 * 1024 ? `${(fileStats.size / (1024 * 1024)).toFixed(2)} MB` : `${(fileStats.size / 1024).toFixed(2)} KB`;

        ref.page.drawText(title, { x: MARGIN_X + 10, y: ref.y, size: 12, font: boldFont, color: THEME.text });
        ref = { ...ref, y: ref.y - 14 };
        ref.page.drawText(`Size: ${fileSize} | Modified: ${new Date(fileStats.mtime).toLocaleDateString()}`, {
            x: MARGIN_X + 10,
            y: ref.y,
            size: 9.5,
            font,
            color: THEME.muted,
        });
        ref = { ...ref, y: ref.y - 18 };

        let readableText = htmlContent
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n=== $1 ===\n\n")
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n== $1 ==\n\n")
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n= $1 =\n\n")
            .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n")
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\n\s*\n\s*\n/g, "\n\n")
            .trim();

        const maxChars = 10000;
        if (readableText.length > maxChars) {
            readableText =
                readableText.substring(0, maxChars) +
                `\n\n[Content truncated]\n[Original file size: ${fileSize}]\n[Please download the original file to view complete content.]`;
        }

        const rawLines = readableText.split("\n");
        const lineHeight = 13;

        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            const wrapped = wrapLines(line, font, 10.5, CONTENT_W - 20);

            for (const ln of wrapped) {
                ref = ensureSpace(pdfDoc, ref, fonts, "ATTACHMENT CONTENT", lineHeight);
                ref.page.drawText(ln, { x: MARGIN_X + 10, y: ref.y, size: 10.5, font, color: THEME.text });
                ref = { ...ref, y: ref.y - lineHeight };
            }

            if (line.trim() === "") ref = { ...ref, y: ref.y - 4 };
        }

        ref.page.drawText(`End of content: ${title}`, {
            x: MARGIN_X + 10,
            y: 34,
            size: 9,
            font,
            color: THEME.muted,
        });
    } catch (error: any) {
        console.error(`Error adding HTML content to PDF:`, error);
        addErrorPage(pdfDoc, title, `Error displaying content: ${error.message}`, font);
    }
};

// =======================
// ERROR / FALLBACK PAGES
// =======================
const addFileNotFoundPage = (pdfDoc: PDFDocument, fileName: string, attachmentNumber: number, font: PDFFont) => {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    page.drawText(`Attachment ${attachmentNumber}: ${fileName}`, { x: MARGIN_X, y: TOP_Y, size: 14, font, color: THEME.text });
    page.drawText("[FILE NOT AVAILABLE]", { x: MARGIN_X, y: TOP_Y - 30, size: 12, font, color: rgb(0.8, 0.2, 0.2) });
    page.drawText("The file could not be located in the system.", { x: MARGIN_X, y: TOP_Y - 50, size: 10.5, font, color: THEME.muted });
};

const addErrorPage = (pdfDoc: PDFDocument, fileName: string, errorMsg: string, font: PDFFont) => {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    page.drawText(`Error Processing: ${fileName}`, { x: MARGIN_X, y: TOP_Y, size: 14, font, color: rgb(0.8, 0.2, 0.2) });
    page.drawText(errorMsg.substring(0, 140) + (errorMsg.length > 140 ? "..." : ""), {
        x: MARGIN_X,
        y: TOP_Y - 24,
        size: 10.5,
        font,
        color: rgb(0.6, 0.2, 0.2),
    });
    page.drawText("This file could not be displayed in the PDF.", { x: MARGIN_X, y: TOP_Y - 48, size: 10, font, color: THEME.muted });
    page.drawText("Please refer to the original file for content.", { x: MARGIN_X, y: TOP_Y - 64, size: 10, font, color: THEME.muted });
};

const addUnsupportedFilePage = (pdfDoc: PDFDocument, fileName: string, fileType: string, fileStats: fs.Stats, font: PDFFont) => {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

    const fileSize =
        fileStats.size > 1024 * 1024 ? `${(fileStats.size / (1024 * 1024)).toFixed(2)} MB` : `${(fileStats.size / 1024).toFixed(2)} KB`;

    page.drawText(`File: ${fileName}`, { x: MARGIN_X, y: TOP_Y, size: 14, font, color: THEME.text });
    page.drawText(`Type: ${fileType}`, { x: MARGIN_X, y: TOP_Y - 22, size: 11, font, color: THEME.muted });
    page.drawText(`Size: ${fileSize}`, { x: MARGIN_X, y: TOP_Y - 42, size: 11, font, color: THEME.muted });

    page.drawText(`This file type (${fileType}) cannot be displayed in the PDF.`, {
        x: MARGIN_X,
        y: TOP_Y - 70,
        size: 10.5,
        font,
        color: rgb(0.6, 0.2, 0.2),
    });

    page.drawText(`Please download and open the original file to view its content.`, {
        x: MARGIN_X,
        y: TOP_Y - 86,
        size: 10.5,
        font,
        color: rgb(0.6, 0.2, 0.2),
    });
};

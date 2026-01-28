import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const downloadFile = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;


        const uploadsDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // 🔥 FORCE DOWNLOAD (NO PREVIEW)
        return res.download(filePath);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Download failed",
        });
    }
};



export const uploadEditorImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: "No file uploaded",
            });
        }

        const filename = req.file.filename;

        // ✅ URL that will open the image
        // Agar aap auth laga rahe ho downloads pe, to uploads static open rakho.
        const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

        // ✅ EditorJS required response format
        return res.status(200).json({
            success: 1,
            file: { url },
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Image upload failed",
        });
    }
};
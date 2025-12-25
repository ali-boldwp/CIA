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

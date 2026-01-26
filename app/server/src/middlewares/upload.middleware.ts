import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// 📁 ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Created uploads folder at:", uploadDir);
}

// 💾 storage config
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },

    filename: (_req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// 🚀 export upload middleware
export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // ✅ 50MB per file (change if needed)
    },
});

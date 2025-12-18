import multer from "multer";
import fs from "fs";
import path from "path";


const uploadDir = path.join(process.cwd(), "uploads");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Created uploads folder at:", uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


export const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

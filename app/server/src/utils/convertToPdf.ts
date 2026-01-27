import fs from "fs";
import path from "path";
import libre from "libreoffice-convert";

export const convertToPdf = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const ext = path.extname(filePath).toLowerCase();

        // already pdf or image
        if ([".pdf", ".png", ".jpg", ".jpeg"].includes(ext)) {
            return resolve(filePath);
        }

        const fileBuffer = fs.readFileSync(filePath);

        libre.convert(fileBuffer, ".pdf", undefined, (err, done) => {
            if (err) return reject(err);

            const pdfPath = filePath.replace(ext, ".pdf");
            fs.writeFileSync(pdfPath, done);
            resolve(pdfPath);
        });
    });
};

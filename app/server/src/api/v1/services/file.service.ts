import path from "path";
import fs from "fs";

export const getFilePath = (filename: string) => {
    const filePath = path.join(__dirname, "../../uploads", filename);

    if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
    }

    return filePath;
};

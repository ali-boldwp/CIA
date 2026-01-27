import path from "path";
import fs from "fs";
import mammoth from "mammoth";
import xlsx from "xlsx";

export const convertToHtml = async (filePath: string): Promise<{ html: string; metadata: any }> => {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    const fileStats = fs.statSync(filePath);
    const metadata = {
        fileName,
        fileSize: fileStats.size,
        fileType: ext.replace('.', '').toUpperCase(),
        lastModified: fileStats.mtime,
        isImage: false,
        isPdf: false
    };

    try {
        // ========== IMAGE FILES ==========
        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'].includes(ext)) {
            return {
                html: '',
                metadata: { ...metadata, isImage: true }
            };
        }

        // ========== PDF FILES ==========
        else if (ext === ".pdf") {
            // For PDF, create a simple text representation
            const html = `
                <div class="pdf-file">
                    <h3>PDF Document: ${fileName}</h3>
                    <p><strong>File Information:</strong></p>
                    <ul>
                        <li>Type: PDF Document</li>
                        <li>Size: ${(fileStats.size / 1024).toFixed(2)} KB</li>
                        <li>Last Modified: ${new Date(fileStats.mtime).toLocaleString()}</li>
                    </ul>
                    <p><em>Note: PDF content requires special library for text extraction.</em></p>
                    <p><em>Install 'pdf-parse' package to extract text from PDF files.</em></p>
                </div>
            `;

            return { html, metadata: { ...metadata, isPdf: true } };
        }

        // ========== WORD DOCUMENTS ==========
        else if (ext === ".doc" || ext === ".docx") {
            const result = await mammoth.convertToHtml({ path: filePath });

            // Simplify HTML for better text extraction
            let simpleHtml = result.value
                .replace(/<h1[^>]*>/g, '<h1>')
                .replace(/<h2[^>]*>/g, '<h2>')
                .replace(/<h3[^>]*>/g, '<h3>')
                .replace(/<p[^>]*>/g, '<p>')
                .replace(/<strong[^>]*>/g, '<strong>')
                .replace(/<em[^>]*>/g, '<em>')
                .replace(/<ul[^>]*>/g, '<ul>')
                .replace(/<li[^>]*>/g, '<li>')
                .replace(/<table[^>]*>/g, '<table>')
                .replace(/<tr[^>]*>/g, '<tr>')
                .replace(/<td[^>]*>/g, '<td>')
                .replace(/<th[^>]*>/g, '<th>');

            const html = `
                <div class="word-document">
                    <h1>Word Document: ${fileName}</h1>
                    ${simpleHtml}
                    <hr />
                    <p><small>File Information: ${metadata.fileType}, ${(fileStats.size / 1024).toFixed(2)} KB, ${new Date(fileStats.mtime).toLocaleString()}</small></p>
                </div>
            `;

            return { html, metadata };
        }

        // ========== EXCEL FILES ==========
        else if (ext === ".xls" || ext === ".xlsx") {
            const workbook = xlsx.readFile(filePath);
            let tablesHtml = '';

            workbook.SheetNames.forEach((sheetName, index) => {
                const worksheet = workbook.Sheets[sheetName];
                const html = xlsx.utils.sheet_to_html(worksheet);

                tablesHtml += `
                    <div class="excel-sheet">
                        <h3>Sheet ${index + 1}: ${sheetName}</h3>
                        ${html}
                    </div>
                `;
            });

            const html = `
                <div class="excel-workbook">
                    <h1>Excel Workbook: ${fileName}</h1>
                    <p>Total Sheets: ${workbook.SheetNames.length}</p>
                    ${tablesHtml}
                    <hr />
                    <p><small>File Information: ${metadata.fileType}, ${(fileStats.size / 1024).toFixed(2)} KB, ${new Date(fileStats.mtime).toLocaleString()}</small></p>
                </div>
            `;

            return { html, metadata };
        }

        // ========== TEXT FILES ==========
        else if (ext === ".txt") {
            const textContent = fs.readFileSync(filePath, "utf-8");

            const html = `
                <div class="text-file">
                    <h1>Text File: ${fileName}</h1>
                    <pre>${textContent}</pre>
                    <hr />
                    <p><small>File Information: ${metadata.fileType}, ${(fileStats.size / 1024).toFixed(2)} KB, ${new Date(fileStats.mtime).toLocaleString()}</small></p>
                    <p><small>Character Count: ${textContent.length} | Line Count: ${textContent.split('\n').length}</small></p>
                </div>
            `;

            return { html, metadata };
        }

        // ========== CSV FILES ==========
        else if (ext === ".csv") {
            const csvContent = fs.readFileSync(filePath, "utf-8");
            const lines = csvContent.split('\n').filter(line => line.trim() !== '');

            let tableHtml = '<table border="1">';
            lines.forEach((line, index) => {
                tableHtml += '<tr>';
                line.split(',').forEach(cell => {
                    if (index === 0) {
                        tableHtml += `<th>${cell}</th>`;
                    } else {
                        tableHtml += `<td>${cell}</td>`;
                    }
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';

            const html = `
                <div class="csv-file">
                    <h1>CSV File: ${fileName}</h1>
                    <p>Rows: ${lines.length} | Columns: ${lines[0] ? lines[0].split(',').length : 0}</p>
                    ${tableHtml}
                    <hr />
                    <p><small>File Information: ${metadata.fileType}, ${(fileStats.size / 1024).toFixed(2)} KB, ${new Date(fileStats.mtime).toLocaleString()}</small></p>
                </div>
            `;

            return { html, metadata };
        }

        // ========== OTHER FILES ==========
        else {
            const html = `
                <div class="other-file">
                    <h1>File: ${fileName}</h1>
                    <p><strong>File Type:</strong> ${ext.toUpperCase()}</p>
                    <p><strong>File Size:</strong> ${(fileStats.size / 1024).toFixed(2)} KB</p>
                    <p><strong>Last Modified:</strong> ${new Date(fileStats.mtime).toLocaleString()}</p>
                    <p><em>This file format cannot be displayed as text content.</em></p>
                </div>
            `;

            return { html, metadata };
        }

    } catch (error) {
        console.error(`Error converting ${filePath}:`, error);

        const html = `
            <div class="error">
                <h1>Error Processing File</h1>
                <p><strong>File:</strong> ${fileName}</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>File Size:</strong> ${(fileStats.size / 1024).toFixed(2)} KB</p>
                <p><em>Unable to convert this file to readable content.</em></p>
            </div>
        `;

        return { html, metadata };
    }
};
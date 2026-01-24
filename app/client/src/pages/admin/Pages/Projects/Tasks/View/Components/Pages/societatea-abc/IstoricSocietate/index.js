import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    const chronologyColumns = ["DATA", "MENTIUNI"];

    /* =========================
       LOCAL STATE
    ========================== */
    const [historyText, setHistoryText] = useState("");
    const [chronologyRows, setChronologyRows] = useState([]);
    const [images, setImages] = useState([]);

    /* =========================
       INIT FROM FORM VALUES
    ========================== */
    useEffect(() => {
        setHistoryText(formValues?.istoric?.historyText || "");

        const rows =
            formValues?.istoric?.chronology?.rows?.length > 0
                ? formValues.istoric.chronology.rows.map(row =>
                    Array.isArray(row) ? { DATA: row[0], MENTIUNI: row[1] } : row
                )
                : [
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Schimbare sediu social" },
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Majorare capital social" },
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Numire / Revocare administrator" }
                ];

        setChronologyRows(rows);
        setImages(formValues?.istoric?.images || []);
    }, [formValues]);

    /* =========================
       HANDLERS
    ========================== */
    const addRow = () => setChronologyRows([...chronologyRows, { DATA: "", MENTIUNI: "" }]);

    const deleteRow = (index) =>
        setChronologyRows(chronologyRows.filter((_, i) => i !== index));

    const handleRowChange = (index, key, value) => {
        const updated = chronologyRows.map((row, i) =>
            i === index ? { ...row, [key]: value } : row
        );
        setChronologyRows(updated);
    };

    const handleImagesChange = (imgs) => setImages(imgs);

    /* =========================
       SAVE HANDLER
    ========================== */
    const handleSave = () => {
        const payload = {
            data: {
                istoric: {
                    historyText: historyText,
                    images: images,
                    chronology: {
                        columns: chronologyColumns,
                        rows: chronologyRows.map(r => [r.DATA, r.MENTIUNI])
                    }
                }
            }
        };

        console.log("FINAL PAYLOAD FOR API:", payload);
        onSaveSection(payload);

        // optional: update formValues after save
        setFormValues(prev => ({
            ...prev,
            istoric: payload.data.istoric
        }));
    };

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 2. Istoric societate
                </h1>

                {/* ISTORIC TEXT */}
                <h3 className={styles.sectionTitle}>✏️ Istoricul societății</h3>
                <div className={styles.textAreaWrapper}>
          <textarea
              className={styles.textarea}
              placeholder="[Scrie aici textul narativ – multiline]"
              value={historyText}
              onChange={(e) => setHistoryText(e.target.value)}
          />
                    <div className={styles.deleteBoxContainer}>
                        <button
                            className={styles.deleteBox}
                            onClick={() => setHistoryText("")}
                        >
                            Șterge căsuța
                        </button>
                    </div>
                </div>

                {/* CRONOLOGIE TABLE */}
                <h3 className={styles.sectionTitle}>
                    📜 Cronologia Mențiunilor Publicate în Monitorul Oficial
                </h3>

                <table className={styles.editableTableIstoric}>
                    <thead>
                    <tr>
                        {chronologyColumns.map((col, i) => <th key={i}>{col}</th>)}
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {chronologyRows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    value={row.DATA}
                                    placeholder="[zz.ll.aaaa]"
                                    onChange={(e) => handleRowChange(index, "DATA", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    value={row.MENTIUNI}
                                    placeholder="descriere editabilă"
                                    onChange={(e) => handleRowChange(index, "MENTIUNI", e.target.value)}
                                />
                            </td>
                            <td>
                                <button
                                    className={styles.trash}
                                    onClick={() => deleteRow(index)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className={styles.addRow} onClick={addRow}>
                    + Adaugă rând
                </button>

                {/* IMAGES */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / Grafice</h3>
                    <ImagePlaceholder images={images} setImages={handleImagesChange} />
                </div>

                {/* SAVE */}
                <div className={styles.navigation}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        💾 Salvează secțiunea
                    </button>
                    <button className={styles.nextButton}>
                        ➡️ Mergi la I.3. Date financiare
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Index;

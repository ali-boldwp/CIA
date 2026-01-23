import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    /* =========================
       CONSTANTS
    ========================== */
    const chronologyColumns = ["DATA", "MENTIUNI"];

    /* =========================
       SAFE STATE
    ========================== */
    const historyText = formValues?.istoric?.historyText || "";

    const chronology =
        formValues?.istoric?.chronology?.rows?.length > 0
            ? formValues.istoric.chronology
            : {
                columns: chronologyColumns,
                rows: [
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Schimbare sediu social" },
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Majorare capital social" },
                    { DATA: "[zz.ll.aaaa]", MENTIUNI: "Numire / Revocare administrator" }
                ]
            };

    const rows = chronology.rows;
    const images = formValues?.istoric?.images || [];

    /* =========================
       NORMALIZE FOR BACKEND
    ========================== */
    const normalizeChronologyForSave = (chronology) => {
        if (!chronology?.columns || !chronology?.rows) return [];

        // sirf values ka array banaye
        return chronology.rows.map(row =>
            chronology.columns.map(col => row[col] ?? "")
        );
    };

    /* =========================
       UPDATE WHOLE SECTION
    ========================== */
    const updateIstoric = (newRows, newImages = images, newHistory = historyText) => {
        setFormValues(prev => ({
            ...prev,
            istoric: {
                historyText: newHistory,
                images: newImages,
                chronology: {
                    columns: chronologyColumns,
                    rows: newRows
                }
            }
        }));
    };

    /* =========================
       HANDLERS
    ========================== */
    const setHistoryText = (text) => {
        updateIstoric(rows, images, text);
    };

    const addRow = () => {
        updateIstoric([...rows, { DATA: "", MENTIUNI: "" }]);
    };

    const deleteRow = (index) => {
        updateIstoric(rows.filter((_, i) => i !== index));
    };

    const handleRowChange = (index, key, value) => {
        const updated = rows.map((row, i) =>
            i === index ? { ...row, [key]: value } : row
        );
        updateIstoric(updated);
    };

    const setImages = (imgs) => {
        updateIstoric(rows, imgs);
    };

    /* =========================
       SAVE HANDLER
    ========================== */
    const handleSave = () => {
        // Normalize chronology rows: sirf values
        const normalizedChronology = rows.map(row =>
            chronology.columns.map(col => row[col] ?? "")
        );

        // Prepare final payload for API
        const payload = {
            data: {
                istoric: {
                    historyText: historyText,
                    images: images,
                    chronology: normalizedChronology
                }
            }
        };

        console.log("FINAL PAYLOAD FOR API:", payload);

        // Call parent save function with payload
        onSaveSection(payload);
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

                {/* ===== ISTORIC TEXT ===== */}
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

                {/* ===== CRONOLOGIE TABLE ===== */}
                <h3 className={styles.sectionTitle}>
                    📜 Cronologia Mențiunilor Publicate în Monitorul Oficial
                </h3>

                <table className={styles.editableTableIstoric}>
                    <thead>
                    <tr>
                        {chronology.columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    value={row.DATA}
                                    placeholder="[zz.ll.aaaa]"
                                    onChange={(e) =>
                                        handleRowChange(index, "DATA", e.target.value)
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    value={row.MENTIUNI}
                                    placeholder="descriere editabilă"
                                    onChange={(e) =>
                                        handleRowChange(index, "MENTIUNI", e.target.value)
                                    }
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

                {/* ===== IMAGES ===== */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / Grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                {/* ===== SAVE ===== */}
                <div className={styles.navigation}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                    >
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

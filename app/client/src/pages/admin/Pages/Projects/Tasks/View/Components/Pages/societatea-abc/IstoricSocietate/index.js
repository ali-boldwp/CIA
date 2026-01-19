import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // ===== SAFE STATE =====
    const historyText = formValues?.istoric?.historyText || "";

    const rows = (formValues?.istoric?.chronology && formValues.istoric.chronology.length > 0)
        ? formValues.istoric.chronology
        : [
            { date: "[zz.ll.aaaa]", note: "Schimbare sediu social" },
            { date: "[zz.ll.aaaa]", note: "Majorare capital social" },
            { date: "[zz.ll.aaaa]", note: "Numire/Revocare administrator" }
        ];

    const images = formValues?.istoric?.images || [];

    // ===== SETTERS =====
    const setHistoryText = (text) => {
        setFormValues(prev => ({
            ...prev,
            istoric: {
                ...prev.istoric,
                historyText: text,
                chronology: rows,
                images
            }
        }));
    };

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            istoric: {
                ...prev.istoric,
                historyText,
                chronology: newRows,
                images
            }
        }));
    };

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            istoric: {
                ...prev.istoric,
                historyText,
                chronology: rows,
                images: imgs
            }
        }));
    };

    // ===== HANDLERS =====
    const addRow = () => setRows([...rows, { date: "", note: "" }]);
    const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));
    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    // ===== SAVE DATA (example) =====
    const handleSave = () => {
        console.log("FINAL DATA:", formValues.istoric);
        // You can call backend API here
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 2. Istoric societate
                </h1>

                {/* ===== ISTORIC ===== */}
                <h3 className={styles.sectionTitle}>✏️ Istoricul societății</h3>

                <div className={styles.textAreaWrapper}>
                    <textarea
                        className={styles.textarea}
                        placeholder="[Scrie aici textul narativ – multiline]"
                        value={historyText}
                        onChange={(e) => setHistoryText(e.target.value)}
                    />
                    <button
                        className={styles.deleteBox}
                        onClick={() => setHistoryText("")}
                    >
                        Șterge căsuța
                    </button>
                </div>

                {/* ===== CRONOLOGIE ===== */}
                <h3 className={styles.sectionTitle}>
                    📜 Cronologia mențiunilor publicate în Monitorul Oficial
                </h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>DATA</th>
                        <th>MENȚIUNI</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={row.date}
                                    placeholder="[zz.ll.aaaa]"
                                    onChange={(e) =>
                                        handleRowChange(index, "date", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.note}
                                    placeholder="descriere editabilă – ex.: Schimbare sediu social"
                                    onChange={(e) =>
                                        handleRowChange(index, "note", e.target.value)
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
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                {/* ===== NAVIGATION ===== */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                        >
                            <span className={styles.saveIcon}>💾</span>
                            Salveaza sectiunea
                        </button>

                        <button className={styles.middleButton}>
                            ❌ Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>

                        <button className={styles.nextButton}>
                            ➡️ Mergi la I.3. „Date fianciare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const DatoriiSiInscrieri = ({ formValues, setFormValues, onSaveSection }) => {
    const columns = ["ACT JURIDIC / DATA", "CREDITOR", "DETALII"];

    const rows = (formValues?.datorii?.rows && formValues.datorii.rows.length > 0)
        ? formValues.datorii.rows
        : [{ date: "", note: "", details: "" }];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            datorii: {
                ...prev.datorii,
                rows: newRows,
                introducere: formValues?.datorii?.introducere || "",
                images: formValues?.datorii?.images || []
            }
        }));
    };

    const addRow = () => setRows([...rows, { date: "", note: "", details: "" }]);
    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows.length > 0 ? newRows : [{ date: "", note: "", details: "" }]);
    };

    const introducere = formValues?.datorii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            datorii: {
                ...prev.datorii,
                introducere: text,
                rows,
                images: formValues?.datorii?.images || []
            }
        }));
    };

    const images = formValues?.datorii?.images || [];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            datorii: {
                ...prev.datorii,
                images: imgs,
                rows,
                introducere
            }
        }));
    };

    // ✅ Prepare payload in desired JSON format
    const handleSave = () => {
        const payload = {
            introducere,
            table: { columns, rows: rows.map((r) => [r.date, r.note, r.details]) },
            images,
        };
        onSaveSection(payload); // ✅ call parent save function
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 5. Datorii si inscrieri mobiliare
                </h1>

                <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                <textarea
                    className={styles.textarea}
                    placeholder="In urma verificarilor..."
                    value={introducere}
                    onChange={e => setIntroducere(e.target.value)}
                />
                <button className={styles.deleteBox} onClick={() => setIntroducere("")}>
                    Șterge căsuța
                </button>

                <h3 className={styles.sectionTitle}>📋 Tabel datorii si inscrieri mobiliare</h3>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {columns.map((col, i) => <th key={i}>{col}</th>)}
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Act juridic / Data]"
                                    value={row.date || ""}
                                    onChange={e => {
                                        const newRows = [...rows];
                                        newRows[idx].date = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Creditor]"
                                    value={row.note || ""}
                                    onChange={e => {
                                        const newRows = [...rows];
                                        newRows[idx].note = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Detalii]"
                                    value={row.details || ""}
                                    onChange={e => {
                                        const newRows = [...rows];
                                        newRows[idx].details = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <button className={styles.trash} onClick={() => deleteRow(idx)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button className={styles.addRow} onClick={addRow}>+ Adaugă rând</button>

                <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                <ImagePlaceholder images={images} setImages={setImages} />

                <div className={styles.navButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        <span className={styles.saveIcon}>💾</span> Salveaza sectiunea
                    </button>
                    <button className={styles.middleButton}>
                        ❌ Exclude acest capitol
                        <span className={styles.arrowIcon}>→</span>
                    </button>

                    <button className={styles.nextButton}>
                        ➡️ Mergi la I.6. „Achizitii SEAP”
                        <span className={styles.arrowIcon}>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatoriiSiInscrieri;

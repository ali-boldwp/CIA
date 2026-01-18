import React, { useEffect } from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {

    // Ensure at least 1 row exists by default
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

    const addRow = () => {
        setRows([...rows, { date: "", note: "", details: "" }]);
    };

    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows.length > 0 ? newRows : [{ date: "", note: "", details: "" }]);
    };

    // Load and sync introducere text
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

    // Load and sync images
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

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 5. Datorii si inscrieri mobiliare
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Situatia inscrierilor active existente in RNPM (AEGRM)</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="In urma verificarilor efectuate in registrele publice, inclusiv in Arhiva Electronica de Garantii Reale Mobiliare (AEGRM), a rezultat ca Societatea [denumire societate] are inregistrate un numar de __ ipoteci mobiliare in favoarea creditorilor, printre care mentionam: "
                        value={introducere}
                        onChange={(e) => setIntroducere(e.target.value)}
                    />
                    <button
                        className={styles.deleteBox}
                        onClick={() => setIntroducere("")}
                    >
                        Șterge căsuța
                    </button>
                </div>

                {/* Cronologie */}
                <h3 className={styles.sectionTitle}>
                    📋 Tabel datorii si inscrieri mobiliare
                </h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ACT JURIDIC / DATA</th>
                        <th>CREDITOR</th>
                        <th>DETALII</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Act juridic / Data]"
                                    value={row.date || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].date = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Creditor]"
                                    value={row.note || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].note = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Detalii - Valoare, obiect, termen etc.]"
                                    value={row.details || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].details = e.target.value;
                                        setRows(newRows);
                                    }}
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

                {/* Image Section */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton}>
                            <span className={styles.saveIcon}>💾</span>
                            Salveaza sectiunea
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
        </div>
    );
};

export default Index;

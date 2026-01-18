import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // 1️⃣ Rows (table) with default 1 row if empty
    const rows = (formValues?.achizitii?.rows && formValues.achizitii.rows.length > 0)
        ? formValues.achizitii.rows
        : [{ tip: "", autoritate: "", obiect: "", valoare: "", data: "" }];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                rows: newRows,
                introducere: formValues?.achizitii?.introducere || "",
                images: formValues?.achizitii?.images || []
            }
        }));
    };

    const addRow = () => {
        setRows([...rows, { tip: "", autoritate: "", obiect: "", valoare: "", data: "" }]);
    };

    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows.length > 0 ? newRows : [{ tip: "", autoritate: "", obiect: "", valoare: "", data: "" }]);
    };

    // 2️⃣ Introducere textarea
    const introducere = formValues?.achizitii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                introducere: text,
                rows,
                images: formValues?.achizitii?.images || []
            }
        }));
    };

    // 3️⃣ Images section
    const images = formValues?.achizitii?.images || [];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
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
                    I. Societatea ABC | 6. Achizitii SEAP
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Conform verificarilor efectuate la autoritatile publice, in perioada [2023–2025], Societatea [denumire societate] a fost selectata in peste [50] de proceduri de achizitie publica..."
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

                {/* Tabel Achizitii */}
                <h3 className={styles.sectionTitle}>📋 Tabel achizitii SEAP</h3>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>TIP ACHIZITIE</th>
                        <th>AUTORITATE CONTRACTANTA</th>
                        <th>OBIECT CONTRACT</th>
                        <th>VALOARE CONTRACT (RON)</th>
                        <th>DATA</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Tip achizitie]"
                                    value={row.tip || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].tip = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Autoritate contractanta]"
                                    value={row.autoritate || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].autoritate = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Obiect contract]"
                                    value={row.obiect || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].obiect = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Valoare]"
                                    value={row.valoare || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].valoare = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Data]"
                                    value={row.data || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].data = e.target.value;
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

                {/* Images Section */}
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
                            ❌  Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                        <button className={styles.nextButton}>
                            ➡️  Mergi la I.7. „Marci OSIM”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

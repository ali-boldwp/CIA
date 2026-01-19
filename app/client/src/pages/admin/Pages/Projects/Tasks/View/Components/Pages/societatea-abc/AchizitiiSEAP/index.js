import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // 1️⃣ Safe rows
    const rows = (formValues?.achizitii?.rows && formValues.achizitii.rows.length > 0)
        ? formValues.achizitii.rows
        : [{ tip: "", autoritate: "", obiect: "", valoare: "", data: "" }];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                rows: newRows.length > 0 ? newRows : [{ tip: "", autoritate: "", obiect: "", valoare: "", data: "" }],
                introducere: prev.achizitii?.introducere || "",
                images: prev.achizitii?.images || []
            }
        }));
    };

    const addRow = () => setRows([...rows, { tip: "", autoritate: "", obiect: "", valoare: "", data: "" }]);

    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // 2️⃣ Introducere
    const introducere = formValues?.achizitii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                introducere: text,
                rows,
                images: prev.achizitii?.images || []
            }
        }));
    };

    // 3️⃣ Images section (initially always 1 uploader if empty)
    const images = formValues?.achizitii?.images && formValues.achizitii.images.length > 0
        ? formValues.achizitii.images
        : [null];

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                images: imgs.length > 0 ? imgs : [null],
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
                <h4 className={styles.secondhalf}>
                    Analiza evolutiei financiare, tabel pe ultimii 3 ani si anexe grafice
                </h4>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Conform verificarilor efectuate la autoritatile publice, in perioada [2023–2025], Societatea [denumire societate] a fost selectata in peste [50] de proceduri de achizitie publica..."
                        value={introducere}
                        onChange={(e) => setIntroducere(e.target.value)}
                    />
                    <div className={styles.deleteBoxContainer}>
                    <button
                        className={styles.deleteBox}
                        onClick={() => setIntroducere("")}
                    >
                        Șterge căsuța
                    </button>
                    </div>
                </div>

                {/* Tabel Achizitii */}
                <h3 className={styles.sectionTitle}>📋 Tabel Achizitii SEAP</h3>
                <table className={styles.editableTableIstoric}>
                    <thead>
                    <tr>
                        <th>TIP ACHIZITIE</th>
                        <th>AUTORITATE CONTRACTANTA</th>
                        <th>OBIECT CONTRACT</th>
                        <th>VALOARE CONTRACT (RON)</th>
                        <th>DATA</th>
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {["tip", "autoritate", "obiect", "valoare", "data"].map((key, i) => (
                                <td key={i}>
                                    <input
                                        type="text"
                                        placeholder={`[${key}]`}
                                        value={row[key] || ""}
                                        onChange={(e) => {
                                            const newRows = [...rows];
                                            newRows[index][key] = e.target.value;
                                            setRows(newRows);
                                        }}
                                    />
                                </td>
                            ))}
                            <td>
                                <button className={styles.trash} onClick={() => deleteRow(index)}>🗑️</button>
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
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button
                            className={styles.saveButton}

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

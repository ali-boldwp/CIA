import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {

    /* =========================
       DEFAULT STRUCTURE
    ========================== */
    const defaultColumns = [
        "TIP ACHIZITIE",
        "AUTORITATE CONTRACTANTA",
        "OBIECT CONTRACT",
        "VALOARE CONTRACT (RON)",
        "DATA"
    ];

    const columns =
        formValues?.achizitii?.columns?.length > 0
            ? formValues.achizitii.columns
            : defaultColumns;

    const rows =
        formValues?.achizitii?.rows?.length > 0
            ? formValues.achizitii.rows
            : [["", "", "", "", ""]];

    /* =========================
       ROWS HANDLERS
    ========================== */
    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                columns,
                rows: newRows.length > 0 ? newRows : [["", "", "", "", ""]],
                introducere: prev.achizitii?.introducere || "",
                images: prev.achizitii?.images || []
            }
        }));
    };

    const addRow = () => {
        setRows([...rows, ["", "", "", "", ""]]);
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    /* =========================
       INTRODUCERE
    ========================== */
    const introducere = formValues?.achizitii?.introducere || "";

    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                columns,
                rows,
                introducere: text,
                images: prev.achizitii?.images || []
            }
        }));
    };

    /* =========================
       IMAGES
    ========================== */
    const images =
        formValues?.achizitii?.images?.length > 0
            ? formValues.achizitii.images
            : [null];

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            achizitii: {
                ...prev.achizitii,
                columns,
                rows,
                introducere,
                images: imgs.length > 0 ? imgs : [null]
            }
        }));
    };

    /* =========================
       RENDER
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 6. Achizitii SEAP
                </h1>

                <h4 className={styles.secondhalf}>
                    Analiza evolutiei financiare, tabel pe ultimii 3 ani si anexe grafice
                </h4>

                {/* INTRODUCERE */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        value={introducere}
                        placeholder="Conform verificarilor efectuate la autoritatile publice..."
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

                {/* TABLE */}
                <h3 className={styles.sectionTitle}>📋 Tabel Achizitii SEAP</h3>

                <table className={styles.editableTableIstoric}>
                    <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text"
                                        value={cell || ""}
                                        onChange={(e) => {
                                            const newRows = rows.map(r => [...r]);
                                            newRows[rowIndex][colIndex] = e.target.value;
                                            setRows(newRows);
                                        }}
                                    />
                                </td>
                            ))}
                            <td>
                                <button
                                    className={styles.trash}
                                    onClick={() => deleteRow(rowIndex)}
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
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                {/* NAVIGATION */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton}>
                            💾 Salveaza sectiunea
                        </button>

                        <button className={styles.middleButton}>
                            ❌ Exclude acest capitol →
                        </button>

                        <button className={styles.nextButton}>
                            ➡️ Mergi la I.3. „Date financiare”
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

import React  from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // --- Table rows ---
    const rows = formValues?.marciOSIM?.rows || [
        { name: "", details: "" } // default ek row
    ];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            marciOSIM: {
                ...prev.marciOSIM,
                rows: newRows,
                introducere: prev.marciOSIM?.introducere || "",
                images: prev.marciOSIM?.images || [null]
            }
        }));
    };

    const addRow = () => setRows([...rows, { name: "", details: "" }]);
    const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

    // --- Introducere textarea ---
    const introducere = formValues?.marciOSIM?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            marciOSIM: {
                ...prev.marciOSIM,
                introducere: text,
                rows,
                images: prev.marciOSIM?.images || [null]
            }
        }));
    };

    // --- Images ---
    const images = formValues?.marciOSIM?.images || [null];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            marciOSIM: {
                ...prev.marciOSIM,
                images: imgs.length === 0 ? [null] : imgs, // ensure default 1 uploader
                rows,
                introducere
            }
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 7. Proprietate intelectuala / Marci OSIM
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Potrivit verificarilor efectuate, de-a lungul timpului, Societatea [denumire societate] a inregistrat la Oficiul de Stat pentru Inventii si Marci (OSIM) urmatoarele marci:  "
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

                {/* Tabel Marci */}
                <h3 className={styles.sectionTitle}>
                    ® Tabel marci inregistrate la OSIM
                </h3>

                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>DENUMIRE MARCA</th>
                        <th>DETALII</th>
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Denumire marca]"
                                    value={row.name || ""}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].name = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Detalii marca – an inregistrare, valabilitate, titular, observatii]"
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
                    <h3 className={styles.sectionTitle}>📷 Anexe OSIM (imagini / printscreen)</h3>
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
                            ➡️ Mergi la I.8. „Litigii societate”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

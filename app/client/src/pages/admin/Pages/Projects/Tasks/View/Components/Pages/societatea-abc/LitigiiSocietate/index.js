import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {

    // 1️⃣ Rows (litigii) always from formValues, at least 1
    const rows = (formValues?.litigii?.rows && formValues.litigii.rows.length > 0)
        ? formValues.litigii.rows
        : [{ nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
                rows: newRows.length > 0 ? newRows : [{ nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }],
                introducere: prev.litigii?.introducere || "",
                images: prev.litigii?.images || [null]
            }
        }));
    };

    const addRow = () => setRows([...rows, { nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }]);
    const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    // 2️⃣ Introducere
    const introducere = formValues?.litigii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
                introducere: text,
                rows,
                images: prev.litigii?.images || [null]
            }
        }));
    };

    // 3️⃣ Images
    const images = (formValues?.litigii?.images && formValues.litigii.images.length > 0)
        ? formValues.litigii.images
        : [null];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
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
                    I. Societatea ABC |  8. Litigii societate
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Potrivit verificarilor efectuate la autoritatile publice, Societatea [denumire societate] figureaza cu calitati procesuale în cadrul a [nr.] de dosare civile și [nr.] de dosare penale. Dintre acestea, mentionam:"
                        value={introducere}
                        onChange={(e) => setIntroducere(e.target.value)}
                    />
                    <button className={styles.deleteBox} onClick={() => setIntroducere("")}>Șterge căsuța</button>
                </div>

                {/* ⚖️ Fisa individuala litigiu */}
                <h3 className={styles.sectionTitle}>⚖️ Fisa individuala litigiu</h3>

                {rows.map((row, index) => (
                    <div key={index} className={styles.litigiuCard}>
                        {Object.entries(row).map(([field, value]) => (
                            <div key={field} className={styles.formRow}>
                                <label>{field.toUpperCase().replace(/([A-Z])/g, ' $1')}:</label>
                                <input
                                    type="text"
                                    value={value || ""}
                                    onChange={(e) => handleChange(index, field, e.target.value)}
                                />
                            </div>
                        ))}
                        <button className={styles.trash} onClick={() => deleteRow(index)}>🗑️ Șterge litigiu</button>
                    </div>
                ))}

                <button className={styles.addRow} onClick={addRow}>+ Adaugă litigiu</button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>
            </div>
        </div>
    );
};

export default Index;

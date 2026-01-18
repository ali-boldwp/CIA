import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // Initialize litigii array in formValues if not exists
    const litigii = formValues?.litigii?.rows || [
        { nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }
    ];

    const setRows = (newRows) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
                rows: newRows,
                introducere: prev.litigii?.introducere || "",
                images: prev.litigii?.images || []
            }
        }));
    };

    // Introducere text
    const introducere = formValues?.litigii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
                introducere: text,
                rows: litigii,
                images: prev.litigii?.images || []
            }
        }));
    };

    // Images
    const images = formValues?.litigii?.images || [];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            litigii: {
                ...prev.litigii,
                images: imgs,
                rows: litigii,
                introducere
            }
        }));
    };

    const addRow = () => {
        setRows([...litigii, { nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }]);
    };

    const deleteRow = (index) => {
        setRows(litigii.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const newRows = [...litigii];
        newRows[index][field] = value;
        setRows(newRows);
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
                        placeholder="Potrivit verificarilor efectuate la autoritatile publice, Societatea [denumire societate] figureaza cu calitati procesuale in cadrul a [nr.] de dosare civile si [nr.] de dosare penale. Dintre acestea, mentionam:"
                        value={introducere}
                        onChange={(e) => setIntroducere(e.target.value)}
                    />
                    <button className={styles.deleteBox} onClick={() => setIntroducere("")}>Șterge căsuța</button>
                </div>

                {/* ⚖️ Fisa individuala litigiu */}
                <h3 className={styles.sectionTitle}>⚖️ Fisa individuala litigiu</h3>

                {litigii.map((row, index) => (
                    <div key={index} className={styles.litigiuCard}>
                        <div className={styles.formRow}>
                            <label>NR. DOSAR:</label>
                            <input
                                type="text"
                                value={row.nrDosar || ""}
                                onChange={(e) => handleChange(index, "nrDosar", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>DATA:</label>
                            <input
                                type="text"
                                value={row.data || ""}
                                onChange={(e) => handleChange(index, "data", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>INSTANTA:</label>
                            <input
                                type="text"
                                value={row.instanta || ""}
                                onChange={(e) => handleChange(index, "instanta", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>OBIECT:</label>
                            <input
                                type="text"
                                value={row.obiect || ""}
                                onChange={(e) => handleChange(index, "obiect", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>MATERIE:</label>
                            <input
                                type="text"
                                value={row.materie || ""}
                                onChange={(e) => handleChange(index, "materie", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>STADIU PROCESUAL:</label>
                            <input
                                type="text"
                                value={row.stadiu || ""}
                                onChange={(e) => handleChange(index, "stadiu", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>PARTI IN DOSAR:</label>
                            <input
                                type="text"
                                value={row.parti || ""}
                                onChange={(e) => handleChange(index, "parti", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>DATA SOLUTIEI:</label>
                            <input
                                type="text"
                                value={row.dataSolutiei || ""}
                                onChange={(e) => handleChange(index, "dataSolutiei", e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>SOLUTIA:</label>
                            <input
                                type="text"
                                value={row.solutia || ""}
                                onChange={(e) => handleChange(index, "solutia", e.target.value)}
                            />
                        </div>

                        <button className={styles.trash} onClick={() => deleteRow(index)}>🗑️ Șterge litigiu</button>
                    </div>
                ))}

                <button className={styles.addRow} onClick={addRow}>+ Adaugă litigiu</button>

                {/* Images */}
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
                            ➡️  Mergi la I.9. „Participatii”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

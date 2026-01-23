import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    /* =========================
       LOCAL STATE
    ========================== */
    const [title, setTitle] = useState("");
    const [introText, setIntroText] = useState("");
    const [columns] = useState(["Denumire", "Descriere"]); // fixed columns
    const [rows, setRows] = useState([["", ""]]); // 2D array
    const [images, setImages] = useState([null]);

    /* =========================
       INIT FROM FORM VALUES
    ========================== */
    useEffect(() => {
        setTitle(formValues?.mainSection?.title || "");
        setIntroText(formValues?.mainSection?.introText || "In urma verificării surselor disponibile...");
        setRows(
            formValues?.mainSection?.rows?.length > 0
                ? formValues.mainSection.rows
                : [["", ""]]
        );
        setImages(formValues?.mainSection?.images || [null]);
    }, [formValues]);

    /* =========================
       TABLE HANDLERS (2D array)
    ========================== */
    const addRow = () => setRows([...rows, ["", ""]]);
    const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));
    const handleCellChange = (rowIndex, colIndex, value) => {
        const updated = rows.map((row, i) =>
            i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
        );
        setRows(updated);
    };

    /* =========================
       IMAGE HANDLER
    ========================== */
    const handleImagesChange = (imgs) => setImages(imgs);

    /* =========================
       SAVE HANDLER
    ========================== */
    const handleSave = () => {
        const payload = {
            data: {
                mainSection: {
                    title,
                    introText,
                    columns,
                    rows,
                    images
                }
            }
        };

        console.log("FINAL PAYLOAD FOR API:", payload);
        onSaveSection && onSaveSection(payload);

        setFormValues(prev => ({
            ...prev,
            mainSection: payload.data.mainSection
        }));
    };

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <TitleSection value={title} onChange={setTitle} />
                <TextAreaSection
                    value={introText}
                    onChange={setIntroText}
                    onClear={() => setIntroText("")}
                />

                <h3 className={styles.sectionTitle}>📊 Lista partenerilor contractuali</h3>
                <TableSection
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    addRow={addRow}
                    deleteRow={deleteRow}
                    handleCellChange={handleCellChange}
                />

                <div className={styles.sectionWrapper}>
                    <ImageSection
                        images={images}
                        setImages={handleImagesChange}
                    />
                </div>

                <div className={styles.navigation}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        💾 Salvează secțiunea
                    </button>
                    <button className={styles.middleButton}>
                        ❌ Exclude acest capitol
                        <span className={styles.arrowIcon}>→</span>
                    </button>
                    <button className={styles.nextButton}>
                        ➡️ Mergi la I.3. „Date financiare”
                        <span className={styles.arrowIcon}>→</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Index;

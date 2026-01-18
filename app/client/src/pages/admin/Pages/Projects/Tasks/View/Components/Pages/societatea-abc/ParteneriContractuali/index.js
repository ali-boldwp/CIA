import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';

const Index = ({ formValues, setFormValues }) => {
    const [title, setTitle] = useState("");
    const [introText, setIntroText] = useState(
        "In urma verificării surselor disponibile si a consultarilor cu persoane avizate, a fost conturata o lista a partenerilor contractuali ai Societatii [denumire societate], incluzand companii precum:"
    );
    const [tableRows, setTableRows] = useState([{ denumire: "", descriere: "" }]);
    const [images, setImages] = useState([null]);

    // 🧠 Load existing data (edit mode)
    useEffect(() => {
        if (formValues?.mainSection) {
            const data = formValues.mainSection;
            setIntroText(data.introText || introText);
            setTableRows(data.tableRows || [{ denumire: "", descriere: "" }]);
            setImages(data.images || [null]);
        }
    }, []);

    // 🔄 Sync to parent state
    useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            mainSection: {
                introText,
                tableRows,
                images
            }
        }));
    }, [title, introText, tableRows, images]);

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                {/* Title Section */}
                <TitleSection value={title} onChange={setTitle} />

                {/* TextArea Section */}
                <TextAreaSection
                    value={introText}
                    onChange={setIntroText}
                    onClear={() => setIntroText("")}
                />

                {/* Table Section */}
                <div className={styles.sectionWrapper}>
                    <TableSection
                        rows={tableRows}
                        setRows={setTableRows}
                    />
                </div>

                {/* Image Section */}
                <div className={styles.sectionWrapper}>
                    <ImageSection
                        images={images}
                        setImages={setImages}
                    />
                </div>

                {/* Navigation Buttons */}
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
                            ➡️  Mergi la I.3. „Date fianciare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

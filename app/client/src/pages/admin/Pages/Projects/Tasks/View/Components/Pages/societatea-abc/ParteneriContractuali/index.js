import React from 'react';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';

const Index = ({ formValues, setFormValues }) => {

    // 1️⃣ Safe values from formValues
    const title = formValues?.mainSection?.title || "";
    const introText = formValues?.mainSection?.introText || "In urma verificării surselor disponibile si a consultarilor cu persoane avizate, a fost conturata o lista a partenerilor contractuali ai Societatii [denumire societate], incluzand companii precum:";
    const tableRows = formValues?.mainSection?.tableRows || [{ denumire: "", descriere: "" }];
    const images = formValues?.mainSection?.images || [null];

    // 2️⃣ Setters that update formValues directly
    const setTitle = (text) => {
        setFormValues(prev => ({
            ...prev,
            mainSection: {
                ...prev.mainSection,
                title: text,
                introText,
                tableRows,
                images
            }
        }));
    };

    const setIntroText = (text) => {
        setFormValues(prev => ({
            ...prev,
            mainSection: {
                ...prev.mainSection,
                title,
                introText: text,
                tableRows,
                images
            }
        }));
    };

    const setTableRows = (rows) => {
        setFormValues(prev => ({
            ...prev,
            mainSection: {
                ...prev.mainSection,
                title,
                introText,
                tableRows: rows,
                images
            }
        }));
    };

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            mainSection: {
                ...prev.mainSection,
                title,
                introText,
                tableRows,
                images: imgs
            }
        }));
    };

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

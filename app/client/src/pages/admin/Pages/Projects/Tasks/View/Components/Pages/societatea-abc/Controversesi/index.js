import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";
import NotesPlaceholder from "./NotesPlaceholder";

const ControversyIndex = ({ formValues, setFormValues, onSaveSection }) => {
    // 1️⃣ Initialize subpoints, notes, images
    const subpoints = formValues?.controversy?.subpoints || [
        { title: "10.1. Subtitlu [ex: Implicarea in dosarul Microsoft]", text: "" }
    ];
    const notes = formValues?.controversy?.notes || [null]; // files only
    const images = formValues?.controversy?.images || [null];

    const setSubpoints = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                subpoints: updated,
                notes,
                images
            }
        }));
    };

    const setNotes = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                notes: updated,
                subpoints,
                images
            }
        }));
    };

    const setImagesState = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                images: updated,
                subpoints,
                notes
            }
        }));
    };

    // Add new subpoint
    const addSubpoint = () => {
        setSubpoints([
            ...subpoints,
            { title: `10.${subpoints.length + 1}. Subtitlu`, text: "" }
        ]);
    };

    // Handle subpoint text change
    const handleSubpointChange = (index, value) => {
        const updated = [...subpoints];
        updated[index].text = value;
        setSubpoints(updated);
    };

    // Handle Save
    const handleSave = () => {
        // Only keep File objects or null in notes
        const cleanedNotes = notes.map(n => (n instanceof File ? n : null));
        const cleanedImages = images.map(i => (i instanceof File ? i : i)); // keep blob URLs as is
        const dataToSave = { subpoints, notes: cleanedNotes, images: cleanedImages };
        onSaveSection(dataToSave);
        console.log("Saved controversy data:", dataToSave);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 10. Controverse si aspecte de interes public
                </h1>

                {/* SUBPOINTS */}
                {subpoints.map((sp, i) => (
                    <div key={i} className={styles.textAreaWrapper}>
                        <h3 className={styles.sectionTitle}>{sp.title}</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="[Introdu textul narativ aici]"
                            value={sp.text}
                            onChange={(e) => handleSubpointChange(i, e.target.value)}
                        />
                        <div className={styles.deleteBoxContainer}>
                            <button
                                className={styles.deleteBox}
                                onClick={() => setSubpoints(subpoints.filter((_, idx) => idx !== i))}
                            >
                                Șterge căsuța
                            </button>
                        </div>
                    </div>
                ))}

                <button className={styles.addSubpoint} onClick={addSubpoint}>
                    ➕ Adauga subpunct nou
                </button>

                {/* NOTES + IMAGES */}
                <div className={styles.dualBox}>
                    <NotesPlaceholder notes={notes} setNotes={setNotes} />
                    <ImagePlaceholder images={images} setImages={setImagesState} />
                </div>

                {/* NAVIGATION */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            <span className={styles.saveIcon}>💾</span>
                            Salveaza sectiunea
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
        </div>
    );
};

export default ControversyIndex;

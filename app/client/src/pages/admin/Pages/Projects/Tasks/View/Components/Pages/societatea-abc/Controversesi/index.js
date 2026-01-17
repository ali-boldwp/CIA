import React, { useState } from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder.js";

const Index = () => {
    const [rows, setRows] = useState([
        { date: "[zz.ll.aaaa]", note: "Schimbare sediu social" },
        { date: "[zz.ll.aaaa]", note: "Majorare capital social" },
        { date: "[zz.ll.aaaa]", note: "Numire/Revocare administrator" }
    ]);

    const addRow = () => {
        setRows([...rows, { date: "[zz.ll.aaaa]", note: "" }]);
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };
    const [notes, setNotes] = useState([""]);
    const [images, setImages] = useState([""]);
    const [subpoints, setSubpoints] = useState([
        { title: "10.1. Subtitlu [ex: Implicarea in dosarul Microsoft]", text: "" }
    ]);
    const addNote = () => setNotes([...notes, ""]);
    const addImage = () => setImages([...images, ""]);
    const addSubpoint = () => {
        setSubpoints([
            ...subpoints,
            {
                title: `10.${subpoints.length + 1}. Subtitlu`,
                text: ""
            }
        ]);
    };
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC |   10. Controverse si aspecte de interes public
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Sintetizarea informatiilor cu impact reputational identificate in surse publice si mass-media</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>10.1. Subtitlu [ex: Implicarea in dosarul Microsoft]</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="[Introdu textul narativ aici]"
                    />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* NOTE + IMAGE SECTION */}
                <div className={styles.dualBox}>

                    {/* NOTE / LINK */}
                    <div className={styles.box}>
                        <button className={styles.addBtn} onClick={addNote}>
                            ➕ Adauga nota / link referinta
                        </button>

                        {notes.map((_, i) => (
                            <div key={i} className={styles.dashedBox}>
                                🔗 Zona pentru nota / link
                            </div>
                        ))}
                    </div>

                    {/* IMAGE / PRINTSCREEN */}
                    <div className={styles.box}>
                        <button className={styles.addBtn} onClick={addImage}>
                            ➕ Adauga imagine / printscreen
                        </button>

                        {images.map((_, i) => (
                            <div key={i} className={styles.dashedBox}>
                                🖼️ Zona pentru imagine / printscreen
                            </div>
                        ))}
                    </div>

                </div>

                <button className={styles.addSubpoint} onClick={addSubpoint}>
                    ➕ Adauga subpunct nou
                </button>


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
                            ➡️  Mergi la II. 1. „Profil general asociat”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Index;

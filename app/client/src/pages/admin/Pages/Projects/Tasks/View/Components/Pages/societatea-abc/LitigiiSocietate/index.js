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

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC |  8. Litigii societate
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Analiza litigiilor identificate in bazele de date publice</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Potrivit verificarilor efectuate la autoritatile publice, Societatea [denumire societate] figureaza cu calitati procesuale in cadrul a [nr.] de dosare civile si [nr.] de dosare penale.
                        Dintre acestea, mentionam:
                        "
                    />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* ⚖️ Fisa individuala litigiu */}
                <h3 className={styles.sectionTitle}>⚖️ Fisa individuala litigiu</h3>

                <div className={styles.litigiuCard}>
                    <div className={styles.formRow}>
                        <label>NR. DOSAR:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>DATA:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>INSTANTA:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>OBIECT:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>MATERIE:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>STADIU PROCESUAL:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>PARTI IN DOSAR:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>DATA SOLUTIEI:</label>
                        <input type="text" />
                    </div>

                    <div className={styles.formRow}>
                        <label>SOLUTIA:</label>
                        <input type="text" />
                    </div>
                </div>

                <button className={styles.addRow}>
                    + Adaugă litigiu
                </button>


                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder />
                </div>

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

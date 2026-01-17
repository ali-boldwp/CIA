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
                    I. Societatea ABC |  5. Datorii si inscrieri mobiliare
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Situatia inscrierilor active existente in RNPM (AEGRM)</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
          <textarea
              className={styles.textarea}
              placeholder="In urma verificarilor efectuate in registrele publice, inclusiv in Arhiva Electronica de Garantii Reale Mobiliare (AEGRM), a rezultat ca Societatea [denumire societate] are inregistrate un numar de __ ipoteci mobiliare in favoarea  creditorilor, printre care mentionam: "
          />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* Cronologie */}
                <h3 className={styles.sectionTitle}>
                    📋 Tabel datorii si inscrieri mobiliare
                </h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ACT JURIDIC / DATA</th>
                        <th>CREDITOR</th>
                        <th>DETALII</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Act juridic / Data]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Creditor]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Detalii - Valoare, obiect, termen etc.]"
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
                            ➡️  Mergi la I.6. „Achizitii SEAP”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Index;

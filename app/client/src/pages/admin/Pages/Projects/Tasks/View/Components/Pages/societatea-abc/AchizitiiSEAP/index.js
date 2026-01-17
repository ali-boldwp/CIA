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
                    I. Societatea ABC |  6. Achizitii SEAP
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Achizitii directe si contracte atribuite (conform SEAP)</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Conform verificarilor efectuate la autoritatile publice, in perioada [2023–2025], Societatea [denumire societate] a fost selectata in peste [50] de proceduri de achizitie publica, derulate de diverse institutii si autoritati
contractante. Acestea au inclus atat atribuiri in baza unor proceduri competitive (licitatii sau proceduri simplificate), cat si achizitii directe, realizate fara incheierea unui contract formal, conform legislatiei aplicabile.
Printre cele mai relevante achizitii, din perspectiva valorii sau a autoritatii contractante, se numara: "
                    />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* Cronologie */}
                <h3 className={styles.sectionTitle}>
                    📋 Tabel achizitii SEAP
                </h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>TIP ACHIZITIE</th>
                        <th>AUTORITATE CONTRACTANTA</th>
                        <th>OBIECT CONTRACT</th>
                        <th>VALOARE CONTRACT (RON)</th>
                        <th>DATA</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Tip achizitie]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Autoritate contractanta]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Obiect contract]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Valoare]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Data]"
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
                            ➡️  Mergi la I.7. „Marci OSIM”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Index;

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
                    I. Societatea ABC |   7. Proprietate intelectuala / Marci OSIM
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Informatii privind marcile inregistrate (OSIM) ale societatii si afiliatilor</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="Potrivit verificarilor efectuate, de-a lungul timpului, Societatea [denumire societate] a inregistrat la Oficiul de Stat pentru Inventii si Marci (OSIM) urmatoarele marci:  "
                    />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* Cronologie */}
                <h3 className={styles.sectionTitle}>
                    ® Tabel marci inregistrate la OSIM
                </h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>DENUMIRE MARCA</th>
                        <th>DETALII </th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Denumire marca]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[Detalii marca – an inregistrare, valabilitate, titular, observatii]"
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
                    <h3 className={styles.sectionTitle}>📷 Anexe OSIM (imagini / printscreen)</h3>
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
                            ➡️  Mergi la I.8. „Litigii societate”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Index;

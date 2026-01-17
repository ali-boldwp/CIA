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

    const [companies, setCompanies] = useState([
        {
            name: "ABC SRL",
            status: "active", // active | inactive
            cui: "",
            dateInf: "",
            sediu: "",
            caen: "",
            cifraAfaceri: "",
            profit: "",
            angajati: "",
            actionariat: ""
        },
        {
            name: "DEF SRL",
            status: "inactive",
            cui: "",
            dateInf: "",
            sediu: "",
            caen: "",
            cifraAfaceri: "",
            profit: "",
            angajati: "",
            actionariat: ""
        }
    ]);
    const deleteCompany = (index) => {
        setCompanies(companies.filter((_, i) => i !== index));
    };


    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC |   9. Participatii in alte societati
                </h1>

                {/* Istoric */}
                <h3 className={styles.sectionTitle}>Identificarea retelei de participatii si a legaturilor economice relevante</h3>

                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="In urma verificarilor efectuate la autoritatile publice, a reiesit faptul ca Societatea [denumire societate] detine si/sau a detinut calitatea de actionar in cadrul urmatoarelor societati comerciale:  "
                    />
                    <button className={styles.deleteBox}>Șterge căsuța</button>
                </div>

                {/* Cronologie */}
                <h3 className={styles.sectionTitle}>📋 Tabel participatii in alte societati</h3>

                <table className={styles.participationTable}>
                    <thead>
                    <tr>
                        <th>DENUMIRE SOCIETATE</th>
                        <th>DETALII SOCIETATE</th>
                        <th>STRUCTURA ACTIONARIAT</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {companies.map((c, index) => (
                        <tr key={index}>
                            {/* DENUMIRE + STATUS */}
                            <td>
                                <strong>{c.name}</strong>
                                <div className={styles.status}>
                                    {c.status === "active" ? (
                                        <span className={styles.active}>✔ societate activa</span>
                                    ) : (
                                        <span className={styles.inactive}>✖ Radiata din [anul]</span>
                                    )}
                                </div>
                            </td>

                            {/* DETALII */}
                            <td className={styles.details}>
                                <div className={styles.display}><b>CUI:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Data infiintarii:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Sediu social:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Cod CAEN:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Cifra de afaceri:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Profit/Pierdere neta:</b> <input placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Numar angajati:</b> <input placeholder="[completeaza aici]" /></div>
                            </td>

                            {/* ACTIONARIAT */}
                            <td>
          <textarea
              className={styles.actionariat}
              placeholder="[Structura actionariatului]"
          />
                            </td>

                            {/* DELETE */}
                            <td>
                                <button
                                    className={styles.trash}
                                    onClick={() => deleteCompany(index)}
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
                            ➡️  Mergi la I.10. „Controverse”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Index;

import React from 'react';
import ImagePlaceholder from './ImagePlaceholder';
import Navigation from './Navigation';
import styles from './styles.module.css';

const Index = () => {

    const generalProfileData = [
        ["Denumire societate", "[text editabil]"],
        ["Cod unic de inregistrare (CUI)", "[text editabil]"],
        ["Numar de inmatriculare", "[text editabil]"],
        ["Data infiintarii", "[text editabil]"],
        ["Adresa sediu social", "[text editabil]"],
        ["Obiect principal de activitate (cod CAEN)", "[text editabil]"],
        ["Cifra de afaceri (an 2024)", "[valoare] 📈/📉"],
        ["Profit net (an 2024)", "[valoare] 📈/📉"],
        ["Numar mediu angajati", "[numar] 📈/📉"]
    ];

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>I. Societatea ABC | 1. Informatii generale</h1>

                {/* General Company Profile */}
                <h3 className={styles.sectionTitle}>📋 PROFIL GENERAL AL COMPANIEI</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>CRITERIU</th>
                            <th>DETALII</th>
                        </tr>
                        </thead>
                        <tbody>
                        {generalProfileData.map((row, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={row[0]} disabled />
                                </td>
                                <td>
                                    <input type="text" placeholder={row[1]} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className={styles.addButton}>➕ Adauga rand</button>
                </div>

                {/* Shareholder Structure */}
                <h3 className={styles.sectionTitle}>📊 STRUCTURA ACTIONARIATULUI</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>ACTIONAR</th>
                            <th>CALITATE DETINUTA</th>
                            <th>COTA-PARTE</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text" placeholder="[nume actionar]" /></td>
                            <td><input type="text" placeholder="Selectează" /></td>
                            <td><input type="text" placeholder="[ % ]" /></td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={styles.addButton}>➕ Adauga rand</button>
                </div>

                {/* Management / Administrators */}
                <h3 className={styles.sectionTitle}>👥 CONDUCERE / ADMINISTRATORI</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>NUME / DENUMIRE</th>
                            <th>CALITATE DETINUTA</th>
                            <th>DATA NUMIRE</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text" placeholder="[nume]" /></td>
                            <td><input type="text" placeholder="Selectează" /></td>
                            <td><input type="text" placeholder="[ data ]" /></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={styles.buttonContainer}>
                        <button className={styles.addButton}>➕ Adauga rand</button>
                        <button className={styles.deleteTableButton}>🗑️ Elimina tabel</button>
                    </div>
                </div>

                {/* Board of Directors */}
                <h3 className={styles.sectionTitle}>🏛️ CONSILIU DE ADMINISTRATIE</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>NUME / DENUMIRE</th>
                            <th>CALITATE DETINUTA</th>
                            <th>DATA INCEPUT MANDAT</th>
                            <th>DATA SFARSIT MANDAT</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text" placeholder="[nume]" /></td>
                            <td><input type="text" placeholder="Selectează" /></td>
                            <td><input type="text" placeholder="[ data ]" /></td>
                            <td><input type="text" placeholder="[ data ]" /></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={styles.buttonContainer}>
                        <button className={styles.addButton}>➕ Adauga rand</button>
                        <button className={styles.deleteTableButton}>🗑️ Elimina tabel</button>
                    </div>
                </div>

                {/* Locations / Workpoints */}
                <h3 className={styles.sectionTitle}>📍 LOCATII / PUNCTE DE LUCRU</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>TIP</th>
                            <th>ADRESA</th>
                            <th>ACT JURIDIC</th>
                            <th>PERIOADA</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text" placeholder="Punct de lucru permanent" /></td>
                            <td><input type="text" placeholder="[text editabil]" /></td>
                            <td><input type="text" placeholder="[text editabil]" /></td>
                            <td><input type="text" placeholder="[perioada]" /></td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={styles.addButton}>➕ Adauga rand</button>
                </div>

                {/* Images Section */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder />
                    <Navigation />
                </div>

                {/* Note Section */}
                <div className={styles.noteSection}>
                    <p className={styles.noteText}>
                        Nota: Tabelele ‘Conducere/Administratori’ si ‘Consiliu de Administratie’ pot fi eliminate daca nu se aplica.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Index;

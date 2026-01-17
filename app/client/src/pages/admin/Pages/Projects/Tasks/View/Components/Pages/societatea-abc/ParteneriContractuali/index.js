import React, { useState } from 'react';
import styles from './styles.module.css';

const Index = () => {
    const [introText, setIntroText] = useState("In urma verificarii surselor disponibile si a consultarilor cu persoane avizate, a fost conturata o lista a partenerilor contractuali ai Societatii [denumire societate], incluzand companii precum:");

    const handleClearText = () => {
        setIntroText("");
    };

    return (
        <div className={styles.container}>
            {/* Single Main Card Container with everything inside */}
            <div className={styles.mainCard}>

                {/* Main Title */}
                <h1 className={styles.mainTitle}>I. Societatea ABC | 4. Parteneri contractuali</h1>

                {/* Section Title */}
                <h3 className={styles.sectionTitle}>Lista principalilor clienti si furnizori ai societatii</h3>

                {/* Introduction with editable textarea */}
                <div className={styles.introductionSection}>
                    <h3 className={styles.introTitle}>💬 Introducere</h3>
                    <div className={styles.textareaContainer}>
                        <textarea
                            value={introText}
                            onChange={(e) => setIntroText(e.target.value)}
                            className={styles.introTextarea}
                            placeholder="Scrie introducerea aici..."
                            rows={4}
                        />
                        <button
                            className={styles.clearButton}
                            onClick={handleClearText}
                            type="button"
                        >
                            🗑️ Sterge casuta
                        </button>
                    </div>
                </div>

                {/* Section Title */}
                <h3 className={styles.sectionTitle}>Tabel parteneri contractuali</h3>

                {/* Main Partners Table - 3 columns as in image */}
                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>DISHONOR</th>
                            <th>DICHONER</th>
                            <th>DISHONOR</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[denumirea societatii]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[denumirea societatii]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[denumirea societatii]"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={styles.addButton}>Adaugă titlu</button>
                </div>

                {/* Note Section */}
                <div className={styles.noteSection}>
                    <p>
                        * Compartimente vor fi baza nominală, nu bazate numărului certificatului.
                        Sumele pot fi extinse ori necesar bilateralul îndrumat.
                    </p>
                    <button className={styles.addModeButton}>+ Adaugă modul</button>
                </div>

                {/* Strategies Section */}
                <div className={styles.strategiesSection}>
                    <h3 className={styles.sectionTitle}>Strategii / grafice</h3>
                    <p className={styles.strategiesSubtitle}>
                        Strategia integrată sau grafică (sintactică).
                    </p>

                    <div className={styles.positionsContainer}>
                        <span>[Adăuga poziţionile...]</span>
                    </div>

                    <div className={styles.checkboxesContainer}>
                        <div className={styles.checkboxItem}>
                            <input type="checkbox" id="strategy1" />
                            <label htmlFor="strategy1">Piesasa imaginativă din</label>
                        </div>
                        <div className={styles.checkboxItem}>
                            <input type="checkbox" id="strategy2" />
                            <label htmlFor="strategy2">Piesasa imaginativă din</label>
                        </div>
                        <div className={styles.checkboxItem}>
                            <input type="checkbox" id="strategy3" />
                            <label htmlFor="strategy3">Piesasa imaginativǎ din</label>
                        </div>
                        <div className={styles.checkboxItem}>
                            <input type="checkbox" id="strategy4" />
                            <label htmlFor="strategy4">Piesasa imaginativǎ din</label>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className={styles.actionsSection}>
                    <div className={styles.actionItem}>
                        <input type="checkbox" id="action1" />
                        <label htmlFor="action1">Sancura structura</label>
                    </div>
                    <div className={styles.actionItem}>
                        <input type="checkbox" id="action2" defaultChecked />
                        <label htmlFor="action2">Accesare acces coperta</label>
                    </div>
                    <div className={styles.actionItem}>
                        <input type="checkbox" id="action3" />
                        <label htmlFor="action3">Merge la 1.5 „Sector”</label>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.navigation}>
                    <button className={styles.saveButton}>
                        💾 Salveaza sectiunea
                    </button>
                    <button className={styles.nextButton}>
                        ➡️ Mergi la 1.5 „Sector”
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Index;
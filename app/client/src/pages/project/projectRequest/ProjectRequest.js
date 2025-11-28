import React, { useState } from "react";
import styles from "./ProjectRequest.module.css";

const ProjectRequest = () => {
    // ====== STATE FOR CHIPS ======
    const [priority, setPriority] = useState("Normal");    // single select
    const [language, setLanguage] = useState("Română");    // single select
    const [services, setServices] = useState(["OSINT"]);   // multi select

    // multi-select toggle function for "Se dorește"
    const toggleService = (name) => {
        setServices((prev) =>
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        );
    };

    return (
        <div className={styles.page}>
            {/* Top blue line */}
            <div className={styles.topBar} />

            {/* Header */}
            <div className={styles.headerWrapper}>
                <div className={styles.headerCard}>
                    <div className={styles.headerInner}>
                        <button className={styles.backLink}>← Înapoi la Dashboard</button>
                        <h1 className={styles.headerTitle}>Solicitare nouă de proiect</h1>
                    </div>
                </div>
            </div>

            {/* FORM CARD */}
            <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Detalii client &amp; proiect</h2>

                        {/* ==== 4-COLUMN GRID ==== */}
                        <div className={styles.sectionGrid}>
                            {/* Row 1 */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Nume client
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="ex: Societatea ABC / POPESCU Ion"
                                    />
                                </label>
                            </div>

                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Persoană de contact
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="nume"
                                    />
                                </label>
                            </div>

                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Funcție (optional)
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="funcție"
                                    />
                                </label>
                            </div>

                            {/* Row 2 */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Email
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="ex: contact@client.ro"
                                    />
                                </label>
                            </div>

                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Telefon
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="+40 7xx xxx xxx"
                                    />
                                </label>
                            </div>

                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Contract</span>
                    <input type="checkbox" className={styles.checkboxSquare} />
                  </span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="ex: CTR-2025-014"
                                    />
                                </label>
                            </div>

                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Anexa</span>
                    <input type="checkbox" className={styles.checkboxSquare} />
                  </span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="de facut"
                                    />
                                </label>
                            </div>

                            {/* Row 3 – Subiect / Alte info */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Subiect proiect
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        placeholder="persoană de interes, societate/societăți (nume complet / denumire)"
                                    />
                                </label>
                            </div>

                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Alte informații
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        placeholder="Alte info despre contract etc"
                                    />
                                </label>
                            </div>

                            {/* Row 4 – Tip / Termen */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Tip entitate / caz
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Societate (include persoane cheie)"
                                    />
                                </label>
                            </div>

                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Termen limită (deadline)
                                    <input
                                        type="date"
                                        className={styles.input}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </label>
                            </div>

                            {/* Row 5 – Categorie / Preț */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Categorie
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Enhanced Due Diligence"
                                    />
                                </label>
                            </div>

                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Preț proiect
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="ex: 3.500 EUR"
                                    />
                                </label>
                            </div>

                            {/* Row 6 – Prioritate / Preferința analist */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>Prioritate</div>
                                    <div className={styles.chipRowChips}>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                priority === "Normal" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setPriority("Normal")}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                priority === "Urgent" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setPriority("Urgent")}
                                        >
                                            Urgent
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                priority === "Confidențial" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setPriority("Confidențial")}
                                        >
                                            Confidențial
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                priority === "Bench Task" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setPriority("Bench Task")}
                                        >
                                            Bench Task
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={`${styles.label} ${styles.boldLabel}`}>
                                    Preferința analist implicat în proiect
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Selectează analist -
                                        </option>
                                        <option>Analist A</option>
                                        <option>Analist B</option>
                                        <option>Analist C</option>
                                        <option>Analist D</option>
                                        <option>Analist E</option>
                                        <option>Analist F</option>
                                        <option>Analist G</option>
                                    </select>
                                </label>
                            </div>

                            {/* Row 7 – Limba / Solicitare referințe */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>Limba livrabilă</div>
                                    <div className={styles.chipRowChips}>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                language === "Română" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setLanguage("Română")}
                                        >
                                            Română
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.chip} ${
                                                language === "Engleză" ? styles.chipActive : ""
                                            }`}
                                            onClick={() => setLanguage("Engleză")}
                                        >
                                            Engleză
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={`${styles.label} ${styles.boldLabel}`}>
                                    Solicitare referințe / informații suplimentare
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Selectează analist -
                                        </option>
                                        <option>Analist A</option>
                                        <option>Analist B</option>
                                        <option>Analist C</option>
                                        <option>Analist D</option>
                                        <option>Analist E</option>
                                        <option>Analist F</option>
                                        <option>Analist G</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        {/* ==== GRID END ==== */}

                        {/* ===== Se dorește (bifează) ===== */}
                        <div className={`${styles.chipRow} ${styles.chipRowStandalone}`}>
                            <div className={styles.chipRowLabel}>Se dorește (bifează):</div>
                            <div className={styles.chipRowChips}>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("OSINT") ? styles.chipActive : ""
                                    }`}
                                    onClick={() => toggleService("OSINT")}
                                >
                                    OSINT
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("HUMINT") ? styles.chipActive : ""
                                    }`}
                                    onClick={() => toggleService("HUMINT")}
                                >
                                    HUMINT
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("OSINT preliminar") ? styles.chipActive : ""
                                    }`}
                                    onClick={() => toggleService("OSINT preliminar")}
                                >
                                    OSINT preliminar
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("Supraveghere operativă")
                                            ? styles.chipActive
                                            : ""
                                    }`}
                                    onClick={() => toggleService("Supraveghere operativă")}
                                >
                                    Supraveghere operativă
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("Supraveghere tehnică")
                                            ? styles.chipActive
                                            : ""
                                    }`}
                                    onClick={() => toggleService("Supraveghere tehnică")}
                                >
                                    Supraveghere tehnică
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.chip} ${
                                        services.includes("TCSM") ? styles.chipActive : ""
                                    }`}
                                    onClick={() => toggleService("TCSM")}
                                >
                                    TCSM
                                </button>
                            </div>
                        </div>

                        {/* ===== Descriere proiect ===== */}
                        <div className={styles.fullWidthBlock}>
                            <label className={styles.label}>
                                Descriere proiect (deschis pentru analiști)
                                <textarea
                                    className={`${styles.textarea} ${styles.largeTextarea}`}
                                    placeholder="ce se vrea, întrebările clientului, pe ce se pune accent..."
                                />
                            </label>
                        </div>

                        {/* ===== Note interne ===== */}
                        <div className={styles.fullWidthBlock}>
                            <label className={styles.label}>
                                Note interne (doar Managerului de proiecte)
                                <textarea
                                    className={`${styles.textarea} ${styles.largeTextarea}`}
                                    placeholder="constrângeri, jurisdicții, termeni contractuali, preferințe livrare..."
                                />
                            </label>
                        </div>

                        {/* ===== Attach files ===== */}
                        <div className={`${styles.fullWidthBlock} ${styles.fileUploadHalf}`}>
                            <label className={styles.label}>
                                Atașează fișiere (drag &amp; drop)
                                <div className={styles.dropZone}>
                                    Trage aici fișierele sau fă click pentru a încărca
                                </div>
                            </label>

                            <div className={styles.fileRow}>
                                Lista_intrebari_client.docx - 86 KB
                            </div>
                        </div>

                        {/* ===== BUTTONS CARD (separate like header) ===== */}



                    </div>

                </div>

            </div>
            <div className={styles.buttonsCard}>
                <div className={styles.actionsRow}>
                    <button className={`${styles.actionBtn} ${styles.actionAdd}`}>
                        Adaugă
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionDraft}`}>
                        Salvează draft
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.actionCancel}`}
                    >
                        Anulează
                    </button>
                </div>
            </div>
            <p className={styles.footerNote}>
                După trimitere, solicitarea ajunge la Managerul de proiecte pentru
                alocare.
            </p>
        </div>
    );
};

export default ProjectRequest;

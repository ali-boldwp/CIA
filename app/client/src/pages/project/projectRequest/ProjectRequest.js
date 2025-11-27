import React from "react";
import styles from "./ProjectRequest.module.css";

const ProjectRequest = () => {
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

            {/* ===== TOP CLIENT BLOCK (Row 1 + Row 2) ===== */}
            <div className={styles.clientBlock}>
              {/* LEFT: Nume client (row 1) + Email/Telefon (row 2) */}
              <div className={styles.clientColLeft}>
                <label className={styles.label}>
                  Nume client
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputNumeClient}`}
                    placeholder="ex: Societatea ABC / POPESCU Ion"
                  />
                </label>

                <div className={styles.clientSubRow}>
                  <label className={styles.label}>
                    Email
                    <input
                      type="email"
                      className={`${styles.input} ${styles.inputEmail}`}
                      placeholder="ex: contact@client.ro"
                    />
                  </label>

                  <label className={styles.label}>
                    Telefon
                    <input
                      type="text"
                      className={`${styles.input} ${styles.inputTelefon}`}
                      placeholder="+40 7xx xxx xxx"
                    />
                  </label>
                </div>
              </div>

              {/* MIDDLE: Persoană (row 1) + Nr. Contract (row 2) */}
              <div className={styles.clientColMiddle}>
                <label className={styles.label}>
                  Persoană de contact
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputPersoana}`}
                    placeholder="nume"
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Contract</span>
                    <input
                      type="checkbox"
                      className={styles.checkboxSquare}
                    />
                  </span>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputContract}`}
                    placeholder="ex: CTR-2025-014"
                  />
                </label>
              </div>

              {/* RIGHT: Funcție (row 1) + Nr. Anexa (row 2) */}
              <div className={styles.clientColRight}>
                <label className={styles.label}>
                  Funcție (optional)
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputFunctie}`}
                    placeholder="funcție"
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Anexa</span>
                    <input
                      type="checkbox"
                      className={styles.checkboxSquare}
                    />
                  </span>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputAnexa}`}
                    placeholder="de facut"
                  />
                </label>
              </div>
            </div>

            <span className={styles.helperText}>
              *Când sunt bifate Nr. contract sau Nr. anexa înseamnă că sunt
              făcute. Dacă nu, trebuie făcute.
            </span>

            {/* ===== Row 3 - Subiect proiect / Alte informații ===== */}
            <div className={styles.subjectBlock}>
              <div className={styles.subjectColLeft}>
                <label className={styles.label}>
                  Subiect proiect
                  <textarea
                    className={`${styles.textarea} ${styles.subjectTextarea} ${styles.textareaSubiect}`}
                    placeholder="persoană de interes, societate/societăți (nume complet / denumire)"
                  />
                </label>
              </div>
              <div className={styles.subjectColRight}>
                <label className={styles.label}>
                  Alte informații
                  <textarea
                    className={`${styles.textarea} ${styles.textareaAlteInfo}`}
                    placeholder="Alte info despre contract etc"
                  />
                </label>
              </div>
            </div>

            {/* ===== Row 4 - Tip entitate / Termen limită ===== */}
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>
                  Tip entitate / caz
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputTipEntitate}`}
                    placeholder="Societate (include persoane cheie)"
                  />
                </label>
              </div>
              <div className={styles.col}>
                <label className={styles.label}>
                  Termen limită (deadline)
                  <input
                    type="date"
                    className={`${styles.input} ${styles.inputDeadline}`}
                    placeholder="YYYY-MM-DD"
                  />
                </label>
              </div>
            </div>

            {/* ===== Row 5 - Categorie / Preț proiect ===== */}
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>
                  Categorie
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputCategorie}`}
                    placeholder="Enhanced Due Diligence"
                  />
                </label>
              </div>
              <div className={styles.col}>
                <label className={styles.label}>
                  Preț proiect
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputPret}`}
                    placeholder="ex: 3.500 EUR"
                  />
                </label>
              </div>
            </div>

            {/* ===== Row 6 - Prioritate (chips) ===== */}
            <div className={styles.chipRow}>
              <div className={styles.chipRowLabel}>Prioritate</div>
              <div className={styles.chipRowChips}>
                <button className={`${styles.chip} ${styles.chipActive}`}>
                  Normal
                </button>
                <button className={styles.chip}>Urgent</button>
                <button className={styles.chip}>Confidențial</button>
                <button className={styles.chip}>Bench Task</button>
              </div>
            </div>

            {/* ===== Row 7 - Limba livrabila ===== */}
            <div className={styles.chipRow}>
              <div className={styles.chipRowLabel}>Limba livrabilă</div>
              <div className={styles.chipRowChips}>
                <button className={`${styles.chip} ${styles.chipActive}`}>
                  Română
                </button>
                <button className={styles.chip}>Engleză</button>
              </div>
            </div>

            {/* ===== Row 8 - Se dorește (bifează) ===== */}
            <div className={styles.chipRow}>
              <div className={styles.chipRowLabel}>Se dorește (bifează):</div>
              <div className={styles.chipRowChips}>
                <button className={`${styles.chip} ${styles.chipActive}`}>
                  OSINT
                </button>
                <button className={styles.chip}>HUMINT</button>
                <button className={styles.chip}>OSINT preliminar</button>
                <button className={styles.chip}>Supraveghere operativă</button>
                <button className={styles.chip}>Supraveghere tehnică</button>
                <button className={styles.chip}>TCSM</button>
              </div>
            </div>

            {/* ===== ANALYST PREFERENCES + ANALYST LIST (two columns) ===== */}
            <div className={styles.analystLayout}>
              {/* LEFT side: select + extra field */}
              <div className={styles.analystLeft}>
                <label className={styles.label}>
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
                  </select>
                </label>

                <label className={styles.label}>
                  Solicitare referințe / informații suplimentare
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputRefInfo}`}
                    placeholder="Text editabil - nume prenume persoană"
                  />
                </label>
              </div>

              {/* RIGHT side: analyst checkboxes */}
              <div className={styles.analystSidebar}>
                <div className={styles.analystCard}>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" defaultChecked />
                    <span>Analist A</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist B</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist C</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist D</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist E</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist F</span>
                  </label>
                  <label className={styles.analystCheckboxRow}>
                    <input type="checkbox" />
                    <span>Analist G</span>
                  </label>
                </div>
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
            <div className={styles.fullWidthBlock}>
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

            {/* ===== BUTTONS ===== */}
            <div className={styles.actionsRow}>
              <button className={`${styles.actionBtn} ${styles.actionPrimary}`}>
                Adaugă
              </button>
              <button className={`${styles.actionBtn} ${styles.actionSecondary}`}>
                Salvează draft
              </button>
              <button className={`${styles.actionBtn} ${styles.actionGhost}`}>
                Anulează
              </button>
            </div>

            <p className={styles.footerNote}>
              După trimitere, solicitarea ajunge la Managerul de proiecte pentru
              alocare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequest;

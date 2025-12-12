import React, { useState , useEffect } from "react";
import styles from "./EditingPopUp.module.css";

const EditingPopUp = ({
                          data,
                          final,
                          onClose,
                          statusLabel = "Status: Revino la redactare",
                          editMode = "ON",
                          openObservations = 2,
                          round = "#1",
                          notesText = `Cap. I / 1.1 – Data interv.

Anexă – Confirmare OSINT #123

Cap. II – Terminologie neunitară`,
                          onAddNote,
                          onMarkAllResolved,
                          onResubmit,
                          isLoading = false,
                      }) => {
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setNotes(data.map((o) => `• ${o.text}`).join("\n\n"));
        }
    }, [data]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.card}>
                {/* Header top row */}
                <div className={styles.headerRow}>
          <span className={styles.title}>
            TASK INDIVIDUAL — întors la redactat (cu observații)
          </span>

                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>

                </div>

                {/* Badges */}
                <div className={styles.badgesRow}>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>
            {statusLabel}
          </span>

                    <span className={`${styles.badge} ${styles.badgeEdit}`}>
            Mod editare: {editMode}
          </span>

                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
            Observații deschise: {openObservations}
          </span>

                    <span className={`${styles.badge} ${styles.badgeRound}`}>
            Runda: {round}
          </span>
                </div>

                {/* Main content box with textarea only */}
                <div className={styles.contentBox}>
                    <div className={styles.contentHeader}>
                        <p className={styles.sectionTitle}>
                            Observații manager (marchează ca rezolvate după corecții)
                        </p>

                        <button
                            type="button"
                            className={styles.editIconBtn}
                            title="Editează"
                        >
                            ✏️
                        </button>
                    </div>

                    {/* Manager notes textarea */}
                    <textarea
                        className={styles.notesArea}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={isLoading}
                    />

                </div>

                {/* 🔻 Separate actions section, textarea se bahar */}
                <div className={styles.actionsSection}>
                    <div className={styles.actionsRow}>
                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            disabled={isLoading}
                            onClick={() => onAddNote && onAddNote(notes)}
                        >
                            Adaugă notă/atașament
                        </button>

                        <button
                            type="button"
                            className={styles.outlineBtn}
                            disabled={isLoading}
                            onClick={() => onMarkAllResolved && onMarkAllResolved()}
                        >
                            Marchează toate rezolvate
                        </button>

                        <div className={styles.rightActions}>
                            <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={final}
                                disabled={isLoading}
                            >
                                {isLoading ? "Se trimite..." : "Trimite din nou la revizie"}
                            </button>

                            <p className={styles.helperText}>
                                Se activează când toate observațiile sunt „rezolvate”.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditingPopUp;

import React, { useState } from "react";
import styles from "./ReviewPopUp.module.css";
import { useFinalizeProjectMutation } from "../../../../../../../services/projectApi";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

const ReviewPopUp = ({
                         onClose,
                         statusLabel = "Status: în revizie",
                         editMode = "OFF",
                         reviewer = "AP",
                         round = "#1",
                         observationsText = "",
                         onReturnWithNotes,
                         onAddObservation,
                         isLoading = false,
                     }) => {
    const [notes, setNotes] = useState(
        observationsText ||
        ""
    );
    const {id:proId}=useParams();
    const id=proId;
    const [finalizeProject]=useFinalizeProjectMutation();
    const [showObservations, setShowObservations] = useState(false);

    const handleOverlayClick = (e) => {
        // sirf background pe click se close kare
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    const handleReturnClick = () => {
        // pehle neeche wala section show karo
        setShowObservations(true);

        if (onReturnWithNotes) {
            onReturnWithNotes(notes);
        }
        // yahan onClose NAHI, popup khula rahega
    };

    const handleApproveClick = async(id) => {
        try{
           await finalizeProject({id}).unwrap();
           toast.success("Proiectul a fost aprobat cu succes")
            onClose();
        }catch{
            toast.error("Eroare la finalizarea proiectului")
            onClose();
        }
    };

    const handleAddObservationClick = () => {
        if (onAddObservation) {
            onAddObservation(notes);
        }
    };

    return (
        // 🔥 yahan contentEditable={false} taake koi parent editor isko editable na banaye
        <div
            className={styles.overlay}
            contentEditable={false}
            onClick={handleOverlayClick}
        >
            <div className={styles.card}>
                {/* Header */}
                <div className={styles.headerRow}>
          <span className={styles.title}>
            TASK INDIVIDUAL — În revizie (document blocat)
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

                {/* Badges row */}
                <div className={styles.badgesRow}>
          <span className={`${styles.badge} ${styles.badgeWarning}`}>
            {statusLabel}
          </span>
                    <span className={styles.badge}>Mod editare: {editMode}</span>
                    <span className={`${styles.badge} ${styles.badgeReviewer}`}>
            Reviewer: {reviewer}
          </span>
                    <span className={styles.badge}>Runda: {round}</span>
                </div>

                <p className={styles.infoText}>
                    Analistul nu mai poate edita sau retrage lucrarea în această etapă.
                </p>

                {/* Manager actions */}
                <div className={styles.section}>
                    <p className={styles.sectionLabel}>Acțiuni manager</p>

                    <div className={styles.actionsRow}>
                        <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.returnBtn}`}
                            onClick={handleReturnClick}
                            disabled={isLoading}
                        >
                            Returnează cu observații
                        </button>

                        <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={()=>handleApproveClick(id)}
                            disabled={isLoading}
                        >
                            Aprobă &amp; finalizează
                        </button>
                    </div>
                </div>

                {/* Observations section — sirf jab showObservations true ho */}
                {showObservations && (
                    <div className={styles.section}>
                        <p className={styles.sectionLabel}>Observații (manager)</p>

                        <textarea
                            className={styles.notesArea}
                            placeholder="Scrie observațiile aici..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isLoading}
                        />

                        <div className={styles.footerRow}>
                            <button
                                type="button"
                                className={styles.addObservationBtn}
                                onClick={handleAddObservationClick}
                                disabled={isLoading || !notes.trim()}
                            >
                                {isLoading ? "Se salvează..." : "Adaugă observație"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPopUp;

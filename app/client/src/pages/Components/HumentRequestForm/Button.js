import React from "react";
import styles from "./Button.module.css";

const Button = ({ onApprove, onSaveDraft, onGenerateBrief, disabled = false }) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <p className={styles.label}>Acțiuni</p>

                <div className={styles.btnRow}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={onApprove}
                        disabled={disabled}
                    >
                        {disabled ? "Se trimite..." : "Trimite spre aprobare"}
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={onSaveDraft}
                        disabled={disabled}
                    >
                        {disabled ? "Se salvează..." : "Salvează draft"}
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnTertiary}`}
                        onClick={onGenerateBrief}
                        disabled={disabled}
                    >
                        Generează brief printabil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Button;

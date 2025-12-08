import React from "react";
import styles from "./Button.module.css";

const Button = ({ onApprove, onSaveDraft, onGenerateBrief }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <p className={styles.label}>Acțiuni</p>

                <div className={styles.btnRow}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={onApprove}
                    >
                        Trimite spre aprobare
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={onSaveDraft}
                    >
                        Salvează draft
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnTertiary}`}
                        onClick={onGenerateBrief}
                    >
                        Generează brief printabil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Button;

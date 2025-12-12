import React, { useState } from "react";
import styles from "./Clarification.module.css";

const ClarificationSectiom = ({ onSubmit, onCancel, disabled = false }) => {

    const [text, setText] = useState("");

    const handleClick = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (onSubmit) {
            onSubmit(trimmed); // parent ko message text bhej rahe hain
        }

        setText("");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Solicită clarificări</h3>
                <p className={styles.subtitle}>
                    Trimite clarificări către analist pentru această solicitare HUMINT.
                </p>

                <textarea
                    className={styles.textarea}
                    disabled={disabled}
                    placeholder="Scrie clarificarea ta aici..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className={styles.actionsRow}>
                    {onCancel && (
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={onCancel}
                            disabled={disabled}
                        >
                            Înapoi la acțiuni
                        </button>
                    )}

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={handleClick}
                        disabled={disabled || !text.trim()}
                    >
                        {disabled ? "Se trimite..." : "Clarifică"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClarificationSectiom;

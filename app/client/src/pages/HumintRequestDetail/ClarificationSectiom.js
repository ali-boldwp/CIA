import React, { useState } from "react";
import styles from "./Clarification.module.css";

const ClarificationSectiom = ({ onSubmit, onCancel }) => {
    const [text, setText] = useState("");

    const handleClick = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (onSubmit) {
            onSubmit(trimmed);
        }
        setText("");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Solicită clarificări</h3>
                <p className={styles.subtitle}>
                    Scrie mesajul către analist. Acesta va fi trimis ca feedback pentru această solicitare HUMINT.
                </p>

                <textarea
                    className={styles.textarea}
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
                        >
                            Înapoi la acțiuni
                        </button>
                    )}

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={handleClick}
                        disabled={!text.trim()}
                    >
                        Clarifică
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClarificationSectiom;

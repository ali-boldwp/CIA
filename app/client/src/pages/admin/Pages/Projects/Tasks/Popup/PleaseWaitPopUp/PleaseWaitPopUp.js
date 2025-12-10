import React from "react";
import styles from "./PleaseWaitPopUp.module.css";

const PleaseWaitPopUp = ({
                             message = "Vă rugăm să așteptați...",
                             subText = "Se procesează finalizarea task-ului.",
                         }) => {
    return (
        <div className={styles.overlay} contentEditable={false}>
            <div className={styles.card}>
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner} />
                </div>

                <p className={styles.message}>{message}</p>
                <p className={styles.subText}>{subText}</p>
            </div>
        </div>
    );
};

export default PleaseWaitPopUp;

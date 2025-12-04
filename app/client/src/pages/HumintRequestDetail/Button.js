// /home/ubaid/workspace/app/client/src/pages/HumintRequestDetail/Button.js

import React from "react";
import styles from "./Button.module.css";

const ActionButtons = ({ onApprove, onReject, onClarify, onPrint }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Acțiuni</h3>

                <div className={styles.actionsRow}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnApprove}`}
                        onClick={onApprove}
                    >
                        Aprobă
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnReject}`}
                        onClick={onReject}
                    >
                        Respinge
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnClarify}`}
                        onClick={onClarify}
                    >
                        Solicită clarificări
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrint}`}
                        onClick={onPrint}
                    >
                        Generează brief printabil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;

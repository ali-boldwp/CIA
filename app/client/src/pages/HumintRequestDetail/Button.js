import React from "react";
import styles from "./Button.module.css";

const RequestButton = ({ status, onApprove, onReject, onClarify }) => {
    const normalized = (status || "").trim().toLowerCase();

    const isRequested = normalized === "requested";
    const isClarification = normalized === "clarification";

    return (
        <>
            {/* APPROVE + REJECT only for Requested */}
            {isRequested && (
                <>
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
                </>
            )}

            {/* Clarify button for both Requested & Clarification */}
            {(isRequested || isClarification) && (
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnClarify}`}
                    onClick={onClarify}
                >
                    Solicită clarificări
                </button>
            )}
        </>
    );
};

const ActionButtons = ({ data, onApprove, onReject, onClarify, onPrint }) => {
    const status = data?.status;
    const normalized = (status || "").trim().toLowerCase();

    const isRequested = normalized === "requested";
    const isClarification = normalized === "clarification";

    // debug ke liye (1 dafa dekh lo console me kya aa raha hai)
    console.log("Humint status raw:", status, "normalized:", normalized);

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Acțiuni</h3>

                <div className={styles.actionsRow}>
                    {(isRequested || isClarification) && (
                        <RequestButton
                            status={status}
                            onApprove={onApprove}
                            onReject={onReject}
                            onClarify={onClarify}
                        />
                    )}

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

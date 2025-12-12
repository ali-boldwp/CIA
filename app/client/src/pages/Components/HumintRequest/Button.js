import React from "react";
import styles from "./Button.module.css";

const RequestButton = ({ status, onApprove, onReject, onClarify, disabled = false }) => {

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
                        disabled={disabled}
                    >
                        {disabled ? "Se aprobă..." : "Aprobă"}
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnReject}`}
                        onClick={onReject}
                        disabled={disabled}
                    >
                        {disabled ? "Se respinge..." : "Respinge"}
                    </button>
                </>
            )}

            {/* Clarify button for both Requested & Clarification */}
            {(isRequested || isClarification) && (
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnClarify}`}
                    onClick={onClarify}
                    disabled={disabled}
                >
                    {disabled ? "Se trimite..." : "Solicită clarificări"}
                </button>
            )}
        </>
    );
};

const ActionButtons = ({ data, onApprove, onReject, onClarify, onPrint, disabled = false }) => {

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
                            disabled={disabled}
                        />
                    )}

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrint}`}
                        onClick={onPrint}
                        disabled={disabled}
                    >
                        Generează brief printabil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;

// Button.js
import React from "react";
import { useSelector } from "react-redux";
import styles from "./Button.module.css";

const RequestButton = ({ status, onApprove, onReject, onClarify, disabled = false, canApproveReject }) => {
    const normalized = (status || "").trim().toLowerCase();
    const isRequested = normalized === "requested";
    const isClarification = normalized === "clarification";

    return (
        <>
            {canApproveReject && isRequested && (
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
    const { user } = useSelector((state) => state.auth);

    const role = (user?.role || "").toLowerCase();
    const isAdminOrManager = role === "admin" || role === "manager";
    const isAnalyst = role === "analyst";

    const status = data?.status;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Acțiuni</h3>

                <div className={styles.actionsRow}>
                    {(isAdminOrManager || isAnalyst) && (
                        <RequestButton
                            status={status}
                            onApprove={onApprove}
                            onReject={onReject}
                            onClarify={onClarify}
                            disabled={disabled}
                            canApproveReject={isAdminOrManager}
                        />
                    )}

                    {(isAdminOrManager) && (
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnPrint}`}
                            onClick={() => {
                                console.log("PRINT CLICKED");
                                onPrint();
                            }}
                            disabled={disabled}
                        >
                            Generează brief printabil
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ActionButtons;
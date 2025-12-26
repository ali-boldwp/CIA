import React from "react";
import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

const ConfirmDelete = ({ open, onClose, onConfirm, loading }) => {
    const contentUI = (
        <div className={styles.box}>
            <p className={styles.text}>Ești sigur că vrei să ștergi acest capitol?</p>
        </div>
    );

    const footerUI = (
        <div className={styles.footerRow}>
            <button
                className={styles.cancelBtn}
                onClick={() => onClose(false)}
                disabled={loading}
            >
                Anulează
            </button>

            <button
                className={styles.deleteBtn}
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? "Se șterge..." : "Șterge"}
            </button>
        </div>
    );

    return (
        <Popup
            open={open}
            header="Ștergere capitol"
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default ConfirmDelete;

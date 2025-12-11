
import React from "react";
import styles from "./style.module.css";

const Header = ({ title, onBack }) => {
    return (
        <div className={styles.headerBar}>
            <button type="button" className={styles.backBtn} onClick={onBack}>
                ← Înapoi
            </button>

            <span className={styles.title}>{title}</span>
        </div>
    );
};

export default Header;

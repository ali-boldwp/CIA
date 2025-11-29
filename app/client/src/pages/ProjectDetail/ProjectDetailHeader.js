// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetailHeader.js
import React from "react";
import styles from "./ProjectDetailHeader.module.css";

const ProjectDetailHeader = ({ title, onBack }) => {
    return (
        <div className={styles.headerBar}>
            <button type="button" className={styles.backBtn} onClick={onBack}>
                ← Înapoi
            </button>

            <span className={styles.title}>{title}</span>
        </div>
    );
};

export default ProjectDetailHeader;

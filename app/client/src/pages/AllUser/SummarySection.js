import React from "react";
import styles from "./SummarySection.module.css";

const SummarySection = ({ totalEmployees, totalMonthlyCost }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {/* Title */}
                <h3 className={styles.title}>Rezumat</h3>

                {/* Two columns like Figma */}
                <div className={styles.grid}>
                    {/* Left card – Total angajați */}
                    <div className={`${styles.box} ${styles.leftBox}`}>
                        <span className={styles.label}>Total angajați</span>
                        <span className={styles.value}>{totalEmployees}</span>
                    </div>

                    {/* Right card – Cost total angajați (lunar) */}
                    <div className={`${styles.box} ${styles.rightBox}`}>
                        <span className={styles.label}>Cost total angajați (lunar)</span>
                        <span className={styles.value}>{totalMonthlyCost}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;

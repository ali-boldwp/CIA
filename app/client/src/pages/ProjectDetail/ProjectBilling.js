// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectBilling.js
import React from "react";
import styles from "./ProjectBilling.module.css";

const ProjectBilling = ({ billing }) => {
    return (
        <div className={styles.billingCard}>
            <h2 className={styles.sectionTitle}>Rezumat financiar</h2>

            <div className={styles.gridRow}>
                <div className={`${styles.box} ${styles.priceBox}`}>
                    <span className={styles.label}>Preț proiect</span>
                    <span className={styles.value}>{billing.price} EUR</span>
                </div>

                <div className={styles.box}>
                    <span className={styles.label}>Cheltuieli fixe</span>
                    <span className={styles.value}>{billing.fixed} EUR</span>
                </div>

                <div className={styles.box}>
                    <span className={styles.label}>Cheltuieli OSINT</span>
                    <span className={styles.value}>{billing.osint} EUR</span>
                </div>

                <div className={styles.box}>
                    <span className={styles.label}>Cheltuieli angajați</span>
                    <span className={styles.value}>{billing.staff} EUR</span>
                </div>

                <div className={styles.boxWarning}>
                    <span className={styles.label}>Cheltuieli HUMINT (cu taxe)</span>
                    <span className={styles.value}>{billing.humint} EUR</span>
                </div>

                <div className={styles.box}>
                    <span className={styles.label}>Total cheltuieli</span>
                    <span className={styles.value}>{billing.total} EUR</span>
                </div>
            </div>

            <div className={styles.profitBox}>
                <div className = {styles.marja}>
                    <span className={styles.label}>Marjă</span>
                    <span className={styles.value}>{billing.margin} EUR</span>
                </div>
                <span className={styles.percentage}>{billing.percentage}%</span>
            </div>
        </div>
    );
};

export default ProjectBilling;

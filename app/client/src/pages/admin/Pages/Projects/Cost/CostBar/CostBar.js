import React from 'react';
import styles from './CostBar.module.css';

const CostBar = () => {
    return (
        <div className={`${styles.formCard} ${styles.costsBar}`}>
            <div className={styles.costBlock}>
                <h2 className={styles.costTitle}>Cheltuieli fixe</h2>

                <div className={styles.costRow}>
                    <div className={styles.formField}>
                        <label>Cheltuieli totale (editabil)</label>
                        <input className={styles.inputBox} defaultValue="180 EUR" />
                    </div>

                    <div className={`${styles.formField} ${styles.smallField}`}>
                        <label>Monedă</label>
                        <input className={styles.inputBox} defaultValue="EUR ▾" />
                    </div>
                </div>
            </div>

            <div className={styles.costBlock}>
                <h2 className={styles.costTitle}>Cheltuieli OSINT</h2>

                <div className={styles.costRow}>
                    <div className={styles.formField}>
                        <label>Cheltuieli totale (editabil)</label>
                        <input className={styles.inputBox} defaultValue="180 EUR" />
                    </div>

                    <div className={`${styles.formField} ${styles.smallField}`}>
                        <label>Monedă</label>
                        <input className={styles.inputBox} defaultValue="EUR ▾" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostBar;
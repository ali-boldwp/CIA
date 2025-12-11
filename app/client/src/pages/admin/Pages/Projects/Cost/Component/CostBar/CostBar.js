import React from 'react';
import styles from './CostBar.module.css';

const CostBar = () => {
    return (
        <>
            {/* Row 1: Cheltuieli fixe + Cheltuieli OSINT */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli fixe</h2>

                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
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
                            <label>Cheltuieli totale</label>
                            <input className={styles.inputBox} defaultValue="180 EUR" />
                        </div>

                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue="EUR ▾" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Cheltuieli TESA + Cheltuieli Supraveghere */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli TESA</h2>

                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale </label>
                            <input className={styles.inputBox} defaultValue="180 EUR" />
                        </div>

                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue="EUR ▾" />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli Supraveghere Operativa / Tehnica</h2>

                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale </label>
                            <input className={styles.inputBox} defaultValue="180 EUR" />
                        </div>

                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue="EUR ▾" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Alte cheltuieli */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Alte cheltuieli</h2>

                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale </label>
                            <input className={styles.inputBox} defaultValue="180 EUR" />
                        </div>

                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue="EUR ▾" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CostBar;
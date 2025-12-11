import React from 'react';
import styles from './SummarySection.module.css';

const SummarySection = () => {
    return (
        <div className={styles.topRow}>
            {/* LEFT: PROJECT DETAILS */}
            <div className={`${styles.formCard} ${styles.projectCard}`}>
                <h2 className={styles.formTitle}>Detalii proiect</h2>

                <div className={styles.projectBlock}>
                    <ul>
                        <li>
                            <b>Denumire proiect</b>
                            <span>Due Diligence: Societatea ABC</span>
                        </li>
                        <li>
                            <b>Tip raport</b>
                            <span>Enhanced Due Diligence</span>
                        </li>
                        <li>
                            <b>Tip entitate / caz</b>
                            <span>Societate</span>
                        </li>
                        <li>
                            <b>Nume client</b>
                            <span>ZZZ SRL</span>
                        </li>
                        <li>
                            <b>Responsabil proiect</b>
                            <span>Analist C</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT: FINANCIAL SUMMARY */}
            <div className={`${styles.formCard} ${styles.financeCard}`}>
                <div className={styles.financeHeader}>
                    <h2 className={styles.formTitle}>Rezumat financiar</h2>
                    <button className={styles.currencyUpdateBtn}>
                        Curs EURO (BNR) <span>actualizat</span>
                    </button>
                </div>

                <div className={styles.financialGrid}>
                    {/* Row 1 - First 4 boxes */}
                    <div className={`${styles.summaryBox} ${styles.boxGray}`}>
                        {/* REMOVED LABEL - Only showing value */}
                        <span className={styles.sValue}>1050 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxTfsa}`}>
                        <span className={styles.sLabel}>Cheltuieli TFSA</span>
                        <span className={styles.sValue}>1050 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxCyan}`}>
                        <span className={styles.sLabel}>Cheltuieli OSINT Tehnică</span>
                        <span className={styles.sValue}>150 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxYellow}`}>
                        <span className={styles.sLabel}>Cheltuieli HUMINT (cu taxe)</span>
                        <span className={styles.sValue}>554.4 EUR</span>
                    </div>

                    {/* Row 2 - Next 4 boxes */}
                    <div className={`${styles.summaryBox} ${styles.boxBlue}`}>
                        <span className={styles.sLabel}>Cheltuieli fixe</span>
                        <span className={styles.sValue}>300 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxOther}`}>
                        <span className={styles.sLabel}>Alte cheltuieli</span>
                        <span className={styles.sValue}>300 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxPurple}`}>
                        <span className={styles.sLabel}>Preț proiect</span>
                        <span className={styles.sValue}>3500 EUR</span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxLightgray}`}>
                        <span className={styles.sLabel}>Total cheltuieli</span>
                        <span className={styles.sValue}>2054.4 EUR</span>
                    </div>

                    {/* Row 3 - Last 2 boxes (each spanning 2 columns) */}
                    <div className={`${styles.summaryBox} ${styles.boxProfit}`}>
                        <div className={styles.profitContainer}>
                            <div className={styles.profitTopRow}>
                                <span className={styles.sLabelGreen}>Profit</span>
                                <span className={styles.profitPercentage}>41.3%</span>
                            </div>
                            <div className={styles.profitBottomRow}>
                                <span className={styles.profitValue}>1445.6 EUR</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxDuration}`}>
                        <span className={styles.sLabelDuration}>Durata proiect (zile lucrătoare)</span>
                        <span className={styles.sValueDuration}>25 zile</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;
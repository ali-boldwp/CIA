import React from "react";
import styles from "./style.module.css";

const Billing = ({ billing }) => {
    if (!billing) return null;

    const currency = billing.currency || "EUR";

    return (
        <div className={styles.billingWrapper}>
            {/* Header */}
            <div className={styles.billingHeader}>
                <h2 className={styles.title}>Rezumat financiar</h2>

                <div className={styles.headerRight}>
                    <span className={styles.currencyBadge}>
                        Curs {currency} (BNR)
                    </span>
                    <span className={styles.refreshText}>actualizat ⟳</span>
                </div>
            </div>

            {/* GRID */}
            <div className={styles.financialGrid}>
                {/* Row 1 */}
                <div className={`${styles.card} ${styles.blue}`}>
                    <span>Cheltuieli angajați</span>
                    <div className={`${styles.text}`}>{billing.staff} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.lightBlue}`}>
                    <span>Cheltuieli TESA</span>
                    <div className={`${styles.text}`}>{billing.tesa} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.cyan}`}>
                    <span>Cheltuieli OSINT</span>
                    <div className={`${styles.text}`}>{billing.osint} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.orange}`}>
                    <span>Cheltuieli Supraveghere / Tehnica</span>
                    <div className={`${styles.text}`}>{billing.humint} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.gray}`}>
                    <span>Cheltuieli fixe</span>
                    <div className={`${styles.text}`}>{billing.fixed} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.green}`}>
                    <span>Alte cheltuieli</span>
                    <div className={`${styles.text}`}>{billing.other} {currency}</div>
                </div>

                {/* Row 2 */}
                <div className={`${styles.card} ${styles.purple} ${styles.wide}`}>
                    <span>Pret proiect</span>
                    <div className={`${styles.text}`}>{billing.price} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.lightGray} ${styles.wide}`}>
                    <span>Total cheltuieli</span>
                    <div className={`${styles.text}`}>{billing.total} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.profit}`}>
                    <div className={styles.profitTop}>
                        <span>Profit</span>
                        <span className={styles.percent}>
                            {billing.percentage}%
                        </span>
                    </div>
                    <div className={`${styles.text}`}>{billing.margin} {currency}</div>
                </div>

                <div className={`${styles.card} ${styles.duration}`}>
                    <span>Durata proiect (zile lucrătoare)</span>
                    <div className={`${styles.text}`}>{billing.duration || "—"} zile</div>
                </div>
            </div>
        </div>
    );
};

export default Billing;

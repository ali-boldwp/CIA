import React from "react";
import styles from "./CostBar.module.css";
import { useParams } from "react-router-dom";
import {useGetProjectFinancialStatesQuery} from "../../../../../../../services/projectApi";

const CostBar = () => {
    const { id: projectId } = useParams();

    const { data, isLoading } =
        useGetProjectFinancialStatesQuery(projectId);

    const costs = data?.data || {};
    const currency = costs.currency || "EUR";

    if (isLoading) return null; // UI safe (no flicker)

    return (
        <>
            {/* Row 1 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>fixe</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                defaultValue={`${costs.cheltuieliFixe ?? 0} ${currency}`}

                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue={currency} />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>OSINT</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                defaultValue={`${costs.cheltuieliOSINT ?? 0} ${currency}`}

                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue={currency}  />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>TESA</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                defaultValue={`${costs.cheltuieliTESA ?? 0} ${currency}`}

                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue={currency}  />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>
                      Tehnica
                    </h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                defaultValue={`${costs.supraveghereTehnica ?? 0} ${currency}`}

                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue={currency}  />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>other</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                defaultValue={`${costs.alteCheltuieli ?? 0} ${currency}`}

                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} defaultValue={currency}  />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CostBar;

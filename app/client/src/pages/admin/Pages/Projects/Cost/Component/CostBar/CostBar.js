import React, { useState, useEffect } from "react";
import styles from "./CostBar.module.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetProjectFinancialStatesQuery } from "../../../../../../../services/projectApi";
import { useUpdateProjectPriceMutation } from "../../../../../../../services/humintExpanseApi";

const CostBar = () => {
    const { id: projectId } = useParams();
    const { data, isLoading, refetch } = useGetProjectFinancialStatesQuery(projectId);

    const [updatePrice] = useUpdateProjectPriceMutation();

    const costs = data?.data || {};
    const currency = costs.currency || "EUR";

    const [savingField, setSavingField] = useState(null);



    const [inputValues, setInputValues] = useState({
        fixe: costs.fixPrice || costs.cheltuieliFixe || 0,
        osint: costs.osintPrice || costs.cheltuieliOSINT || 0,
        tesa: costs.tesaPrice || costs.cheltuieliTESA || 0,
        tehnica: costs.tehnicaPrice || costs.supraveghereTehnica || 0,
        other: costs.otherPrice || costs.alteCheltuieli || 0
    });


    useEffect(() => {
        setInputValues({
            fixe: costs.fixPrice || costs.cheltuieliFixe || 0,
            osint: costs.osintPrice || costs.cheltuieliOSINT || 0,
            tesa: costs.tesaPrice || costs.cheltuieliTESA || 0,
            tehnica: costs.tehnicaPrice || costs.supraveghereTehnica || 0,
            other: costs.otherPrice || costs.alteCheltuieli || 0
        });
    }, [costs]);

    // Handle input change
    const handleChange = (field, value) => {
        setInputValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBlur = async (field, value) => {
        const priceValue = parseFloat(value) || 0;

        const typeMap = {
            fixe: "fixed",
            osint: "osint",
            tesa: "tesa",
            tehnica: "tehnica",
            other: "other",
        };

        const promise = updatePrice({
            projectId,
            type: typeMap[field],
            price: priceValue,
        }).unwrap();

        setSavingField(field); // 🔒 disable this field

        try {
            await toast.promise(
                promise,
                {
                    pending: `Se salvează ${field}...`,
                    success: `${field} salvat!`,
                    error: {
                        render({ data }) {
                            return data?.data?.message || `Eroare la salvare (${field})`;
                        },
                    },
                },
                {
                    toastId: `cost-update-${field}`, // 🔁 no toast spam
                    autoClose: 2000,
                }
            );

            refetch();
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        } finally {
            setSavingField(null); // 🔓 re-enable
        }
    };



    if (isLoading) return null;

    return (
        <>
            {/* Row 1 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli fixe</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.fixe}
                                onChange={(e) => handleChange("fixe", e.target.value)}
                                onBlur={(e) => handleBlur("fixe", e.target.value)}
                                type="number"
                                disabled={savingField === "fixe"}
                            />

                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli OSINT</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.osint}
                                onChange={(e) => handleChange("osint", e.target.value)}
                                onBlur={(e) => handleBlur("osint", e.target.value)}
                                type="number"
                                disabled={savingField === "osint"}
                            />

                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli TESA</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.tesa}
                                onChange={(e) => handleChange("tesa", e.target.value)}
                                onBlur={(e) => handleBlur("tesa", e.target.value)}
                                type="number"
                                disabled={savingField === "tesa"}
                            />

                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Cheltuieli Tehnica</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.tehnica}
                                onChange={(e) => handleChange("tehnica", e.target.value)}
                                onBlur={(e) => handleBlur("tehnica", e.target.value)}
                                type="number"
                                disabled={savingField === "tehnica"}
                            />

                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div className={`${styles.formCard} ${styles.costsBar}`}>
                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Alte cheltuieli</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.other}
                                onChange={(e) => handleChange("other", e.target.value)}
                                onBlur={(e) => handleBlur("other", e.target.value)}
                                type="number"
                                disabled={savingField === "other"}
                            />

                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CostBar;
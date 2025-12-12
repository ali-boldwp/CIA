import React, { useState, useEffect } from "react";
import styles from "./CostBar.module.css";
import { useParams } from "react-router-dom";
import { useGetProjectFinancialStatesQuery } from "../../../../../../../services/projectApi";
import { useUpdateProjectPriceMutation } from "../../../../../../../services/humintExpanseApi";

const CostBar = () => {
    const { id: projectId } = useParams();
    const { data, isLoading, refetch } = useGetProjectFinancialStatesQuery(projectId);

    const [updatePrice] = useUpdateProjectPriceMutation();

    const costs = data?.data || {};
    const currency = costs.currency || "EUR";


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

    // Handle blur
    const handleBlur = async (field, value) => {
        const priceValue = parseFloat(value) || 0;

        // Map field names to API types
        const typeMap = {
            fixe: "fixed",
            osint: "osint",
            tesa: "tesa",
            tehnica: "tehnica",
            other: "other"
        };

        try {
            await updatePrice({
                projectId: projectId,
                type: typeMap[field],
                price: priceValue
            }).unwrap();

            refetch();
            console.log(`${field} updated successfully`);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    if (isLoading) return null;

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
                                value={inputValues.fixe}
                                onChange={(e) => handleChange('fixe', e.target.value)}
                                onBlur={(e) => handleBlur('fixe', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
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
                                value={inputValues.osint}
                                onChange={(e) => handleChange('osint', e.target.value)}
                                onBlur={(e) => handleBlur('osint', e.target.value)}
                                type="number"
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
                    <h2 className={styles.costTitle}>TESA</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.tesa}
                                onChange={(e) => handleChange('tesa', e.target.value)}
                                onBlur={(e) => handleBlur('tesa', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className={`${styles.formField} ${styles.smallField}`}>
                            <label>Monedă</label>
                            <input className={styles.inputBox} value={currency} readOnly />
                        </div>
                    </div>
                </div>

                <div className={styles.costBlock}>
                    <h2 className={styles.costTitle}>Tehnica</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.tehnica}
                                onChange={(e) => handleChange('tehnica', e.target.value)}
                                onBlur={(e) => handleBlur('tehnica', e.target.value)}
                                type="number"
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
                    <h2 className={styles.costTitle}>other</h2>
                    <div className={styles.costRow}>
                        <div className={styles.formField}>
                            <label>Cheltuieli totale</label>
                            <input
                                className={styles.inputBox}
                                value={inputValues.other}
                                onChange={(e) => handleChange('other', e.target.value)}
                                onBlur={(e) => handleBlur('other', e.target.value)}
                                type="number"
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
import React, { useState, useEffect } from "react";
import { useCreateHumintExpanseMutation } from "../../../../../../../services/humintExpanseApi";

import styles from "./AddHumintCostPopup.module.css";

const AddHumintCostPopup = ({ isOpen, onClose }) => {


    const [createExpense, { isLoading }] = useCreateHumintExpanseMutation();

    const [formData, setFormData] = useState({

        date: "",
        description: "",
        utility: "3",
        cost: "",
        currency: "EUR",
        taxPercentage: "32",
        costWithTaxes: "",
        total: "",
    });

    // handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // auto calculate tax cost
    useEffect(() => {
        const cost = parseFloat(formData.cost || 0);
        const tax = parseFloat(formData.taxPercentage || 0);

        const costWithTax = cost + (cost * tax) / 100;

        setFormData(prev => ({
            ...prev,
            costWithTaxes: isNaN(costWithTax) ? "" : costWithTax.toFixed(2),
            total: isNaN(costWithTax) ? "" : costWithTax.toFixed(2)
        }));
    }, [formData.cost, formData.taxPercentage]);

    const handleSubmit = async () => {
        try {
            await createExpense({
                ...formData,
                taxPercent: Number(formData.taxPercentage),
                taxIncludedCost: Number(formData.costWithTaxes),
                total: Number(formData.total),
            }).unwrap();

            // RESET FORM AFTER SUBMIT
            setFormData({

                date: "",
                description: "",
                utility: "3",
                cost: "",
                currency: "EUR",
                taxPercentage: "32",
                costWithTaxes: "",
                total: "",
            });

            onClose();

        } catch (error) {
            console.error(error);
            alert("Failed to save expense");
        }
    };


    if (!isOpen) return null;

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>

                <div className={styles.popupHeader}>
                    <h3 className={styles.popupTitle}>Adaugă cheltuiala HUMINT</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.popupBody}>
                    <div className={styles.formSection}>




                        {/* DATE + DESCRIPTION */}
                        <div className={styles.rowTwo}>
                            <div className={styles.formField}>
                                <label>Data</label>
                                <input
                                    type="date"
                                    name="date"
                                    className={styles.inputBox}
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Descriere</label>
                                <input
                                    name="description"
                                    className={styles.inputBox}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* COST ROWS – unchanged */}
                        <div className={styles.rowSix}>
                            <div className={styles.formField}>
                                <label>Utilitate</label>
                                <select
                                    className={styles.inputBox}
                                    name="utility"
                                    value={formData.utility}
                                    onChange={handleChange}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            <div className={styles.formField}>
                                <label>Cost</label>
                                <input
                                    className={styles.inputBox}
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Monedă</label>
                                <select
                                    name="currency"
                                    className={styles.inputBox}
                                    value={formData.currency}
                                    onChange={handleChange}
                                >
                                    <option value="EUR">EUR</option>
                                    <option value="RON">RON</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                            <div className={styles.formField}>
                                <label>Cost cu taxe</label>
                                <input className={styles.inputBox} value={formData.costWithTaxes} readOnly />
                            </div>

                            <div className={styles.formField}>
                                <label>Procent taxe</label>
                                <input
                                    className={styles.inputBox}
                                    name="taxPercentage"
                                    value={formData.taxPercentage}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Total</label>
                                <input className={styles.inputBox} value={formData.total} readOnly />
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.popupFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>Anulează</button>

                    <button
                        className={styles.saveButton}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Salvează cheltuiala"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddHumintCostPopup;

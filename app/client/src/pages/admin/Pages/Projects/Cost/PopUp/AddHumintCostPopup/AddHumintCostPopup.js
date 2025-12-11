import React, { useState } from 'react';
import styles from './AddHumintCostPopup.module.css';

const AddHumintCostPopup = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        utility: '3',
        cost: '',
        currency: 'EUR',
        costWithTaxes: '',
        taxPercentage: '32',
        total: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
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
                        {/* Row 1 */}
                        <div className={styles.rowTwo}>
                            <div className={styles.formField}>
                                <label>Data</label>
                                <input
                                    className={styles.inputBox}
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    placeholder="Selectează data"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Descriere</label>
                                <input
                                    className={styles.inputBox}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="ex: Interviu sursa, deplasare, verificare locatie"
                                />
                            </div>
                        </div>

                        {/* Row 2 (6 columns) */}
                        <div className={styles.rowSix}>
                            {/* Utilitate now as dropdown */}
                            <div className={styles.formField}>
                                <label>Utilitate (1-5)</label>
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
                                    placeholder="ex: 200"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Monedă</label>
                                <select
                                    className={styles.inputBox}
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                >
                                    <option value="EUR">EUR ▾</option>
                                    <option value="USD">USD</option>
                                    <option value="RON">RON</option>
                                </select>
                            </div>

                            <div className={styles.formField}>
                                <label>Cost cu taxe</label>
                                <input
                                    className={styles.inputBox}
                                    name="costWithTaxes"
                                    value={formData.costWithTaxes}
                                    onChange={handleChange}
                                    placeholder="ex: 200 + 32%"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Procent total taxe</label>
                                <input
                                    className={styles.inputBox}
                                    name="taxPercentage"
                                    value={formData.taxPercentage}
                                    onChange={handleChange}
                                    placeholder="32%"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Total (auto)</label>
                                <input
                                    className={styles.inputBox}
                                    name="total"
                                    value={formData.total}
                                    onChange={handleChange}
                                    placeholder="260 EUR"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.popupFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>Anulează</button>
                    <button className={styles.saveButton} onClick={handleSubmit}>
                        Salvează cheltuiala
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddHumintCostPopup;

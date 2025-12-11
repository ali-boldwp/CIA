import React, { useState } from 'react';
import styles from './AddEmployeeCostPopup.module.css';

const AddEmployeeCostPopup = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        analyst: '',
        role: '',
        date: '',
        hours: '',
        days: '',
        costPerHour: '',
        currency: 'EUR',
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
                    <h3 className={styles.popupTitle}>Adaugă cheltuiala (angajați)</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.popupBody}>
                    <div className={styles.formSection}>
                        <div className={styles.rowThree}>
                            <div className={styles.formField}>
                                <label>Analist</label>
                                <input
                                    className={styles.inputBox}
                                    name="analyst"
                                    value={formData.analyst}
                                    onChange={handleChange}
                                    placeholder="Selectează..."
                                />
                            </div>
                            <div className={styles.formField}>
                                <label>Rol</label>
                                <input
                                    className={styles.inputBox}
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="Selectează..."
                                />
                            </div>
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
                        </div>

                        <div className={styles.rowFive}>
                            <div className={styles.formField}>
                                <label>Ore lucrate</label>
                                <input
                                    className={styles.inputBox}
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    placeholder="ex: 6.5"
                                />
                            </div>
                            <div className={styles.formField}>
                                <label>Zile (automat)</label>
                                <input
                                    className={styles.inputBox}
                                    name="days"
                                    value={formData.days}
                                    onChange={handleChange}
                                    placeholder="ex: 0.5"
                                />
                            </div>
                            <div className={styles.formField}>
                                <label>Cost/ora (auto)</label>
                                <input
                                    className={styles.inputBox}
                                    name="costPerHour"
                                    value={formData.costPerHour}
                                    onChange={handleChange}
                                    placeholder="ex: 30"
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
                                <label>Total (auto)</label>
                                <input
                                    className={styles.inputBox}
                                    name="total"
                                    value={formData.total}
                                    onChange={handleChange}
                                    placeholder="195"
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

export default AddEmployeeCostPopup;
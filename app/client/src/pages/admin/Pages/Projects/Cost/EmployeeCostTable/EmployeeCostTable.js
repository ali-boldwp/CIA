import React, { useState } from 'react';
import styles from './EmployeeCostTable.module.css';
import { useGetAnalystsQuery } from '../../../../../../services/userApi';

const EmployeeCostTable = ({ onAddCost }) => {
    // Fetch analysts data from API
    const { data: response = {}, isLoading, error } = useGetAnalystsQuery();

    // Extract analysts array from response
    // Check if response has data property or is directly an array
    const analysts = response?.data || response || [];

    const [editingRow, setEditingRow] = useState(null);
    const [editedHours, setEditedHours] = useState({});

    // Function to handle edit
    const handleEdit = (index) => {
        setEditingRow(index);
        if (analysts[index]) {
            setEditedHours({ ...editedHours, [index]: analysts[index].hoursPerDay || 8 });
        }
    };

    // Function to handle save
    const handleSave = (index) => {
        // Here you would typically call an API to update the hours
        console.log(`Saving hours for analyst ${index}: ${editedHours[index]}`);
        setEditingRow(null);
    };

    // Function to handle cancel
    const handleCancel = () => {
        setEditingRow(null);
    };

    // Function to handle hours change
    const handleHoursChange = (index, value) => {
        setEditedHours({ ...editedHours, [index]: value });
    };

    // Function to calculate days based on hours (assuming 8 hours per day)
    const calculateDays = (hours) => {
        return hours / 8;
    };

    // Function to calculate total cost
    const calculateTotal = (analyst, hours) => {
        const actualHours = hours || analyst.hoursPerDay || 8;
        const costPerHour = analyst.costPerHour || 0;
        return (actualHours * costPerHour).toFixed(2);
    };

    // Function to calculate cost per day
    const calculateCostPerDay = (analyst) => {
        const costPerHour = analyst.costPerHour || 0;
        const hoursPerDay = analyst.hoursPerDay || 8;
        return (costPerHour * hoursPerDay).toFixed(2);
    };

    if (isLoading) {
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.loading}>Loading analysts data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.error}>Error loading analysts data</div>
            </div>
        );
    }

    // Check if analysts is actually an array
    if (!Array.isArray(analysts)) {
        console.error('Analysts is not an array:', analysts);
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.error}>Invalid data format received from API</div>
            </div>
        );
    }

    return (
        <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>

            <table className={styles.costTable}>
                <thead>
                <tr>
                    <th>Analist</th>
                    <th>Rol</th>
                    <th>Zile</th>
                    <th>Ore</th>
                    <th>Cost/ora</th>
                    <th>Cost/zi</th>
                    <th>Total</th>
                    <th>Editare</th>
                </tr>
                </thead>
                <tbody>
                {analysts.length === 0 ? (
                    <tr>
                        <td colSpan="8" className={styles.noData}>
                            No analysts found
                        </td>
                    </tr>
                ) : (
                    analysts.map((analyst, index) => {
                        const hours = editedHours[index] !== undefined ? editedHours[index] : analyst.hoursPerDay || 8;
                        const days = calculateDays(hours);
                        const costPerHour = analyst.costPerHour?.toFixed(2) || '0.00';
                        const costPerDay = calculateCostPerDay(analyst);
                        const total = calculateTotal(analyst, hours);

                        return (
                            <tr key={analyst._id || index}>
                                {/* Analist Name */}
                                <td>{analyst.name}</td>

                                {/* Rol - analystRole from API */}
                                <td>{analyst.analystRole || 'N/A'}</td>

                                {/* Zile - Calculated days */}
                                <td>{days.toFixed(1)}</td>

                                {/* Ore - Editable field */}
                                <td>
                                    {editingRow === index ? (
                                        <input
                                            className={styles.inputCell}
                                            type="number"
                                            value={hours}
                                            onChange={(e) => handleHoursChange(index, parseInt(e.target.value) || 0)}
                                            min="1"
                                            max="24"
                                        />
                                    ) : (
                                        hours
                                    )}
                                </td>

                                {/* Cost/ora - From API */}
                                <td>{costPerHour} EUR</td>

                                {/* Cost/zi - Calculated */}
                                <td>{costPerDay} EUR</td>

                                {/* Total - Calculated */}
                                <td>{total} EUR</td>

                                {/* Editare - Edit/Save buttons */}
                                <td className={styles.editCell}>
                                    {editingRow === index ? (
                                        <>
                                            <button
                                                className={styles.saveBtn}
                                                onClick={() => handleSave(index)}
                                            >
                                                ✔ Salvează
                                            </button>
                                            <button
                                                className={styles.cancelBtn}
                                                onClick={handleCancel}
                                            >
                                                × Anulează
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(index)}
                                        >
                                            📎 Modifică
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>

            {/* Blank strip under table */}
            <div className={styles.tableEmptyStrip} />

            {/* ADD EMPLOYEE COST BUTTON */}
            <button className={styles.btnGreen} onClick={onAddCost}>
                Adaugă cheltuiala
            </button>
        </div>
    );
};

export default EmployeeCostTable;
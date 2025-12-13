import React, { useState, useEffect } from 'react';
import styles from './EmployeeCostTable.module.css';
import { useGetProjectAnalystExpanseQuery } from '../../../../../../../services/humintExpanseApi';
import { toast } from "react-toastify";


const EmployeeCostTable = ({ onAddCost, projectId, projectData, onTotalCostUpdate }) => {
    // Get projectId from props
    console.log("EmployeeCostTable - Props received:", {
        projectId,
        hasProjectData: !!projectData,
        projectName: projectData?.projectName
    });

    // Use projectId from props
    const effectiveProjectId = projectId || "693c081dc1bd09040f202cda";

    console.log("EmployeeCostTable - Using Project ID:", effectiveProjectId);

    // Fetch analysts data for specific project
    const {
        data: response = {},
        isLoading,
        error,
        refetch
    } = useGetProjectAnalystExpanseQuery(effectiveProjectId, {
        skip: !effectiveProjectId,
    });

    // Debug logging
    useEffect(() => {
        console.log("API Response:", response);
        console.log("API Success:", response?.success);
        console.log("Total Expanses:", response?.expanses?.length);
        console.log("API Error:", error);
        console.log("API Loading:", isLoading);
    }, [response, error, isLoading]);

    // Extract analysts from expanses
    const expanses = response?.expanses || [];

    // Convert expanses to analysts array (unique analysts)
    const analystsMap = new Map();

    expanses.forEach(expanse => {
        const analyst = expanse.analystId;
        if (analyst && !analystsMap.has(analyst._id)) {
            const analystExpanses = expanses.filter(e =>
                e.analystId?._id === analyst._id
            );
            const totalHours = analystExpanses.reduce(
                (sum, e) => sum + (e.totalHours || (e.totalSecands / 3600) || 0),
                0
            );

            analystsMap.set(analyst._id, {
                analystId: analyst._id,
                analystName: analyst.name,
                role: analyst.analystRole || analyst.role,
                monthlySalary: analyst.monthlySalary || 0,
                costPerHour: analyst.costPerHour || 0,
                costPerDay: analyst.costPerDay || 0,
                hoursPerDay: analyst.hoursPerDay || 8,
                bonus: analyst.bonus || 0,
                totalHours: totalHours,
                expansesCount: analystExpanses.length
            });
        }
    });

    const analysts = Array.from(analystsMap.values());

    const [editingRow, setEditingRow] = useState(null);
    const [editedHours, setEditedHours] = useState({});

    const handleEdit = (index) => {
        setEditingRow(index);
        if (analysts[index]) {
            const hours = analysts[index].totalHours > 0 ?
                analysts[index].totalHours :
                analysts[index].hoursPerDay || 8;
            setEditedHours({ ...editedHours, [index]: hours });
        }
    };

    const handleSave = (index) => {
        console.log(`Saving hours for analyst ${index}: ${editedHours[index]}`);
        console.log(`For project: ${effectiveProjectId}`);
        setEditingRow(null);
    };

    const handleCancel = () => {
        setEditingRow(null);
    };

    const handleHoursChange = (index, value) => {
        setEditedHours({ ...editedHours, [index]: parseFloat(value) || 0 });
    };

    const calculateDays = (hours) => {
        return hours / 8;
    };

    const calculateTotal = (analyst, hours) => {
        const actualHours = hours || analyst.totalHours || analyst.hoursPerDay || 8;
        const costPerHour = analyst.costPerHour || 0;
        return actualHours * costPerHour;
    };

    const calculateCostPerDay = (analyst) => {
        const costPerHour = analyst.costPerHour || 0;
        const hoursPerDay = analyst.hoursPerDay || 8;
        return costPerHour * hoursPerDay;
    };

    const calculateTotalEmployeesCost = () => {
        let total = 0;
        analysts.forEach((analyst, index) => {
            const hours = editedHours[index] !== undefined ?
                editedHours[index] :
                analyst.totalHours || analyst.hoursPerDay || 8;
            total += calculateTotal(analyst, hours);
        });
        return total.toFixed(2);
    };

    // Calculate total cost and notify parent
    const totalEmployeesCost = calculateTotalEmployeesCost();

    // Notify parent component about total cost update
    useEffect(() => {
        if (onTotalCostUpdate && totalEmployeesCost) {
            onTotalCostUpdate(totalEmployeesCost);
        }
    }, [totalEmployeesCost, onTotalCostUpdate]);

    // If no projectId
    if (!effectiveProjectId) {
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.error}>
                    Error: Project ID is required
                    <br />
                    Please pass projectId as prop to EmployeeCostTable
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.loading}>
                    Loading analysts for project: {effectiveProjectId}
                </div>
            </div>
        );
    }

    if (error) {
        console.error("API Error Details:", error);
        return (
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Cheltuieli cu angajații (timp & cost)</h2>
                <div className={styles.error}>
                    <p>Error loading project analysts data</p>
                    <p>Project ID: {effectiveProjectId}</p>
                    <p>Status: {error.status}</p>
                    <p>Message: {error.data?.message || error.error || "Unknown error"}</p>
                    <button
                        onClick={refetch}
                        className={styles.retryBtn}
                    >
                        Retry
                    </button>
                </div>
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
                            Niciun analist nu a finalizat sarcina pentru acest proiect.
                            {expanses.length > 0 && (
                                <div className={styles.expansesNote}>
                                    (Found {expanses.length} expanses but no analyst data)
                                </div>
                            )}
                        </td>
                    </tr>
                ) : (
                    analysts.map((analyst, index) => {
                        const hours = editedHours[index] !== undefined ?
                            editedHours[index] :
                            analyst.totalHours || analyst.hoursPerDay || 8;
                        const days = calculateDays(hours);
                        const costPerHour = (analyst.costPerHour || 0).toFixed(2);
                        const costPerDay = calculateCostPerDay(analyst).toFixed(2);
                        const total = calculateTotal(analyst, hours).toFixed(2);

                        return (
                            <tr key={analyst.analystId || index}>
                                <td className={styles.analystName}>
                                    {analyst.analystName}
                                    {analyst.expansesCount > 0 && (
                                        <span className={styles.expansesCount}>
                                                ({analyst.expansesCount})
                                            </span>
                                    )}
                                </td>

                                <td>{analyst.role || 'N/A'}</td>

                                <td>{days.toFixed(1)}</td>

                                <td>
                                    {editingRow === index ? (
                                        <input
                                            className={styles.inputCell}
                                            type="number"
                                            value={hours}
                                            onChange={(e) => handleHoursChange(index, e.target.value)}
                                            min="0"
                                            max="720"
                                            step="0.5"
                                        />
                                    ) : (
                                        <span className={styles.hoursValue}>
                                                {hours.toFixed(2)}
                                            {analyst.totalHours > 0 && (
                                                <span className={styles.actualWork}>
                                                        (actual)
                                                    </span>
                                            )}
                                            </span>
                                    )}
                                </td>

                                <td className={styles.costPerHour}>{costPerHour} EUR</td>

                                <td className={styles.costPerDay}>{costPerDay} EUR</td>

                                <td className={styles.totalCost}>{total} EUR</td>

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

            <div className={styles.totalSection}>
                <div className={styles.totalLabel}>Total angajați:</div>
                <div className={styles.totalValue}>{totalEmployeesCost} EUR</div>
            </div>

            <button className={styles.btnGreen} onClick={onAddCost}>
                Adaugă cheltuiala
            </button>
        </div>
    );
};

export default EmployeeCostTable;
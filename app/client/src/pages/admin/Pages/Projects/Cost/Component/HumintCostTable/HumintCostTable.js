import React from 'react';
import styles from './HumintCostTable.module.css';
import { useGetHumintExpensesQuery, useGetHumintTotalsQuery } from '../../../../../../../services/humintExpanseApi';

const HumintCostTable = ({ onAddCost }) => {
    // Fetch HUMINT data from API
    const { data: humintExpenses, isLoading: loadingHumint } = useGetHumintExpensesQuery();
    const { data: humintTotals } = useGetHumintTotalsQuery();

    // Extract expenses array from response
    const expenses = humintExpenses?.data || [];

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dateString.slice(0, 10);
    };

    // Calculate total for display
    const displayTotal = humintTotals?.totals?.EUR
        ? `${humintTotals.totals.EUR.toFixed(2)} EUR`
        : '0.00 EUR';

    return (
        <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Cheltuieli HUMINT</h2>

            <table className={styles.costTable}>
                <thead>
                <tr>
                    <th>Data</th>
                    <th>Descriere</th>
                    <th>Utilitate</th>
                    <th>Cash</th>
                    <th>Taxe</th>
                    <th>Total</th>
                </tr>
                </thead>

                <tbody>
                {loadingHumint ? (
                    <tr>
                        <td colSpan="6" className={styles.loadingCell}>
                            Loading...
                        </td>
                    </tr>
                ) : expenses.length > 0 ? (
                    expenses.map(exp => {
                        // Calculate tax amount
                        const taxAmount = exp.taxIncludedCost - exp.cost;

                        return (
                            <tr key={exp._id}>
                                <td>{formatDate(exp.date)}</td>
                                <td>{exp.description || 'N/A'}</td>
                                <td>
                                    {/* REMOVED PROGRESS BAR - Only showing utility value */}
                                    <span className={styles.utilityValue}>
                                        {exp.utility || 0}/5
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.costAmount}>
                                        {exp.cost?.toFixed(2) || '0.00'} {exp.currency || 'EUR'}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.taxAmount}>
                                        {taxAmount.toFixed(2)} {exp.currency || 'EUR'}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.totalAmount}>
                                        {exp.total?.toFixed(2) || '0.00'} {exp.currency || 'EUR'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="6" className={styles.noDataCell}>
                            Nicio cheltuială HUMINT încă
                        </td>
                    </tr>
                )}
                </tbody>
            </table>



            {/* TOTAL HUMINT COST */}
            <div className={styles.totalBox}>
                <span className={styles.totalLabel}>Total HUMINT:</span>
                <span className={styles.totalValue}>{displayTotal}</span>
            </div>

            {/* ADD HUMINT COST BUTTON */}
            <button className={styles.btnGreen} onClick={onAddCost}>
                Adaugă cheltuiala
            </button>
        </div>
    );
};

export default HumintCostTable;
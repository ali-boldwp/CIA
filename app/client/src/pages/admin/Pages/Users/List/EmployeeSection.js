import React from "react";
import styles from "./EmployeeSection.module.css";

const EmployeeSection = ({ type, rows = [], onAddClick, onEdit, onDelete }) => {
    // ----- CONFIG PER SECTION -----
    const config = {
        management: {
            title: "Management",
            taxLabel: "Nivel taxe cash (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "role", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus lunar incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },

        investigatii: {
            title: "Analiza si Investigatii",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "analystRole", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "projectBonus", label: "Bonus proiect" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/ora" },
                { key: "actions", label: "Acțiuni" },
            ],
        },

        auxiliar: {
            title: "Personal TESA",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "role", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus lunar incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "hoursPerMonth", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },
        vanzari: {
            title: "Vânzări",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "role", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },

        logistica: {
            title: "Logistică",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "role", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },

        tehnica: {
            title: "Tehnică",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "role", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },
    };

    const current = config[type];
    const { title, taxLabel, columns } = current;

    // Helper function to format date to YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return "—";

        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return "—";

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            return "—";
        }
    };

    // Helper function to format numbers with 1 decimal place
    const formatNumberToOneDecimal = (number) => {
        if (number === undefined || number === null || number === "—") return "—";
        const num = Number(number);
        if (isNaN(num)) return "—";
        return num.toFixed(1);
    };

    // Helper function to truncate name to 2 words with ellipsis
    const truncateName = (name) => {
        if (!name) return "—";

        const words = name.trim().split(/\s+/); // Split by any whitespace

        if (words.length <= 2) {
            return name;
        }

        // Take first two words and add ellipsis
        return `${words[0]} ${words[1]}...`;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>

                {/* HEADER */}
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>{title}</h3>

                    <div className={styles.taxBox}>
                        <span className={styles.taxLabel}>{taxLabel}</span>
                        <select className={styles.taxSelect} defaultValue="32">
                            <option value="30">30</option>
                            <option value="31">31</option>
                            <option value="32">32</option>
                            <option value="33">33</option>
                            <option value="34">34</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className={styles.table}>
                    <div className={styles.headerRow}>
                        {columns.map((col) => (
                            <span key={col.key} className={styles.headerCell}>
                                {col.label}
                            </span>
                        ))}
                    </div>

                    {/* ROWS */}
                    {rows.map((row) => {

                        // Seniority
                        const hiringYear = row.hiringDate
                            ? new Date(row.hiringDate).getFullYear()
                            : null;
                        const currentYear = new Date().getFullYear();
                        const seniority = hiringYear
                            ? `${currentYear - hiringYear} ani`
                            : "—";

                        // Bonus With Tax (32%)
                        const taxMultiplier = 1.32;
                        const bonusWithTax = row.bonus
                            ? (row.bonus * taxMultiplier).toFixed(0)
                            : "—";

                        // Total Cost
                        const totalCost =
                            row.monthlySalary && row.bonus
                                ? Number(row.monthlySalary) + Number(bonusWithTax)
                                : "—";

                        return (
                            <div className={styles.dataRow} key={row._id}>
                                {columns.map((col) => {
                                    let value = row[col.key] ?? "—";

                                    // Name truncation
                                    if (col.key === "name") {
                                        value = truncateName(row.name);
                                    }

                                    // Date formatting for hiringDate
                                    if (col.key === "hiringDate") {
                                        value = formatDate(row.hiringDate);
                                    }

                                    // Dynamic values
                                    if (col.key === "seniority") value = seniority;
                                    if (col.key === "bonusWithTax") value = bonusWithTax;
                                    if (col.key === "totalCost") value = totalCost;

                                    // Format costPerDay and costPerHour to 1 decimal place
                                    if (col.key === "costPerDay" || col.key === "costPerHour") {
                                        value = formatNumberToOneDecimal(row[col.key]);
                                    }
                                    if (col.key === "hoursPerMonth" || col.key === "hoursPerMonth") {
                                        value = formatNumberToOneDecimal(row[col.key]);
                                    }

                                    // ACTIONS column
                                    if (col.key === "actions") {
                                        return (
                                            <div key="actions" className={styles.actionCell}>
                                                <span onClick={() => onEdit(row)}>✏️</span>
                                                <span onClick={() => onDelete(row._id)}>🗑️</span>
                                            </div>
                                        );
                                    }

                                    // Name cell
                                    if (col.key === "name") {
                                        return (
                                            <div key={col.key} className={styles.dataCellName}>
                                                {row.avatarDotColor && (
                                                    <span
                                                        className={styles.dot}
                                                        style={{ backgroundColor: row.avatarDotColor }}
                                                    />
                                                )}
                                                <span title={row.name}>{value}</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={col.key} className={styles.dataCell}>
                                            {value}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER */}
                <div className={styles.sectionFooter}>
                    <span>Total angajați: {rows.length}</span>
                    <span className={styles.footerCost}>
                        Cost total angajați (lunar): —
                    </span>
                </div>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => onAddClick(type)}
                >
                    + Adaugă angajat
                </button>

            </div>
        </div>
    );
};

export default EmployeeSection;
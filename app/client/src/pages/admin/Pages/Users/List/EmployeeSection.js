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
                { key: "functionName", label: "Funcție" },
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

        investigatii: {
            title: "Analiză și Investigații",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functionName", label: "Funcție" },
                { key: "hiringDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "monthlySalary", label: "Salariu brut/lună" },
                { key: "bonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total" },
                { key: "costPerDay", label: "Cost/zi" },
                { key: "costPerHour", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
        },

        auxiliar: {
            title: "Personal TESA",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functionName", label: "Funcție" },
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

        vanzari: {
            title: "Vânzări",
            taxLabel: "Nivel taxe (%)",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functionName", label: "Funcție" },
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
                { key: "functionName", label: "Funcție" },
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
                { key: "functionName", label: "Funcție" },
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
    if (!current) return null;

    const { title, taxLabel, columns } = current;

    // Helpers
    const formatDate = (date) => {
        if (!date) return "—";
        const d = new Date(date);
        return isNaN(d) ? "—" : d.toISOString().slice(0, 10);
    };

    const formatOneDecimal = (v) =>
        v === undefined || v === null || isNaN(v) ? "—" : Number(v).toFixed(1);

    const truncateName = (name) => {
        if (!name) return "—";
        const parts = name.trim().split(/\s+/);
        return parts.length <= 2 ? name : `${parts[0]} ${parts[1]}…`;
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
                            {[30, 31, 32, 33, 34].map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className={styles.table}>
                    <div className={styles.headerRow}>
                        {columns.map(col => (
                            <span key={col.key} className={styles.headerCell}>
                                {col.label}
                            </span>
                        ))}
                    </div>

                    {rows.map(row => {
                        const hiringYear = row.hiringDate
                            ? new Date(row.hiringDate).getFullYear()
                            : null;

                        const seniority = hiringYear
                            ? `${new Date().getFullYear() - hiringYear} ani`
                            : "—";

                        const bonusWithTax = row.bonus
                            ? (row.bonus * 1.32).toFixed(0)
                            : "—";

                        const totalCost =
                            row.monthlySalary
                                ? Number(row.monthlySalary) + Number(bonusWithTax || 0)
                                : "—";

                        return (
                            <div className={styles.dataRow} key={row._id}>
                                {columns.map(col => {
                                    let value = row[col.key] ?? "—";

                                    if (col.key === "name") value = truncateName(row.name);
                                    if (col.key === "hiringDate") value = formatDate(row.hiringDate);
                                    if (col.key === "seniority") value = seniority;
                                    if (col.key === "bonusWithTax") value = bonusWithTax;
                                    if (col.key === "totalCost") value = totalCost;
                                    if (["costPerDay", "costPerHour"].includes(col.key))
                                        value = formatOneDecimal(row[col.key]);

                                    if (col.key === "actions") {
                                        return (
                                            <div key="actions" className={styles.actionCell}>
                                                <span onClick={() => onEdit(row)}>✏️</span>
                                                <span onClick={() => onDelete(row._id)}>🗑️</span>
                                            </div>
                                        );
                                    }

                                    if (col.key === "name") {
                                        return (
                                            <div key={col.key} className={styles.dataCellName}>
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

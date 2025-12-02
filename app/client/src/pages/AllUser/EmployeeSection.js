import React from "react";
import styles from "./EmployeeSection.module.css";

const EmployeeSection = ({ type, onAddClick }) => {
    // ----- CONFIG PER SECTION -----
    const config = {
        management: {
            title: "Management",
            taxLabel: "Nivel taxe cash (%)",
            totalCost: "48 696 RON",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functie", label: "Funcție" },
                { key: "hireDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "baseSalary", label: "Salariu brut/lună" },
                { key: "monthlyBonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus lunar incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "dailyCost", label: "Cost/zi" },
                { key: "hourlyCost", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
            rows: [
                {
                    id: 1,
                    name: "Angajat M1",
                    functie: "CEO",
                    hireDate: "2018-03-10",
                    seniority: "7/10",
                    baseSalary: "18 000",
                    monthlyBonus: "1 200",
                    bonusWithTax: "1 584",
                    totalCost: "19 584",
                    dailyCost: "503",
                    hourlyCost: "63",
                    actions: "⋯",
                },
                {
                    id: 2,
                    name: "Angajat M2",
                    functie: "CFO",
                    hireDate: "2020-06-01",
                    seniority: "5/10",
                    baseSalary: "15 000",
                    monthlyBonus: "900",
                    bonusWithTax: "1 188",
                    totalCost: "16 188",
                    dailyCost: "458",
                    hourlyCost: "57",
                    actions: "⋯",
                },
                {
                    id: 3,
                    name: "Angajat M3",
                    functie: "Team manager",
                    hireDate: "2019-09-15",
                    seniority: "6/10",
                    baseSalary: "12 000",
                    monthlyBonus: "700",
                    bonusWithTax: "924",
                    totalCost: "12 924",
                    dailyCost: "538",
                    hourlyCost: "67",
                    actions: "⋯",
                },
            ],
        },

        investigatii: {
            title: "Investigații",
            taxLabel: "Nivel taxe (%)",
            totalCost: "47 422 RON",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functie", label: "Funcție" },
                { key: "hireDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "baseSalary", label: "Salariu brut/lună" },
                { key: "monthlyBonus", label: "Bonus lunar" },
                { key: "projectBonus", label: "Bonus proiect" },
                { key: "bonusWithTax", label: "Bonus incl. taxe" },
                { key: "totalCost", label: "Cost total" },
                { key: "dailyCost", label: "Cost/zi" },
                { key: "actions", label: "Acțiuni" },
            ],
            rows: [
                {
                    id: 1,
                    name: "Analist A",
                    functie: "Analist de informații",
                    hireDate: "2019-06-01",
                    seniority: "6/10",
                    baseSalary: "9 000",
                    monthlyBonus: "600",
                    projectBonus: "200",
                    bonusWithTax: "1 056",
                    totalCost: "10 056",
                    dailyCost: "503",
                    actions: "⋯",
                    avatarDotColor: "#4ade80",
                },
                {
                    id: 2,
                    name: "Analist B",
                    functie: "Analist de informații",
                    hireDate: "2020-11-10",
                    seniority: "5/10",
                    baseSalary: "8 500",
                    monthlyBonus: "500",
                    projectBonus: "0",
                    bonusWithTax: "660",
                    totalCost: "9 160",
                    dailyCost: "458",
                    actions: "⋯",
                    avatarDotColor: "#facc15",
                },
                {
                    id: 3,
                    name: "Analist C",
                    functie: "Analist de informații",
                    hireDate: "2018-01-15",
                    seniority: "7/10",
                    baseSalary: "9 500",
                    monthlyBonus: "650",
                    projectBonus: "300",
                    bonusWithTax: "1 254",
                    totalCost: "10 754",
                    dailyCost: "538",
                    actions: "⋯",
                    avatarDotColor: "#6366f1",
                },
                {
                    id: 4,
                    name: "Detectiv HUMINT 1",
                    functie: "Detectiv HUMINT",
                    hireDate: "2016-12-01",
                    seniority: "9/10",
                    baseSalary: "8 200",
                    monthlyBonus: "450",
                    projectBonus: "250",
                    bonusWithTax: "924",
                    totalCost: "9 124",
                    dailyCost: "456",
                    actions: "⋯",
                },
                {
                    id: 5,
                    name: "Detectiv HUMINT 2",
                    functie: "Detectiv HUMINT",
                    hireDate: "2023-02-01",
                    seniority: "2/10",
                    baseSalary: "7 800",
                    monthlyBonus: "400",
                    projectBonus: "0",
                    bonusWithTax: "528",
                    totalCost: "8 328",
                    dailyCost: "416",
                    actions: "⋯",
                },
            ],
        },

        auxiliar: {
            title: "Personal auxiliar",
            taxLabel: "Nivel taxe (%)",
            totalCost: "19 688 RON",
            columns: [
                { key: "name", label: "Nume" },
                { key: "functie", label: "Funcție" },
                { key: "hireDate", label: "Data angajării" },
                { key: "seniority", label: "Vechime" },
                { key: "baseSalary", label: "Salariu brut/lună" },
                { key: "monthlyBonus", label: "Bonus lunar" },
                { key: "bonusWithTax", label: "Bonus lunar incl. taxe" },
                { key: "totalCost", label: "Cost total angajat" },
                { key: "dailyCost", label: "Cost/zi" },
                { key: "hourlyCost", label: "Cost/oră" },
                { key: "actions", label: "Acțiuni" },
            ],
            rows: [
                {
                    id: 1,
                    name: "Angajat S1",
                    functie: "Sales",
                    hireDate: "2022-05-01",
                    seniority: "3/10",
                    baseSalary: "7 000",
                    monthlyBonus: "400",
                    bonusWithTax: "528",
                    totalCost: "7 528",
                    dailyCost: "503",
                    hourlyCost: "63",
                    actions: "⋯",
                },
                {
                    id: 2,
                    name: "Angajat T1",
                    functie: "Tehnician",
                    hireDate: "2017-07-01",
                    seniority: "8/10",
                    baseSalary: "6 500",
                    monthlyBonus: "300",
                    bonusWithTax: "396",
                    totalCost: "6 896",
                    dailyCost: "458",
                    hourlyCost: "57",
                    actions: "⋯",
                },
                {
                    id: 3,
                    name: "Angajat F1",
                    functie: "Șofer",
                    hireDate: "2021-10-01",
                    seniority: "4/10",
                    baseSalary: "5 000",
                    monthlyBonus: "200",
                    bonusWithTax: "264",
                    totalCost: "5 264",
                    dailyCost: "538",
                    hourlyCost: "67",
                    actions: "⋯",
                },
            ],
        },
    };

    const current = config[type] || config.management;
    const { title, taxLabel, totalCost, columns, rows } = current;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {/* HEADER: Title + Tax Box */}
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

                    {rows.map((row) => (
                        <div className={styles.dataRow} key={row.id}>
                            {columns.map((col) => {
                                const value = row[col.key] ?? "—";

                                if (col.key === "name") {
                                    return (
                                        <div key={col.key} className={styles.dataCellName}>
                                            {row.avatarDotColor && (
                                                <span
                                                    className={styles.dot}
                                                    style={{ backgroundColor: row.avatarDotColor }}
                                                />
                                            )}
                                            <span>{value}</span>
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
                    ))}
                </div>

                {/* FOOTER + BUTTON */}
                <div className={styles.sectionFooter}>
                    <span>Total angajați: {rows.length}</span>
                    <span className={styles.footerCost}>
            Cost total angajați (lunar): {totalCost}
          </span>
                </div>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => onAddClick && onAddClick(type)}
                >
                    + Adaugă angajat
                </button>
            </div>
        </div>
    );
};

export default EmployeeSection;

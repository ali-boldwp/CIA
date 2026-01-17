import styles from "./FinancialTable.module.css";
import { useState } from "react";

const FinancialTable = () => {
    const rows = [
        "Active imobilizate",
        "Active circulante",
        "Stocuri",
        "Creante",
        "Casa si conturi la banci",
        "Cheltuieli in avans",
        "Datorii",
        "Venituri in avans",
        "Capitaluri",
        "Cifra de afaceri neta",
        "Venituri totale",
        "Cheltuieli totale",
        "Profit/Pierdere bruta",
        "Profit/Pierdere neta",
        "Numar mediu angajati",
    ];

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                📊 Tabel date financiare pe ultimii 3 ani
            </h3>

            <p className={styles.subtitle}>
                Datele financiare ale societății (denumire societate), disponibile pentru
                perioada 2022–2024, pot fi ilustrate după cum urmează:
            </p>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Bilanț (valori în RON)</th>
                    <th>2024 (RON)</th>
                    <th>2023 (RON)</th>
                    <th>2022 (RON)</th>
                </tr>
                </thead>

                <tbody>
                {rows.map((label, index) => (
                    <tr key={index}>
                        <td className={styles.label}>{label}</td>

                        <td className={styles.value}>
                            <input type="text" placeholder="[ ]" />
                        </td>

                        <td className={styles.value}>
                            <input type="text" placeholder="[ ]" />
                        </td>

                        <td className={styles.value}>
                            <input type="text" placeholder="[ ]" />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialTable;

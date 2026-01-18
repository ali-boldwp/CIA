import styles from "./FinancialTable.module.css";

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

const FinancialTable = ({ value = {}, onChange }) => {

    const handleChange = (label, year, val) => {
        onChange({
            ...value,
            [label]: {
                ...value[label],
                [year]: val
            }
        });
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                📊 Tabel date financiare pe ultimii 3 ani
            </h3>

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
                {rows.map(label => (
                    <tr key={label}>
                        <td className={styles.label}>{label}</td>

                        {["2024", "2023", "2022"].map(year => (
                            <td key={year} className={styles.value}>
                                <input
                                    type="text"
                                    value={value?.[label]?.[year] || ""}
                                    onChange={(e) =>
                                        handleChange(label, year, e.target.value)
                                    }
                                    placeholder="[ ]"
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialTable;

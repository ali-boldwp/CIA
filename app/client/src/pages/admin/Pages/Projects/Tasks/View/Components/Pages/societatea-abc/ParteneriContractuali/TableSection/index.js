import React from "react";
import styles from "./styles.module.css";

const Index = ({ rows, addRow, deleteRow, handleCellChange }) => {

    return (
        <div className={styles.tableSection}>
            <h3 className={styles.sectionTitle}>
                📑 Tabel Parteneri Contractuali
            </h3>

            <div className={styles.tableContainer}>
                <table className={styles.editableTables}>
                    <thead>
                    <tr>
                        <th className={styles.colDenumire4}>DENUMIRE</th>
                        <th className={styles.colDescriere}>DESCRIERE</th>
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <input
                                    type="text"
                                    value={row[0] || ""}
                                    onChange={(e) =>
                                        handleCellChange(rowIndex, 0, e.target.value)
                                    }
                                    placeholder="[denumirea societatii]"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    value={row[1] || ""}
                                    onChange={(e) =>
                                        handleCellChange(rowIndex, 1, e.target.value)
                                    }
                                    placeholder="[descrierea societatii]"
                                />
                            </td>

                            <td>
                                <button
                                    className={styles.simpleDeleteButton}
                                    onClick={() => deleteRow(rowIndex)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className={styles.addRow} onClick={addRow}>
                    ➕ Adauga rand
                </button>
            </div>
        </div>
    );
};

export default Index;

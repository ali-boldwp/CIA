import React, { useState } from "react";
import styles from "./styles.module.css";

const Index = () => {
    const [rows, setRows] = useState([
        { denumire: "", descriere: "" }
    ]);

    // Add new row
    const handleAddRow = () => {
        setRows([...rows, { denumire: "", descriere: "" }]);
    };

    // Remove row by index
    const handleRemoveRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // Handle input change
    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    return (
        <div className={styles.tableSection}>
            <h3 className={styles.sectionTitle}>📑 Tabel parteneri contractuali</h3>

            <div className={styles.tableContainer}>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th className={styles.colDenumire}>DENUMIRE</th>
                        <th className={styles.colDescriere}>DESCRIERE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={row.denumire}
                                    onChange={(e) =>
                                        handleChange(index, "denumire", e.target.value)
                                    }
                                    placeholder="[denumirea societatii]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.descriere}
                                    onChange={(e) =>
                                        handleChange(index, "descriere", e.target.value)
                                    }
                                    placeholder="[descrierea societatii]"
                                />
                            </td>
                            <td>
                                <button
                                    className={styles.simpleDeleteButton}
                                    onClick={() => handleRemoveRow(index)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className={styles.addButton} onClick={handleAddRow}>
                    ➕ Adauga rand
                </button>
            </div>
        </div>
    );
};

export default Index;
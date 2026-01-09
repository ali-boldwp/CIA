import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { useAddBulkTableRowsMutation } from "../../../../../../../services/formFieldsApi";

const TableRecordsPopup = ({ open, onClose, tableField, taskId, onCreated }) => {
    const columns = tableField?.columns || [];

    const createEmptyRow = () => {
        const row = {};
        columns.forEach((col) => {
            row[col.slug] = col.type === "checkbox" ? false : "";
        });
        return row;
    };

    const [rows, setRows] = useState([]);

    // 🔁 reset rows when popup opens
    useEffect(() => {
        if (open && columns.length) {
            setRows([createEmptyRow()]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, columns.length]);

    const [addBulkTableRows, { isLoading }] = useAddBulkTableRowsMutation();

    const handleChange = (rowIndex, slug, value) => {
        setRows((prev) => {
            const updated = [...prev];
            updated[rowIndex] = { ...updated[rowIndex], [slug]: value };
            return updated;
        });
    };

    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    const removeRow = (rowIndex) => {
        setRows((prev) => prev.filter((_, i) => i !== rowIndex));
    };

    const saveAll = async () => {
        if (!rows.length) return;

        const payload = rows.map((row) => ({
            field: tableField._id,
            task: taskId,
            data: row,
        }));

        try {
            await addBulkTableRows(payload).unwrap();
            onCreated?.();
            onClose(false);
        } catch (err) {
            console.error("Failed to save records", err);
        }
    };

    const close = () => onClose(false);

    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Add Records</h3>

                    <button className={styles.closeBtn} onClick={close} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className={styles.wrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.slug}>{col.name}</th>
                            ))}
                            <th className={styles.actionsCol}>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col) => (
                                    <td key={col.slug}>
                                        {col.type === "checkbox" ? (
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={Boolean(row[col.slug])}
                                                onChange={(e) =>
                                                    handleChange(rowIndex, col.slug, e.target.checked)
                                                }
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={row[col.slug] ?? ""}
                                                onChange={(e) =>
                                                    handleChange(rowIndex, col.slug, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}

                                <td className={styles.rowActions}>
                                    <button
                                        className={styles.deleteRowBtn}
                                        onClick={() => removeRow(rowIndex)}
                                        disabled={isLoading || rows.length === 1}
                                        title={rows.length === 1 ? "At least 1 row required" : "Remove row"}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className={styles.footer}>
                        <button
                            onClick={addRow}
                            disabled={isLoading}
                            className={styles.addRowBtn}
                        >
                            + Add Row
                        </button>

                        <div className={styles.rightBtns}>
                            <button
                                onClick={close}
                                disabled={isLoading}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveAll}
                                disabled={isLoading}
                                className={styles.saveBtn}
                            >
                                {isLoading ? "Saving..." : "Save All Records"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableRecordsPopup;

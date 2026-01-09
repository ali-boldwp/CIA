import React from "react";
import styles from "./Task.module.css";
import { useGetTableRowsByFieldIdQuery } from "../../../../../../../services/formFieldsApi";

const normalizeKey = (s = "") =>
    String(s)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");

const TableField = ({ field }) => {
    const fieldId = field?._id || field?.id;

    const { data, isLoading, isError } = useGetTableRowsByFieldIdQuery(fieldId, {
        skip: !fieldId,
    });

    const raw = data?.data ?? data?.rows ?? data;
    const rows = Array.isArray(raw) ? raw : raw ? [raw] : [];

    if (isLoading) return <p>Loading {field.name}...</p>;
    if (isError) return <p>Error loading {field.name}</p>;

    return (
        <>
            <span>{field.name}</span>

            <table className={styles.table} style={{ marginTop: "10px" }}>
                <thead>
                <tr className={styles.tablerow}>
                    {field.columns?.map((col, index) => (
                        <th key={index} className={styles.tablehead}>
                            {col.name}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td className={styles.tabledata} colSpan={field.columns?.length || 1}>
                            No data
                        </td>
                    </tr>
                ) : (
                    rows.map((row, rIndex) => (
                        <tr key={row._id || rIndex} className={styles.tablerow}>
                            {field.columns?.map((col, cIndex) => {
                                const candidates = [
                                    col.key,
                                    normalizeKey(col.name),
                                    String(col.name || "").trim().toLowerCase(),
                                ].filter(Boolean);

                                const foundKey = candidates.find((k) =>
                                    Object.prototype.hasOwnProperty.call(row?.data || {}, k)
                                );

                                return (
                                    <td key={cIndex} className={styles.tabledata}>
                                        {foundKey ? row.data[foundKey] : "-"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </>
    );
};

export default TableField;

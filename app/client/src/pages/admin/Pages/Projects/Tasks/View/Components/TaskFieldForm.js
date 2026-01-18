// TaskFieldForm.jsx
import styles from "./TaskFieldForm.module.css";
import { useGetFoamFieldsByTaskIdQuery } from "../../../../../../../services/formFieldsApi";
import React, { useEffect, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import ImageDropzoneField from "./ImageDropzoneField";

// ✅ helper: create empty row object from table columns
const makeEmptyRow = (columns = []) => {
    const row = {};
    columns.forEach((c) => {
        row[c.slug] = "";
    });
    return row;
};

const  TaskFieldForm = ({ taskId, taskData, formValues, setFormValues }) => {
    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    // ✅ ordered rendering: inputs -> information -> table -> file
    const orderedFields = useMemo(() => {
        const fields = data?.data || [];
        const weight = (type) => {
            if (type === "information") return 2;
            if (type === "table") return 3;
            if (type === "file") return 4;
            return 1; // everything else (text/number/date/textarea/etc.)
        };

        // stable sort
        return [...fields]
            .map((f, idx) => ({ ...f, __idx: idx }))
            .sort((a, b) => {
                const wa = weight(a.type);
                const wb = weight(b.type);
                if (wa !== wb) return wa - wb;
                return a.__idx - b.__idx;
            })
            .map(({ __idx, ...rest }) => rest);
    }, [data]);

    // ✅ set initial form values (from taskData if present)
    useEffect(() => {
        if (!data?.data?.length) return;

        const initialValues = {};
        data.data.forEach((field) => {
            initialValues[field.slug] =
                field.type === "table"
                    ? taskData?.[field.slug] || []
                    : taskData?.[field.slug] || "";

        });

        setFormValues(initialValues);
    }, [data, taskData, setFormValues]);

    // ✅ ensure each TABLE has at least 1 default row
    useEffect(() => {
        if (!data?.data?.length) return;

        const tableFields = data.data.filter((f) => f.type === "table");
        if (!tableFields.length) return;

        setFormValues((prev) => {
            const next = { ...(prev || {}) };

            tableFields.forEach((tf) => {
                const existing = next[tf.slug];
                const fromTask = taskData?.[tf.slug];

                if (Array.isArray(fromTask) && fromTask.length > 0) {
                    next[tf.slug] = fromTask;
                    return;
                }

                if (Array.isArray(existing) && existing.length > 0) return;

                next[tf.slug] = [makeEmptyRow(tf.columns || [])];
            });

            return next;
        });
    }, [data, taskData, setFormValues]);

    const handleChange = (slug, value) => {
        setFormValues((prev) => ({
            ...(prev || {}),
            [slug]: value,
        }));
    };

    // ✅ table cell update
    const updateTableCell = (tableSlug, rowIndex, colSlug, value) => {
        setFormValues((prev) => {
            const current = Array.isArray(prev?.[tableSlug]) ? prev[tableSlug] : [];
            const nextRows = [...current];
            nextRows[rowIndex] = { ...(nextRows[rowIndex] || {}), [colSlug]: value };
            return { ...(prev || {}), [tableSlug]: nextRows };
        });
    };

    // ✅ add row
    const addTableRow = (tableSlug, columns) => {
        setFormValues((prev) => {
            const current = Array.isArray(prev?.[tableSlug]) ? prev[tableSlug] : [];
            const nextRows = [...current, makeEmptyRow(columns)];
            return { ...(prev || {}), [tableSlug]: nextRows };
        });
    };

    const editor = useRef(null);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "",
            height: 300,

            uploader: {
                insertImageAsBase64URI: true,
            },

            filebrowser: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className={styles.taskFieldForm}>
            {/* Header */}
            <div className={styles.formHeader}>
                <div>CRITERIU</div>
                <div>DETALII</div>
            </div>

            <div className={styles.rowsWrap}>
                {orderedFields.map((field) => {
                    const isFullWidthType = ["information", "table", "file"].includes(
                        field.type
                    );

                    return (
                        <div
                            key={field._id}
                            className={`${isFullWidthType ? styles.formField2 : styles.formField } ${
                                isFullWidthType ? styles.fullRow : ""
                            }`}
                        >
                            <label className={styles.fieldLabel}>{field.name}</label>

                            {/* FULL WIDTH TYPES */}
                            {isFullWidthType && (
                                <div className={styles.fullWidthInput}>
                                    {/* INFORMATION */}
                                    {field.type === "information" && (
                                        <JoditEditor
                                            ref={editor}
                                            value={formValues?.[field.slug] || ""}
                                            config={config}
                                            onBlur={(newContent) =>
                                                handleChange(field.slug, newContent)
                                            }
                                        />
                                    )}

                                    {/* TABLE (dynamic columns + default 1 row + add row button) */}
                                    {field.type === "table" && (
                                        <div className={styles.tableBox}>
                                            <div className={styles.tableGrid}>
                                                <div className={styles.tableHead}>
                                                    {(field.columns || []).map((col) => (
                                                        <div
                                                            key={col._id || col.slug}
                                                            className={styles.tableHeadCell}
                                                        >
                                                            {col.name}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className={styles.tableBody}>
                                                    {(formValues?.[field.slug] || []).map(
                                                        (row, rowIndex) => (
                                                            <div key={rowIndex} className={styles.tableRow}>
                                                                {(field.columns || []).map((col) => (
                                                                    <div
                                                                        key={col._id || col.slug}
                                                                        className={styles.tableCell}
                                                                    >
                                                                        <input
                                                                            className={styles.tableInput}
                                                                            type={col.type || "text"}
                                                                            value={row?.[col.slug] ?? ""}
                                                                            onChange={(e) =>
                                                                                updateTableCell(
                                                                                    field.slug,
                                                                                    rowIndex,
                                                                                    col.slug,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="[text editabil]"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className={styles.btnAddRow}
                                                onClick={() =>
                                                    addTableRow(field.slug, field.columns || [])
                                                }
                                            >
                                                + Adaugă rând
                                            </button>
                                        </div>
                                    )}

                                    {/* FILE */}
                                    {field.type === "file" && (
                                        <ImageDropzoneField
                                            label={field.name}
                                            value={formValues?.[field.slug]}
                                            onChange={(val) => handleChange(field.slug, val)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* NORMAL 2-COLUMN TYPES */}
                            {!isFullWidthType && (
                                <div className={styles.detailCell}>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            value={formValues?.[field.slug] || ""}
                                            onChange={(e) =>
                                                handleChange(field.slug, e.target.value)
                                            }
                                            placeholder="[text editabil]"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={formValues?.[field.slug] || ""}
                                            onChange={(e) =>
                                                handleChange(field.slug, e.target.value)
                                            }
                                            placeholder="[text editabil]"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className={styles.formFooter}>
                <button
                    type="button"
                    className={styles.saveBtn}
                >
                    Salvează secțiunea
                </button>
            </div>

        </div>
    );
};

export default TaskFieldForm;

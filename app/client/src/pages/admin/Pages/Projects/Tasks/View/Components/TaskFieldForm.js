// TaskFieldForm.jsx
import styles from "./TaskFieldForm.module.css";
import { useGetFoamFieldsByTaskIdQuery } from "../../../../../../../services/formFieldsApi";
import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import ImageDropzoneField from "./ImageDropzoneField";
import { useForms } from "./useForms";

const  TaskFieldForm = ({ taskId, taskData, formValues, setFormValues }) => {
    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    const {
        orderedFields,
        handleChange,
        updateTableCell,
        addTableRow,
    } = useForms({
        fields: data?.data || [],
        taskData,
        formValues,
        setFormValues,
    });

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

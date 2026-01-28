import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues, onSaveSection, isSaving }) => {
    const isInitialized = useRef(false);

    const defaultColumns = ["DENUMIRE MARCA", "DETALII"];
    const emptyRow = { name: "", details: "" };

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            marciOSIMIntroducere: "",
            columns: defaultColumns,
            rows: [emptyRow],
            images: [null]
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "rows"
    });

    const marciOSIMIntroducere = watch("marciOSIMIntroducere");
    const rows = watch("rows");
    const images = watch("images");
    const columns = watch("columns");

    // ✅ Initialize from parent (NO localStorage) — FIXED for async formValues
    useEffect(() => {
        // already initialized? do nothing
        if (isInitialized.current) return;

        const marciData = formValues?.marciOSIM;

        // ✅ IMPORTANT:
        // If data not yet available (API pending), DO NOT lock initialization.
        if (!marciData) return;

        setValue("marciOSIMIntroducere", marciData.marciOSIMIntroducere || "");
        setValue("columns", marciData.columns || defaultColumns);

        const savedRows = marciData.rows;

        // support array-of-arrays => convert for UI
        if (Array.isArray(savedRows) && Array.isArray(savedRows[0])) {
            const converted = savedRows.map(r => ({
                name: r?.[0] ?? "",
                details: r?.[1] ?? ""
            }));
            replace(converted.length > 0 ? converted : [emptyRow]);
        }
        // support object rows
        else if (Array.isArray(savedRows) && savedRows.length > 0 && typeof savedRows[0] === "object") {
            replace(savedRows.length > 0 ? savedRows : [emptyRow]);
        } else {
            replace([emptyRow]);
        }

        setValue(
            "images",
            Array.isArray(marciData.images) && marciData.images.length > 0 ? marciData.images : [null]
        );

        // ✅ Now lock initialization ONLY after real data has been applied
        isInitialized.current = true;
    }, [formValues?.marciOSIM, setValue, replace]);

    // ✅ Sync to parent (no localStorage)
    useEffect(() => {
        // only sync after we have loaded data at least once
        if (!isInitialized.current) return;

        const dataToSync = { marciOSIMIntroducere, columns, rows, images };

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                marciOSIM: dataToSync
            }));
        }
    }, [marciOSIMIntroducere, rows, images, columns, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => append({ name: "", details: "" });

    const deleteRow = index => {
        remove(index);
        if (rows.length === 1) append({ name: "", details: "" });
    };

    // ===== Images Handler =====
    const setImagesHandler = imgs => setValue("images", imgs.length === 0 ? [null] : imgs);

    // ===== Save Handler =====
    const onSubmit = data => {
        const transformedRows = (data.rows || []).map(row => [row?.name ?? "", row?.details ?? ""]);

        const payload = {
            data: {
                marciOSIM: {
                    marciOSIMIntroducere: data.marciOSIMIntroducere || "",
                    columns: data.columns || defaultColumns,
                    rows: transformedRows,
                    images: data.images || []
                }
            }
        };

        console.log("FINAL PAYLOAD:", payload);
        if (onSaveSection) onSaveSection(payload);

        // keep parent in saved format too
        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                marciOSIM: payload.data.marciOSIM
            }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 7. Proprietate intelectuala / Marci OSIM
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <Controller
                        control={control}
                        name="marciOSIMIntroducere"
                        render={({ field }) => (
                            <textarea
                                className={styles.textarea}
                                placeholder="Potrivit verificarilor efectuate..."
                                {...field}
                            />
                        )}
                    />
                    <button className={styles.deleteBox} onClick={() => setValue("marciOSIMIntroducere", "")}>
                        Șterge căsuța
                    </button>
                </div>

                {/* Table Marci */}
                <h3 className={styles.sectionTitle1}>® Tabel marci inregistrate la OSIM</h3>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((row, index) => (
                        <tr key={row.id}>
                            <td>
                                <Controller
                                    name={`rows.${index}.name`}
                                    control={control}
                                    render={({ field }) => <input type="text" placeholder={columns[0]} {...field} />}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`rows.${index}.details`}
                                    control={control}
                                    render={({ field }) => <input type="text" placeholder={columns[1]} {...field} />}
                                />
                            </td>
                            <td>
                                <button className={styles.trash} onClick={() => deleteRow(index)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className={styles.addRow} onClick={addRow}>
                    + Adaugă rând
                </button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>📷 Anexe OSIM (imagini / printscreen)</h3>
                    <ImagePlaceholder images={images} setImages={setImagesHandler} />
                </div>

                {/* Navigation / End Buttons */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton} disabled={isSaving} onClick={handleSubmit(onSubmit)}>
                            {isSaving ? (
                                <>
                                    <span className={styles.loader}></span>
                                    <span>...Salveaza</span>
                                </>
                            ) : (
                                "💾 Salveaza sectiunea"
                            )}
                        </button>

                        <button className={styles.middleButton}>
                            ❌ Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>

                        <button className={styles.nextButton}>
                            ➡️ Mergi la I.8. „Litigii societate”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;

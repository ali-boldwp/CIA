import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const LOCAL_STORAGE_KEY = "marciOSIMFormData";

const Index = ({ formValues, setFormValues, onSaveSection }) => {
    const isInitialized = useRef(false);

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            introducere: "",
            columns: ["DENUMIRE MARCA", "DETALII"],
            rows: [{ name: "", details: "" }],
            images: [null],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "rows",
    });

    const introducere = watch("introducere");
    const rows = watch("rows");
    const images = watch("images");
    const columns = watch("columns");
    const allData = watch(); // for localStorage

    // ===== Initialize from localStorage or parent =====
    useEffect(() => {
        if (isInitialized.current) return;

        const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if (savedData) {
            setValue("introducere", savedData.introducere || "");
            setValue("columns", savedData.columns || ["DENUMIRE MARCA", "DETALII"]);
            replace(savedData.rows && savedData.rows.length > 0 ? savedData.rows : [{ name: "", details: "" }]);
            setValue("images", savedData.images || [null]);
        } else if (formValues?.marciOSIM) {
            const marciData = formValues.marciOSIM;
            setValue("introducere", marciData.introducere || "");
            setValue("columns", marciData.columns || ["DENUMIRE MARCA", "DETALII"]);
            replace(marciData.rows && marciData.rows.length > 0 ? marciData.rows : [{ name: "", details: "" }]);
            setValue("images", marciData.images || [null]);
        }

        isInitialized.current = true;
    }, [formValues, setValue, replace]);

    // ===== Auto-save to localStorage & sync parent =====
    useEffect(() => {
        if (!isInitialized.current) return;

        const dataToSave = { introducere, columns, rows, images };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                marciOSIM: dataToSave
            }));
        }
    }, [introducere, rows, images, columns, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => append({ name: "", details: "" });
    const deleteRow = (index) => {
        remove(index);
        if (rows.length === 1) append({ name: "", details: "" });
    };

    // ===== Images Handler =====
    const setImagesHandler = (imgs) => setValue("images", imgs.length === 0 ? [null] : imgs);

    // ===== Save Handler =====
    const onSubmit = (data) => {
        const transformedRows = data.rows.map(row => [row.name, row.details]);

        const payload = {
            data: {
                marciOSIM: {
                    introducere: data.introducere,
                    columns: data.columns,
                    rows: transformedRows,
                    images: data.images,
                },
            },
        };

        console.log("FINAL PAYLOAD:", payload);

        if (onSaveSection) onSaveSection(payload);

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
                        name="introducere"
                        render={({ field }) => (
                            <textarea
                                className={styles.textarea}
                                placeholder="Potrivit verificarilor efectuate..."
                                {...field}
                            />
                        )}
                    />
                    <button className={styles.deleteBox} onClick={() => setValue("introducere", "")}>
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
                        <button className={styles.saveButton} onClick={handleSubmit(onSubmit)}>
                            <span className={styles.saveIcon}>💾</span> Salveaza sectiunea
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

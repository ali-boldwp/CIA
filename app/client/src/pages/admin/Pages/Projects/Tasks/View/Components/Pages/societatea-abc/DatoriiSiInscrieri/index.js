import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues  ,onSaveSection}) => {
    const isInitialized = useRef(false);

    // ===== React Hook Form =====
    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            introducere: "",
            columns: ["ACT JURIDIC / DATA", "CREDITOR", "DETALII"],
            rows: [{ date: "", note: "", details: "" }],
            images: []
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "rows"
    });

    const introducere = watch("introducere");
    const rows = watch("rows");
    const images = watch("images");
    const columns = watch("columns"); // ✅ now columns are watched

    // ===== Initialize from parent =====
    useEffect(() => {
        if (isInitialized.current || !formValues?.datorii) return;

        const datoriiData = formValues.datorii;

        setValue("introducere", datoriiData.introducere || "");
        setValue("columns", datoriiData.columns || ["ACT JURIDIC / DATA", "CREDITOR", "DETALII"]);
        replace(datoriiData.rows || [{ date: "", note: "", details: "" }]);
        setValue("images", datoriiData.images || []);

        isInitialized.current = true;
    }, [formValues, setValue, replace]);


    // ===== Sync to parent =====
    useEffect(() => {
        if (!isInitialized.current) return;
        setFormValues((prev) => ({
            ...prev,
            datorii: {
                introducere,
                columns, // ✅ save columns
                rows,
                images
            }
        }));
    }, [introducere, rows, images, columns, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => append({ date: "", note: "", details: "" });
    const deleteRow = (index) => {
        remove(index);
        if (rows.length === 1) append({ date: "", note: "", details: "" });
    };

    // ===== Images Handler =====
    const setImagesHandler = (imgs) => setValue("images", imgs);

    // ===== Save =====
    const onSubmit = async (data) => {
        try {
            const payload = { data: { datorii: data } }; // backend expects 'datorii'
            await onSaveSection(payload); // ye ViewTask me mutation call karega

            // frontend state update
            setFormValues(prev => ({
                ...prev,
                datorii: data
            }));

            console.log("✅ Sectiunea salvata:", payload);
        } catch (err) {
            console.error("❌ Eroare la salvare:", err);
        }
    };



    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 5. Datorii si inscrieri mobiliare
                </h1>

                {/* Introducere */}
                <h3 className={styles.sectionTitle}>
                    Situatia inscrierilor active existente in RNPM (AEGRM)
                </h3>
                <div className={styles.textAreaWrapper}>
                    <div className={styles.mainCard2}>
                        <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                        <Controller
                            control={control}
                            name="introducere"
                            render={({ field }) => (
                                <textarea
                                    className={styles.textarea}
                                    placeholder="In urma verificarilor efectuate..."
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    <button
                        className={styles.deleteBox}
                        onClick={() => setValue("introducere", "")}
                    >
                        Șterge căsuța
                    </button>
                </div>

                {/* Table */}
                <h3 className={styles.sectionTitle}>📋 Tabel datorii si inscrieri mobiliare</h3>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((row, index) => (
                        <tr key={row.id}>
                            <td>
                                <Controller
                                    name={`rows.${index}.date`}
                                    control={control}
                                    render={({ field }) => <input type="text" placeholder={columns[0]} {...field} />}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`rows.${index}.note`}
                                    control={control}
                                    render={({ field }) => <input type="text" placeholder={columns[1]} {...field} />}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`rows.${index}.details`}
                                    control={control}
                                    render={({ field }) => <input type="text" placeholder={columns[2]} {...field} />}
                                />
                            </td>
                            <td>
                                <button className={styles.trash} onClick={() => deleteRow(index)}>
                                    🗑️
                                </button>
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
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImagesHandler} />
                </div>

                {/* Navigation */}
                <div className={styles.navButtons}>
                    <button className={styles.saveButton} onClick={handleSubmit(onSubmit)}>
                        <span className={styles.saveIcon}>💾</span> Salveaza sectiunea
                    </button>

                    <button className={styles.middleButton}>
                        ❌ Exclude acest capitol
                        <span className={styles.arrowIcon}>→</span>
                    </button>

                    <button className={styles.nextButton}>
                        ➡️ Mergi la I.6. „Achizitii SEAP”
                        <span className={styles.arrowIcon}>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;

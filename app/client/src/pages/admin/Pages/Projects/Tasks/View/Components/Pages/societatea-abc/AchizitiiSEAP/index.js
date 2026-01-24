import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues, onSaveSection }) => {
    const achizitiiColumns = [
        "TIP ACHIZITIE",
        "AUTORITATE CONTRACTANTA",
        "OBIECT CONTRACT",
        "VALOARE CONTRACT (RON)",
        "DATA"
    ];

    /* =========================
       useForm INIT
    ========================== */
    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit
    } = useForm({
        defaultValues: {
            achizitii: {
                introducere: "",
                images: [],
                rows: [
                    { TIP: "", AUTORITATE: "", OBIECT: "", VALOARE: "", DATA: "" }
                ]
            }
        }
    });

    /* =========================
       FIELD ARRAY
    ========================== */
    const { fields, append, remove } = useFieldArray({
        control,
        name: "achizitii.rows"
    });

    /* =========================
       INIT FROM API
    ========================== */
    useEffect(() => {
        if (!formValues?.achizitii) return;

        setValue("achizitii.introducere", formValues.achizitii.introducere || "");

        setValue(
            "achizitii.rows",
            formValues.achizitii.rows?.length
                ? formValues.achizitii.rows.map(r => ({
                    TIP: r[0] || "",
                    AUTORITATE: r[1] || "",
                    OBIECT: r[2] || "",
                    VALOARE: r[3] || "",
                    DATA: r[4] || ""
                }))
                : [{ TIP: "", AUTORITATE: "", OBIECT: "", VALOARE: "", DATA: "" }]
        );

        setValue("achizitii.images", formValues.achizitii.images || []);
    }, [formValues, setValue]);

    const images = watch("achizitii.images");

    /* =========================
       SAVE
    ========================== */
    const handleSave = (data) => {
        const payload = {
            data: {
                achizitii: {
                    introducere: data.achizitii.introducere,
                    images: data.achizitii.images,
                    columns: achizitiiColumns,
                    rows: data.achizitii.rows.map(r => [
                        r.TIP,
                        r.AUTORITATE,
                        r.OBIECT,
                        r.VALOARE,
                        r.DATA
                    ])
                }
            }
        };

        onSaveSection && onSaveSection(payload);

        setFormValues(prev => ({
            ...prev,
            ...payload.data
        }));
    };

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 6. Achizitii SEAP
                </h1>
                <h4 className={styles.secondhalf}>
                    Analiza evolutiei financiare, tabel pe ultimii 3 ani si anexe grafice
                </h4>

                <form onSubmit={handleSubmit(handleSave)}>

                    {/* INTRODUCERE */}
                    <div className={styles.textAreaWrapper}>
                        <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="Conform verificarilor efectuate la autoritatile publice..."
                            {...register("achizitii.introducere")}
                        />
                        <div className={styles.deleteBoxContainer}>
                            <button
                                type="button"
                                className={styles.deleteBox}
                                onClick={() => setValue("achizitii.introducere", "")}
                            >
                                Șterge căsuța
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <h3 className={styles.sectionTitle}>📋 Tabel Achizitii SEAP</h3>
                    <table className={styles.editableTableIstoric}>
                        <thead>
                        <tr>
                            {achizitiiColumns.map(col => (
                                <th key={col}>{col}</th>
                            ))}
                            <th>ACTIUNI</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fields.map((row, index) => (
                            <tr key={row.id}>
                                <td><input {...register(`achizitii.rows.${index}.TIP`)} /></td>
                                <td><input {...register(`achizitii.rows.${index}.AUTORITATE`)} /></td>
                                <td><input {...register(`achizitii.rows.${index}.OBIECT`)} /></td>
                                <td><input {...register(`achizitii.rows.${index}.VALOARE`)} /></td>
                                <td><input {...register(`achizitii.rows.${index}.DATA`)} /></td>
                                <td>
                                    <button
                                        type="button"
                                        className={styles.trash}
                                        onClick={() => remove(index)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button
                        type="button"
                        className={styles.addRow}
                        onClick={() => append({ TIP: "", AUTORITATE: "", OBIECT: "", VALOARE: "", DATA: "" })}
                    >
                        + Adaugă rând
                    </button>

                    {/* IMAGES */}
                    <div className={styles.imagesSection}>
                        <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                        <ImagePlaceholder
                            images={images}
                            setImages={(imgs) =>
                                setValue("achizitii.images", imgs, { shouldDirty: true })
                            }
                        />
                    </div>

                    {/* SAVE */}
                    <div className={styles.navigation}>
                        <button type="submit" className={styles.saveButton}>
                            💾 Salvează secțiunea
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
                </form>
            </div>
        </div>
    );
};

export default Index;

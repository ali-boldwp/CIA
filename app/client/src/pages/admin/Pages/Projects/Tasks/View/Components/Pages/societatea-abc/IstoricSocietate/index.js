import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    const chronologyColumns = ["DATA", "MENTIUNI"];

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
            istoric: {
                historyText: "",
                images: [],
                chronology: [{ DATA: "", MENTIUNI: "" }]
            }
        }
    });

    /* =========================
       FIELD ARRAY
    ========================== */
    const { fields, append, remove } = useFieldArray({
        control,
        name: "istoric.chronology"
    });

    /* =========================
       INIT FROM API
    ========================== */
    useEffect(() => {
        if (!formValues?.istoric) return;

        setValue("istoric.historyText", formValues.istoric.historyText || "");

        setValue(
            "istoric.chronology",
            formValues.istoric.chronology?.rows?.length
                ? formValues.istoric.chronology.rows.map(r => ({
                    DATA: r[0],
                    MENTIUNI: r[1]
                }))
                : [{ DATA: "", MENTIUNI: "" }]
        );

        setValue("istoric.images", formValues.istoric.images || []);
    }, [formValues, setValue]);

    const images = watch("istoric.images");

    /* =========================
       SAVE
    ========================== */
    const handleSave = (data) => {
        const payload = {
            data: {
                istoric: {
                    historyText: data.istoric.historyText,
                    images: data.istoric.images,
                    chronology: {
                        columns: chronologyColumns,
                        rows: data.istoric.chronology.map(r => [
                            r.DATA,
                            r.MENTIUNI
                        ])
                    }
                }
            }
        };

        onSaveSection(payload);

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
                    I. Societatea ABC | 2. Istoric societate
                </h1>

                <form onSubmit={handleSubmit(handleSave)}>

                    {/* TEXT */}
                        <textarea
                            className={styles.textarea}
                            placeholder="Istoric societate..."
                            {...register("istoric.historyText")}
                        />

                        {/* TABLE */}
                        <table className={styles.editableTableIstoric}>
                            <thead>
                            <tr>
                                {chronologyColumns.map(c => (
                                    <th key={c}>{c}</th>
                                ))}
                                <th>ACTIUNI</th>
                            </tr>
                            </thead>

                            <tbody>
                            {fields.map((row, index) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            {...register(
                                                `istoric.chronology.${index}.DATA`
                                            )}
                                            placeholder="[zz.ll.aaaa]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            {...register(
                                                `istoric.chronology.${index}.MENTIUNI`
                                            )}
                                            placeholder="descriere"
                                        />
                                    </td>
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
                            onClick={() => append({ DATA: "", MENTIUNI: "" })}
                        >
                            + Adaugă rând
                        </button>

                        {/* IMAGES */}
                        <div className={styles.imagesSection}>
                            <h3 className={styles.sectionTitle}>
                                🖼️ Imagini / Grafice
                            </h3>

                            <ImagePlaceholder
                                images={images}
                                setImages={(imgs) =>
                                    setValue("istoric.images", imgs, {
                                        shouldDirty: true
                                    })
                                }
                            />
                        </div>

                        {/* SAVE */}
                        <div className={styles.navigation}>
                            <button
                                type="submit"
                                className={styles.saveButton}
                            >
                                💾 Salvează secțiunea
                            </button>
                        </div>

                </form>

            </div>
        </div>
    );
};

export default Index;

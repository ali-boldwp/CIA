import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";

const LOCAL_STORAGE_KEY = "litigiiFormData";

const Index = ({ formValues, setFormValues, onSaveSection }) => {
    const isInitialized = useRef(false);

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            introducere: "",
            rows: [
                { nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" }
            ],
            images: [null],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows"
    });

    const introducere = watch("introducere");
    const rows = watch("rows");
    const images = watch("images");
    const allData = watch();

    // ===== Initialize from localStorage or parent =====
    useEffect(() => {
        if (isInitialized.current) return;

        const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if (savedData) {
            setValue("introducere", savedData.introducere || "");
            setValue("rows", savedData.rows && savedData.rows.length > 0 ? savedData.rows : fields);
            setValue("images", savedData.images || [null]);
        } else if (formValues?.litigii) {
            const litigiiData = formValues.litigii;
            setValue("introducere", litigiiData.introducere || "");
            setValue("rows", litigiiData.rows && litigiiData.rows.length > 0 ? litigiiData.rows : fields);
            setValue("images", litigiiData.images || [null]);
        }

        isInitialized.current = true;
    }, [formValues, setValue]);

    // ===== Auto-save to localStorage & sync parent =====
    useEffect(() => {
        if (!isInitialized.current) return;

        const dataToSave = { introducere, rows, images };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                litigii: dataToSave
            }));
        }
    }, [introducere, rows, images, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => append({ nrDosar: "", data: "", instanta: "", obiect: "", materie: "", stadiu: "", parti: "", dataSolutiei: "", solutia: "" });
    const deleteRow = (index) => {
        remove(index);
        if (rows.length === 1) addRow(); // ensure at least 1 row
    };

    // ===== Images Handler =====
    const handleImagesChange = (imgs) => setValue("images", imgs.length > 0 ? imgs : [null]);

    // ===== Save Handler =====
    const onSubmit = (data) => {
        console.log("FINAL PAYLOAD:", data);
        if (onSaveSection) onSaveSection({ data: { litigii: data } });
        console.log("Data saved successfully ✅");
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC |  8. Litigii societate
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <div className={styles.mainCard2}>
                        <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                        <Controller
                            name="introducere"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Potrivit verificarilor efectuate la autoritatile publice..."
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    <button className={styles.deleteBox} onClick={() => setValue("introducere", "")}>
                        Șterge căsuța
                    </button>
                </div>

                {/* ⚖️ Fisa individuala litigiu */}
                <h3 className={styles.sectionTitle}>⚖️ Fisa individuala litigiu</h3>

                {fields.map((row, index) => (
                    <div key={row.id} className={styles.litigiuCard}>
                        {Object.keys(row).map((field) => (
                            <div key={field} className={styles.formRow}>
                                <label>{field.toUpperCase().replace(/([A-Z])/g, ' $1')}:</label>
                                <Controller
                                    name={`rows.${index}.${field}`}
                                    control={control}
                                    render={({ field: f }) => (
                                        <input type="text" {...f} />
                                    )}
                                />
                            </div>
                        ))}
                        <button className={styles.trash} onClick={() => deleteRow(index)}>🗑️ Șterge litigiu</button>
                    </div>
                ))}

                <button className={styles.addRow} onClick={addRow}>+ Adaugă litigiu</button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={handleImagesChange} />
                </div>

                {/* Navigation / End Buttons */}
                <Navigation
                    onSave={handleSubmit(onSubmit)}
                    nextLabel="➡️ Mergi la I.2. Istoric societate"
                    onNext={() => console.log("Navigate to next section")}
                />
            </div>
        </div>
    );
};

export default Index;

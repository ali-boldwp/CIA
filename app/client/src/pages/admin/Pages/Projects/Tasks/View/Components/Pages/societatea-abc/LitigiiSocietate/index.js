import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";

const Index = ({ formValues, setFormValues, onSaveSection, isSaving }) => {
    const isInitialized = useRef(false);

    // ✅ field labels (GeneralProfile style)
    const litigiiProfileFields = [
        { label: "Nr. dosar", key: "nrDosar" },
        { label: "Data", key: "data" },
        { label: "Instanta", key: "instanta" },
        { label: "Obiect", key: "obiect" },
        { label: "Materie", key: "materie" },
        { label: "Stadiu", key: "stadiu" },
        { label: "Parti", key: "parti" },
        { label: "Data solutiei", key: "dataSolutiei" },
        { label: "Solutia", key: "solutia" }
    ];

    const emptyLitigiu = () => ({
        nrDosar: "",
        data: "",
        instanta: "",
        obiect: "",
        materie: "",
        stadiu: "",
        parti: "",
        dataSolutiei: "",
        solutia: ""
    });

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            litigiiIntroducere: "",
            rows: [emptyLitigiu()],
            images: [null]
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "rows"
    });

    // ✅ FIXED watch names
    const litigiiIntroducere = watch("litigiiIntroducere");
    const rows = watch("rows");
    const images = watch("images");

    // ===== Initialize ONLY from parent (no localStorage) =====
    useEffect(() => {
        if (isInitialized.current) return;

        const litigiiData = formValues?.litigii || {};

        setValue("litigiiIntroducere", litigiiData.litigiiIntroducere || "");
        setValue(
            "images",
            Array.isArray(litigiiData.images) && litigiiData.images.length > 0 ? litigiiData.images : [null]
        );

        const savedRows = litigiiData.rows;

        // ✅ If profile-style (array-of-pairs) => convert to object for UI
        if (Array.isArray(savedRows) && Array.isArray(savedRows[0]) && typeof savedRows[0][0] === "string") {
            const obj = emptyLitigiu();

            savedRows.forEach(([label, value]) => {
                const map = litigiiProfileFields.find(f => f.label === label);
                if (map) obj[map.key] = value ?? "";
            });

            replace([obj]);
        }
        // ✅ If object-style rows
        else if (Array.isArray(savedRows) && savedRows.length > 0 && typeof savedRows[0] === "object") {
            const sanitized = savedRows.map(r => ({
                ...emptyLitigiu(),
                ...r
            }));
            replace(sanitized);
        } else {
            replace([emptyLitigiu()]);
        }

        isInitialized.current = true;
    }, [formValues, setValue, replace]);

    // ===== Sync parent ONLY (no localStorage) =====
    useEffect(() => {
        if (!isInitialized.current) return;

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                litigii: {
                    litigiiIntroducere,
                    rows, // UI rows (objects) while typing
                    images
                }
            }));
        }
    }, [litigiiIntroducere, rows, images, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => append(emptyLitigiu());

    const deleteRow = (index) => {
        remove(index);
        if (rows.length === 1) addRow(); // ensure at least 1 row
    };

    // ===== Images Handler =====
    const handleImagesChange = (imgs) => setValue("images", imgs.length > 0 ? imgs : [null]);

    // ✅ Convert UI row object -> profile-style array-of-pairs
    const toProfileRows = (litigiuObj) => {
        const obj = litigiuObj || emptyLitigiu();
        return litigiiProfileFields.map(f => [f.label, obj?.[f.key] ?? ""]);
    };

    // ===== Save Handler =====
    const onSubmit = (data) => {
        const firstLitigiu =
            Array.isArray(data.rows) && data.rows.length > 0 ? data.rows[0] : emptyLitigiu();

        const payload = {
            data: {
                litigii: {
                    litigiiIntroducere: data.litigiiIntroducere || "",
                    rows: toProfileRows(firstLitigiu), // ✅ profile style (your required API)
                    images: data.images || []
                }
            }
        };

        console.log("FINAL PAYLOAD:", payload);
        if (onSaveSection) onSaveSection(payload);

        // keep parent state synced with saved format too
        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                litigii: payload.data.litigii
            }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>I. Societatea ABC |  8. Litigii societate</h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <div className={styles.mainCard2}>
                        <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                        {/* ✅ FIXED Controller name */}
                        <Controller
                            name="litigiiIntroducere"
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

                    <button className={styles.deleteBox} onClick={() => setValue("litigiiIntroducere", "")}>
                        Șterge căsuța
                    </button>
                </div>

                {/* ⚖️ Fisa individuala litigiu */}
                <h3 className={styles.sectionTitle}>⚖️ Fisa individuala litigiu</h3>

                {fields.map((row, index) => (
                    <div key={row.id} className={styles.litigiuCard}>
                        {litigiiProfileFields.map(({ key, label }) => (
                            <div key={key} className={styles.formRow}>
                                <label>{label}:</label>
                                <Controller
                                    name={`rows.${index}.${key}`}
                                    control={control}
                                    render={({ field: f }) => <input type="text" {...f} />}
                                />
                            </div>
                        ))}

                        <button className={styles.trash} onClick={() => deleteRow(index)}>
                            🗑️ Șterge litigiu
                        </button>
                    </div>
                ))}

                <button className={styles.addRow} onClick={addRow}>
                    + Adaugă litigiu
                </button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={handleImagesChange} />
                </div>

                {/* Navigation / End Buttons */}
                <Navigation
                    onSave={handleSubmit(onSubmit)}
                    isSaving={isSaving}
                    nextLabel="➡️ Mergi la I.2. Istoric societate"
                    onNext={() => console.log("Navigate to next section")}
                />
            </div>
        </div>
    );
};

export default Index;

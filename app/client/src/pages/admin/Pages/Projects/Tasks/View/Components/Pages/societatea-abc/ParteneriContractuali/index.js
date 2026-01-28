import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./styles.module.css";
import TitleSection from "./TitleSection";
import TextAreaSection from "./TextAreaSection";
import TableSection from "./TableSection";
import ImageSection from "./ImageSection";

const Index = ({ formValues, setFormValues, onSaveSection, isSaving }) => {
    const isInitialized = useRef(false);

    // ===== React Hook Form =====
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            title: "",
            introText: "",
            table: {
                columns: ["Denumire", "Descriere"],
                rows: [["", ""]]
            },
            images: [null]
        }
    });

    const table = watch("table");
    const images = watch("images");
    const title = watch("title");
    const introText = watch("introText");

    // ✅ Load ONLY from parent (NO localStorage) — fixed for async formValues
    useEffect(() => {
        if (isInitialized.current) return;

        const data = formValues?.mainSection;

        // ✅ if API data not yet arrived, don't lock init
        if (!data) return;

        setValue("title", data.title || "");
        setValue("introText", data.introText || "In urma verificării surselor disponibile...");
        setValue(
            "table",
            data.table || { columns: ["Denumire", "Descriere"], rows: [["", ""]] }
        );
        setValue("images", data.images || [null]);

        isInitialized.current = true;
    }, [formValues?.mainSection, setValue]);

    // ✅ Sync parent on change (NO localStorage)
    useEffect(() => {
        if (!isInitialized.current) return;

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                mainSection: {
                    title,
                    introText,
                    table,
                    images
                }
            }));
        }
    }, [title, introText, table, images, setFormValues]);

    // ===== Table Handlers =====
    const addRow = () => {
        setValue("table", {
            ...table,
            rows: [...table.rows, ["", ""]]
        });
    };

    const deleteRow = index => {
        setValue("table", {
            ...table,
            rows: table.rows.filter((_, i) => i !== index)
        });
    };

    const handleCellChange = (rowIndex, colIndex, value) => {
        setValue("table", {
            ...table,
            rows: table.rows.map((row, i) =>
                i === rowIndex
                    ? row.map((cell, j) => (j === colIndex ? value : cell))
                    : row
            )
        });
    };

    // ===== Image Handler =====
    const handleImagesChange = imgs => setValue("images", imgs);

    // ===== Save Handler =====
    const onSubmit = data => {
        const payload = { data: { mainSection: data } };
        console.log("FINAL PAYLOAD:", payload);

        if (onSaveSection) onSaveSection(payload);

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                mainSection: data
            }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <TitleSection {...field} />}
                />

                <Controller
                    name="introText"
                    control={control}
                    render={({ field }) => (
                        <TextAreaSection {...field} onClear={() => setValue("introText", "")} />
                    )}
                />

                <TableSection
                    columns={table.columns}
                    rows={table.rows}
                    addRow={addRow}
                    deleteRow={deleteRow}
                    handleCellChange={handleCellChange}
                />

                <div className={styles.sectionWrapper}>
                    <ImageSection images={images} setImages={handleImagesChange} />
                </div>

                <div className={styles.navigation}>
                    <button
                        className={styles.saveButton}
                        disabled={isSaving}
                        onClick={handleSubmit(onSubmit)}
                    >
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
                        ➡️ Mergi la I.3. „Date financiare”
                        <span className={styles.arrowIcon}>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;

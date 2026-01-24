import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';

const LOCAL_STORAGE_KEY = "mainSectionFormData";

const Index = ({ formValues, setFormValues, onSaveSection }) => {
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
    const allData = watch();

    // ===== Load from localStorage or parent on mount =====
    useEffect(() => {
        if (isInitialized.current) return;

        // 1️⃣ Try to load from localStorage first
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.keys(parsed).forEach(key => setValue(key, parsed[key]));
        }
        // 2️⃣ If no localStorage, load from parent formValues
        else if (formValues?.mainSection) {
            const data = formValues.mainSection;
            setValue("title", data.title || "");
            setValue("introText", data.introText || "In urma verificării surselor disponibile...");
            setValue("table", data.table || { columns: ["Denumire", "Descriere"], rows: [["", ""]] });
            setValue("images", data.images || [null]);
        }

        isInitialized.current = true;
    }, [formValues, setValue]);

    // ===== Persist to localStorage on any change =====
    useEffect(() => {
        if (!isInitialized.current) return;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allData));
    }, [allData]);

    // ===== Table Handlers =====
    const addRow = () => {
        setValue("table", {
            ...table,
            rows: [...table.rows, ["", ""]]
        });
    };

    const deleteRow = (index) => {
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
    const handleImagesChange = (imgs) => setValue("images", imgs);

    // ===== Save Handler =====
    const onSubmit = (data) => {
        const payload = { data: { mainSection: data } };
        console.log("FINAL PAYLOAD:", payload);

        onSaveSection(payload);

        setFormValues(prev => ({
            ...prev,
            mainSection: data
        }));

        // Optional: clear localStorage after save
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
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
                    <ImageSection
                        images={images}
                        setImages={handleImagesChange}
                    />
                </div>

                <div className={styles.navigation}>
                    <button className={styles.saveButton} onClick={handleSubmit(onSubmit)}>
                        💾 Salvează secțiunea
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

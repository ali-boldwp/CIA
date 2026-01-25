import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";
import NotesPlaceholder from "./NotesPlaceholder";

const LOCAL_STORAGE_KEY = "controversyFormData";

const ControversyIndex = ({ formValues, setFormValues, onSaveSection,isSaving }) => {
    const isInitialized = useRef(false);

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            subpoints: [
                { title: "10.1. Subtitlu [ex: Implicarea in dosarul Microsoft]", text: "" }
            ],
            notes: [null],
            images: [null]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subpoints"
    });

    const subpoints = watch("subpoints");
    const notes = watch("notes");
    const images = watch("images");

    // ===== Initialize from localStorage or parent =====
    useEffect(() => {
        if (isInitialized.current) return;

        const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        let data = savedData || formValues?.controversy || {};

        // Ensure notes are File or null
        const safeNotes = (data.notes || [null]).map(n => (n instanceof File ? n : null));
        const safeImages = (data.images || [null]).map(i => i || null);

        setValue("subpoints", data.subpoints || fields);
        setValue("notes", safeNotes);
        setValue("images", safeImages);

        isInitialized.current = true;
    }, [formValues, setValue, fields]);

    // ===== Auto-save to localStorage + parent =====
    useEffect(() => {
        if (!isInitialized.current) return;

        const dataToSave = {
            subpoints,
            notes: notes.map(n => (n instanceof File ? n : null)),
            images
        };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                controversy: dataToSave
            }));
        }
    }, [subpoints, notes, images, setFormValues]);

    // ===== Handlers =====
    const addSubpoint = () =>
        append({ title: `10.${subpoints.length + 1}. Subtitlu`, text: "" });

    const deleteSubpoint = (index) => remove(index);

    const handleNotesChange = (updated) => {
        setValue(
            "notes",
            updated.map(n => (n instanceof File ? n : null))
        );
    };

    const handleImagesChange = (updated) => setValue("images", updated);

    const onSubmit = (data) => {
        console.log("FINAL PAYLOAD:", data);
        if (onSaveSection) onSaveSection({ data: { controversy: data } });
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 10. Controverse si aspecte de interes public
                </h1>

                {/* SUBPOINTS */}
                {fields.map((sp, index) => (
                    <div key={sp.id} className={styles.textAreaWrapper}>
                        <h3 className={styles.sectionTitle}>{sp.title}</h3>
                        <Controller
                            name={`subpoints.${index}.text`}
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    className={styles.textarea}
                                    placeholder="[Introdu textul narativ aici]"
                                    {...field}
                                />
                            )}
                        />
                        <div className={styles.deleteBoxContainer}>
                            <button
                                className={styles.deleteBox}
                                onClick={() => deleteSubpoint(index)}
                            >
                                Șterge căsuța
                            </button>
                        </div>
                    </div>
                ))}

                <button className={styles.addSubpoint} onClick={addSubpoint}>
                    ➕ Adauga subpunct nou
                </button>

                {/* NOTES + IMAGES */}
                <div className={styles.dualBox}>
                    <Controller
                        control={control}
                        name="notes"
                        render={({ field: { value, onChange } }) => (
                            <NotesPlaceholder
                                notes={value}
                                setNotes={onChange} // ab directly hook form ke saath linked
                            />
                        )}
                    />
                    <ImagePlaceholder images={images} setImages={handleImagesChange} />
                </div>

                {/* NAVIGATION / SAVE */}
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
                            ➡️ Mergi la I.3. „Date financiare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControversyIndex;

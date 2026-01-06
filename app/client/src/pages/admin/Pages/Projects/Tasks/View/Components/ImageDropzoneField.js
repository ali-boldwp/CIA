import React, { useEffect } from "react";
import styles from "./ImageDropzoneField.module.css";

const makeSlot = () => ({ file: null, preview: "" });

const ImageDropzoneField = ({ label, value, onChange, buttonText = "+ Adaugă poză/grafică" }) => {
    // value should be an array of slots
    const slots = Array.isArray(value) ? value : [];

    // ✅ start with 1 slot
    useEffect(() => {
        if (!Array.isArray(value) || value.length === 0) {
            onChange([makeSlot()]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addSlot = () => {
        onChange([...slots, makeSlot()]);
    };

    const setFile = (index, file) => {
        const next = [...slots];

        // cleanup old preview if any
        if (next[index]?.preview) {
            URL.revokeObjectURL(next[index].preview);
        }

        const preview = file ? URL.createObjectURL(file) : "";
        next[index] = { file, preview };
        onChange(next);
    };

    const removeFile = (index) => {
        const next = [...slots];
        if (next[index]?.preview) URL.revokeObjectURL(next[index].preview);
        next[index] = makeSlot();
        onChange(next);
    };

    const onDrop = (e, index) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) setFile(index, file);
    };

    const onDragOver = (e) => e.preventDefault();

    return (
        <div className={styles.wrapper}>
            <div className={styles.topRow}>
                <div>
                    <div className={styles.subtitle}>Adaugă imagini sau grafice (opțional).</div>
                </div>
            </div>
            <div className={styles.mainGrid}>
                <button type="button" className={styles.addBtn} onClick={addSlot}>
                    {buttonText}
                </button>

            <div className={styles.grid}>
                {slots.map((slot, idx) => (
                    <div
                        key={idx}
                        className={styles.zone}
                        onDrop={(e) => onDrop(e, idx)}
                        onDragOver={onDragOver}
                    >
                        {slot?.preview ? (
                            <div className={styles.previewWrap}>
                                <img className={styles.previewImg} src={slot.preview} alt="preview" />
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removeFile(idx)}
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.placeholder}>
                                    <span className={styles.icon} />
                                    <span>Plasează imagine/grafic aici</span>
                                </div>

                                {/* clickable input */}
                                <input
                                    className={styles.fileInput}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(idx, e.target.files?.[0] || null)}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default ImageDropzoneField;

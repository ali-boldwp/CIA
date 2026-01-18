import React from "react";
import styles from "./ImagePlaceholder.module.css";

const ImagePlaceholder = ({ value = [], onChange }) => {

    const handleAdd = () => {
        onChange([...value, null]);
    };

    const handleImageChange = (index, file) => {
        const updated = [...value];
        updated[index] = file; // 🔥 REAL FILE STORE
        onChange(updated);
    };

    return (
        <>
            <span>Adauga imagini sau grafice (optional).</span>

            <div className={styles.imageSection}>
                <button className={styles.addImageButton} onClick={handleAdd}>
                    + Adaugă poza/grafic
                </button>

                <div className={styles.imageGrid}>
                    {value.map((img, index) => (
                        <label key={index} className={styles.imagePlaceholder}>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    handleImageChange(index, e.target.files[0])
                                }
                            />

                            {img ? (
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className={styles.previewImage}
                                />
                            ) : (
                                <>
                                    <div className={styles.placeholderIcon}>🖼️</div>
                                    <div className={styles.placeholderText}>
                                        Plasează imagine / grafic aici
                                    </div>
                                </>
                            )}
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ImagePlaceholder;

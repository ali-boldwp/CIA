import React from "react";
import styles from "./styles.module.css";

const ImagePlaceholder = ({ images, setImages }) => {
    const handleAdd = () => {
        setImages([...images, null]);
    };

    const handleImageChange = (index, file) => {
        const updated = [...images];
        updated[index] = URL.createObjectURL(file);
        setImages(updated);
    };

    return (
        <>
            <h3 className={styles.sectionTitle}>🖼️ Imagini / Grafice</h3>
            <div className={styles.imageSection}>
                <button className={styles.addRow} onClick={handleAdd}>
                    ➕ Adauga poza/grafic
                </button>
                <div className={styles.imageGrid}>
                    {images.map((img, index) => (
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
                                <img src={img} alt="preview" className={styles.previewImage} />
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

import React, { useEffect } from "react";
import styles from "./ImagePlaceholder.module.css";

const ImagePlaceholder = ({ images = [], setImages }) => {
    // Ensure at least 1 uploader always visible
    useEffect(() => {
        if (images.length === 0) {
            setImages([null]);
        }
    }, [images, setImages]);

    // Add new uploader
    const handleAdd = () => {
        setImages([...images, null]);
    };

    // Update selected image
    const handleImageChange = (index, file) => {
        const updated = [...images];
        updated[index] = URL.createObjectURL(file);
        setImages(updated);
    };

    return (
        <>
            <div className={styles.imageSection10}>
                <button className={styles.addImageButton} onClick={handleAdd}>
                    <span className={styles.addIcon}>+</span>
                    Adaugă poza/grafic
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
                                <img
                                    src={img}
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

import React, { useState } from "react";
import styles from "./ImagePlaceholder.module.css";

const ImagePlaceholder = () => {
    const [images, setImages] = useState([null]); // start with 1 uploader

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
            <div className={styles.imageSection}>
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
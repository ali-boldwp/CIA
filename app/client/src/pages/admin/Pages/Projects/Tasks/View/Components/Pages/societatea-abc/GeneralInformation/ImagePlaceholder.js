import React from 'react';
import styles from './ImagePlaceholder.module.css';

const ImagePlaceholder = () => {
    const placeholders = [
        "Plaseaza imagine/grafic aici",
        "Plaseaza imagine/grafic aici",
        "Plaseaza imagine/grafic aici",
        "Plaseaza imagine/grafic aici"
    ];

    return (
        <div className={styles.imageSection}>
            <div className={styles.imageGrid}>
                {placeholders.map((text, index) => (
                    <div key={index} className={styles.imagePlaceholder}>
                        <div className={styles.placeholderIcon}>📷</div>
                        <div className={styles.placeholderText}>{text}</div>
                    </div>
                ))}
            </div>
            <button className={styles.addImageButton}>
                <span className={styles.addIcon}>+</span>
                Adauga poza/grafic
            </button>
        </div>
    );
};

export default ImagePlaceholder;
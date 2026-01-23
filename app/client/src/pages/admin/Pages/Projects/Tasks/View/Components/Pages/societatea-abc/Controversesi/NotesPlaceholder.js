import React, { useEffect } from "react";
import styles from "./ImagePlaceholder.module.css"; // reuse same styles

const NotesPlaceholder = ({ notes = [null], setNotes }) => {
    // Ensure at least one uploader
    useEffect(() => {
        if (!notes || notes.length === 0) setNotes([null]);
    }, [notes, setNotes]);

    // Add new uploader
    const handleAdd = () => setNotes([...notes, null]);

    // Update selected file
    const handleFileChange = (index, file) => {
        const updated = [...notes];
        updated[index] = file || null;
        setNotes(updated);
    };

    return (
        <div className={styles.imageSection10}>
            <button className={styles.addImageButton} onClick={handleAdd}>
                <span className={styles.addIcon}>+</span> ➕ Adauga nota / link referinta
            </button>

            <div className={styles.imageGrid}>
                {notes.map((file, index) => (
                    <label key={index} className={styles.imagePlaceholder}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                        {file instanceof File ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className={styles.previewImage}
                            />
                        ) : (
                            <div className={styles.placeholderText}>🔗 Zona pentru nota / link</div>
                        )}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default NotesPlaceholder;

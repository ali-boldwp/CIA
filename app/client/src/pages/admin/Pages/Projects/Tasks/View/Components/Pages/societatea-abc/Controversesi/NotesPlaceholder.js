import React, { useEffect } from "react";
import styles from "./ImagePlaceholder.module.css";

const NotesPlaceholder = ({ notes = [null], setNotes }) => {
    useEffect(() => {
        if (!notes || notes.length === 0) setNotes([null]);
    }, [notes, setNotes]);

    const handleAdd = () => setNotes([...notes, null]);

    const handleFileChange = (index, file) => {
        if (!file) return;

        const updated = [...notes];
        updated[index] = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
        };
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
                            accept="*"
                            hidden
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                        {file?.name ? (
                            <div className={styles.placeholderText}>
                                📄 {file.name}
                            </div>
                        ) : (
                            <div className={styles.placeholderText}>
                                🔗 Zona pentru nota / link
                            </div>
                        )}

                    </label>
                ))}
            </div>
        </div>
    );
};

export default NotesPlaceholder;

import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const ControversyIndex = ({ formValues, setFormValues }) => {
    // Initialize subpoints and notes in formValues if not exists
    const subpoints = formValues?.controversy?.subpoints || [
        { title: "10.1. Subtitlu [ex: Implicarea in dosarul Microsoft]", text: "" }
    ];
    const notes = formValues?.controversy?.notes || [""];
    const images = formValues?.controversy?.images || [null];

    const setSubpoints = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                subpoints: updated,
                notes,
                images
            }
        }));
    };

    const setNotes = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                notes: updated,
                subpoints,
                images
            }
        }));
    };

    const setImages = (updated) => {
        setFormValues(prev => ({
            ...prev,
            controversy: {
                ...prev.controversy,
                images: updated,
                subpoints,
                notes
            }
        }));
    };

    const addSubpoint = () => {
        setSubpoints([...subpoints, {
            title: `10.${subpoints.length + 1}. Subtitlu`,
            text: ""
        }]);
    };

    const addNote = () => setNotes([...notes, ""]);
    const addImage = () => setImages([...images, null]);

    const handleSubpointChange = (index, value) => {
        const updated = [...subpoints];
        updated[index].text = value;
        setSubpoints(updated);
    };

    const handleNoteChange = (index, value) => {
        const updated = [...notes];
        updated[index] = value;
        setNotes(updated);
    };

    const handleImageChange = (index, file) => {
        const updated = [...images];
        updated[index] = file;
        setImages(updated);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 10. Controverse si aspecte de interes public
                </h1>

                {subpoints.map((sp, i) => (
                    <div key={i} className={styles.textAreaWrapper}>
                        <h3 className={styles.sectionTitle}>{sp.title}</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="[Introdu textul narativ aici]"
                            value={sp.text}
                            onChange={(e) => handleSubpointChange(i, e.target.value)}
                        />
                        <button
                            className={styles.deleteBox}
                            onClick={() => setSubpoints(subpoints.filter((_, idx) => idx !== i))}
                        >
                            Șterge căsuța
                        </button>
                    </div>
                ))}

                <button className={styles.addSubpoint} onClick={addSubpoint}>
                    ➕ Adauga subpunct nou
                </button>

                {/* NOTE + IMAGE SECTION */}
                <div className={styles.dualBox}>
                    {/* NOTES */}
                    <div className={styles.box}>
                        <button className={styles.addBtn} onClick={addNote}>
                            ➕ Adauga nota / link referinta
                        </button>
                        {notes.map((note, i) => (
                            <div key={i} className={styles.dashedBox}>
                                <input
                                    type="text"
                                    placeholder="🔗 Zona pentru nota / link"
                                    value={note}
                                    onChange={(e) => handleNoteChange(i, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* IMAGES */}
                    <div className={styles.box}>
                        <button className={styles.addBtn} onClick={addImage}>
                            ➕ Adauga imagine / printscreen
                        </button>
                        <div className={styles.imageGrid}>
                            {images.map((img, i) => (
                                <label key={i} className={styles.dashedBox}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageChange(i, e.target.files[0])}
                                    />
                                    {img ? (
                                        <img
                                            src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                            alt="preview"
                                            className={styles.previewImage}
                                        />
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "1rem" }}>
                                            🖼️ Zona pentru imagine / printscreen
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControversyIndex;

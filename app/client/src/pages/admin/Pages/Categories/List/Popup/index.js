import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { toast } from "react-toastify";

const Popup = ({ isOpen, onClose, onSubmit, loading, apiError }) => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("active");
    const [slug, setSlug] = useState("");

    // Function to generate slug from name
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, "-") // spaces and underscores to hyphen
            .replace(/[^\w-]+/g, "") // remove special chars
            .replace(/--+/g, "-"); // remove duplicate hyphens
    };

    // Update slug automatically when name changes
    useEffect(() => {
        setSlug(generateSlug(name));
    }, [name]);

    const handleReset = () => {
        setName("");
        setStatus("active");
        setSlug("");
    };

    const handleAdd = async () => {
        if (!name.trim()) return;

        const payload = {
            name: name.trim(),
            slug, // include slug in payload
            status,
        };

        try {
            await toast.promise(
                onSubmit(payload),
                {
                    pending: "Se adaugă...",
                    success: "Categoria a fost adăugată!",
                    error: "A apărut o eroare. Încercați din nou.",
                }
            );

            handleReset();
            onClose();
        } catch (e) {
            // handle error if needed
        }
    };

    // Only render modal if open
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Adaugă categorie</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.body}>
                    {apiError && (
                        <div className={styles.errorBox}>
                            A apărut o eroare. Încercați din nou.
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>Nume</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Ex: Investigații"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Slug</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={slug}
                            readOnly
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Stare</label>
                        <select
                            className={styles.select}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.resetBtn} onClick={handleReset} disabled={loading}>
                        Reset
                    </button>

                    <button
                        className={styles.addBtn}
                        onClick={handleAdd}
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Se adaugă..." : "Adaugă"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;

import React, { useState } from "react";
import styles from "./style.module.css";
import { toast } from "react-toastify";

const INPUT_TYPES = [
    "text","number","email","password","textarea",
    "select","checkbox","radio","date","file","url"
];

const Popup = ({ isOpen, onClose, onSubmit, loading, apiError }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [type, setType] = useState("text");
    const [isSlugTouched, setIsSlugTouched] = useState(false);

    if (!isOpen) return null;

    const slugify = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")      // space → dash
            .replace(/[^a-z0-9-]/g, ""); // only a-z, 0-9, -


    const handleReset = () => {
        setName("");
        setSlug("");
        setType("text");
        setIsSlugTouched(false);
    };

    const handleNameChange = (value) => {
        setName(value);

        if (!isSlugTouched) {
            setSlug(slugify(value));
        }
    };


    const handleSlugChange = (value) => {
        setIsSlugTouched(true);
        setSlug(value);
    };


    const handleAdd = async () => {
        if (!name.trim() || !slug.trim()) return;

        try {
            await toast.promise(
                onSubmit({
                    name: name.trim(),
                    slug: slug.trim(),
                    type,
                }),
                {
                    pending: "Se adaugă câmpul...",
                    success: "Câmpul de formular a fost adăugat!",
                    error: "A apărut o eroare. Încercați din nou.",
                }
            );

            handleReset();
            onClose();
        } catch {}
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className={styles.header}>
                    <h3 className={styles.title}>Adaugă câmp de formular</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* BODY */}
                <div className={styles.body}>
                    {apiError && (
                        <div className={styles.errorBox}>
                            A apărut o eroare. Încercați din nou.
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>Nume câmp</label>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Ex: Adresă IP"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Slug</label>
                        <input
                            className={styles.input}
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="ex: adresa_ip"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Tip câmp</label>
                        <select
                            className={styles.select}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {INPUT_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* FOOTER */}
                <div className={styles.footer}>
                    <button
                        className={styles.resetBtn}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </button>

                    <button
                        className={styles.addBtn}
                        onClick={handleAdd}
                        disabled={loading || !name || !slug}
                    >
                        {loading ? "Se adaugă..." : "Adaugă"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;

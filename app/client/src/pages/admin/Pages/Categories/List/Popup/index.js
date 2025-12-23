import React, { useState } from "react";
import styles from "./style.module.css";

const Popup = ({ isOpen, onClose, onSubmit, loading, apiError }) => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("active");

    if (!isOpen) return null;

    const handleReset = () => {
        setName("");
        setStatus("active");
    };

    const handleAdd = async () => {
        if (!name.trim()) return;
        await onSubmit({ name: name.trim(), status });
        handleReset();
    };

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

import { useState } from "react";
import styles from "./AnalystOptionsPopup.module.css";

const AnalystOptionsPopup = ({
                                 analysts = [],
                                 onReplace,
                                 onRemove,
                                 onClose,
                             }) => {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState("");

    const filtered = analysts.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.popup}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className={styles.title}>
                    Opțiuni pentru Analiști alocați
                </h3>

                {/* REPLACE SECTION */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        ✏️ <span>Înlocuiește analistul</span>
                    </div>
                    <p className={styles.subText}>
                        Alege imediat un înlocuitor din listă
                    </p>

                    <input
                        type="text"
                        placeholder="🔎 Caută..."
                        className={styles.search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className={styles.list}>
                        {filtered.map((a) => (
                            <div
                                key={a._id}
                                className={`${styles.row} ${
                                    selectedId === a._id ? styles.active : ""
                                }`}
                                onClick={() => setSelectedId(a._id)}
                            >
                                <span>{a.name}</span>
                                <span
                                    className={`${styles.badge} ${
                                        a.isBusy ? styles.busy : styles.free
                                    }`}
                                >
                  {a.isBusy ? "ocupat" : "liber"}
                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        className={styles.replaceBtn}
                        disabled={!selectedId}
                        onClick={() => onReplace(selectedId)}
                    >
                        Înlocuiește
                    </button>
                </div>

                {/* REMOVE SECTION */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        🗑️ <span>Elimină din proiect</span>
                    </div>
                    <p className={styles.subText}>
                        Nu va mai figura în echipă
                    </p>

                    <button
                        className={styles.removeBtn}
                        onClick={onRemove}
                    >
                        Elimină
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalystOptionsPopup;

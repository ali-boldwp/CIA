import { useState, useMemo } from "react";
import styles from "./ReplaceResponsiblePopup.module.css";

const ReplaceResponsiblePopup = ({
                                     analysts ,
                                     currentResponsibleId,
                                     onReplace,
                                     onRemove,
                                     onClose
                                 }) => {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState("");

    // 🔍 Filter analysts by search
    const filteredAnalysts = useMemo(() => {
        return analysts.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, analysts]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.popup}
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className={styles.title}>Înlocuiește responsabilul</h4>

                {/* 🔍 SEARCH INPUT */}
                <input
                    type="text"
                    className={styles.search}
                    placeholder="🔍 Caută analist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* LIST */}
                <div className={styles.list}>
                    {filteredAnalysts.length === 0 && (
                        <div className={styles.empty}>Niciun rezultat</div>
                    )}

                    {filteredAnalysts.map((a) => (
                        <div
                            key={a._id}
                            className={`${styles.row} ${
                                selectedId === a._id ? styles.active : ""
                            }`}
                            onClick={() => setSelectedId(a._id)}
                        >
                            <span className={styles.name}>{a.name}</span>

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

                {/* ACTIONS */}
                <div className={styles.actions}>
                    <button
                        className={styles.primary}
                        disabled={!selectedId}
                        onClick={() => onReplace(selectedId)}
                    >
                        Înlocuiește
                    </button>

                    <button
                        className={styles.danger}
                        onClick={onRemove}
                    >
                        Elimină
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplaceResponsiblePopup;

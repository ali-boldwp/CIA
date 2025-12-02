import React from "react";
import styles from "./AddEmployeeModal.module.css";

const sectionNames = {
    management: "Management",
    investigatii: "Investigații",
    auxiliar: "Personal auxiliar",
};

const AddEmployeeModal = ({ isOpen, sectionKey, onClose }) => {
    if (!isOpen) return null;

    const sectionLabel = sectionNames[sectionKey] || "Angajat";

    const handleSubmit = (e) => {
        e.preventDefault();
        // yahan baad me real API call aa sakti hai
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Adaugă angajat – {sectionLabel}</h3>
                    <button
                        type="button"
                        className={styles.modalClose}
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.modalRow}>
                        <div className={styles.modalField}>
                            <label>Nume</label>
                            <input type="text" placeholder="ex: Analist D" />
                        </div>

                        <div className={styles.modalField}>
                            <label>Funcție</label>
                            <select defaultValue="">
                                <option value="" disabled>
                                    selectează...
                                </option>
                                <option value="ceo">CEO</option>
                                <option value="analist">Analist</option>
                                <option value="manager">Manager</option>
                                <option value="alt">Alt rol</option>
                            </select>
                        </div>

                        <div className={styles.modalField}>
                            <label>Data angajării</label>
                            <input type="date" />
                        </div>

                        <div className={styles.modalField}>
                            <label>Salariu brut/lună (RON)</label>
                            <input type="number" defaultValue={0} />
                        </div>

                        <div className={styles.modalField}>
                            <label>Bonus lunar (RON)</label>
                            <input type="number" defaultValue={0} />
                        </div>

                        <div className={`${styles.modalField} ${styles.modalFieldWide}`}>
                            <label>Note (opțional)</label>
                            <input type="text" placeholder="observații..." />
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveBtn}>
                            Salvează angajat
                        </button>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            Anulează
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;

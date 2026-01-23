
import React, { useState } from "react";
import styles from "./CheckboxSection.module.css";

const CheckboxSection = ({ value, onChange }) => {
    const [internalValue, setInternalValue] = useState(value || "existing");

    const selected = value !== undefined ? value : internalValue;

    const handleSelect = (val) => {
        if (value === undefined) {
            setInternalValue(val);
        }
        if (onChange) {
            onChange(val);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>

                {/* LEFT CARD */}
                <div
                    className={`${styles.card} ${
                        selected === "existing" ? styles.cardActive : ""
                    }`}
                    onClick={() => handleSelect("existing")}
                >
                    <div className={styles.radioWrapper}>
                        <span
                            className={`${styles.radioOuter} ${
                                selected === "existing"
                                    ? styles.radioOuterActive
                                    : ""
                            }`}
                        >
                            {selected === "existing" && (
                                <span className={styles.radioInner} />
                            )}
                        </span>
                    </div>

                    <div className={styles.textBlock}>
                        <h3 className={styles.title}>Legată de proiect existent</h3>
                        <p className={styles.subtitle}>
                            Alege un proiect în lucru — contextul se completează automat.
                        </p>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div
                    className={`${styles.card} ${
                        selected === "independent" ? styles.cardActive : ""
                    }`}
                    onClick={() => handleSelect("independent")}
                >
                    <div className={styles.radioWrapper}>
                        <span
                            className={`${styles.radioOuter} ${
                                selected === "independent"
                                    ? styles.radioOuterActive
                                    : ""
                            }`}
                        >
                            {selected === "independent" && (
                                <span className={styles.radioInner} />
                            )}
                        </span>
                    </div>

                    <div className={styles.textBlock}>
                        <h3 className={styles.title}>Solicitare independentă</h3>
                        <p className={styles.subtitle}>
                            Nu este legată de un proiect — vei completa contextul minim.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckboxSection;

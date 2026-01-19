import React from "react";
import styles from "./SectionHeader.module.css";

const SectionHeader = ({ value, onChange }) => {
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 3. Date financiare
                </h1>

                <h4 className={styles.secondhalf}>
                    Analiza evolutiei financiare, tabel pe ultimii 3 ani si anexe grafice
                </h4>

                <h3 className={styles.sectionTitle}>
                    💬 Analiza financiara (text cursiv)
                </h3>

                <div className={styles.textAreaWrapper}>
                    <textarea
                        className={styles.textarea}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="[Introdu textul narativ aici]"
                    />
                    <div className={styles.deleteBoxContainer}>
                    <button
                        className={styles.deleteBox}
                        onClick={() => onChange("")}
                    >
                        Șterge căsuța
                    </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SectionHeader;

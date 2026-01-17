import React from 'react';
import styles from './SectionHeader.module.css'

const SectionHeader = () => {
    return (
        <div>
            <div className={styles.container}>
                {/* Single Main Card Container with everything inside */}
                <div className={styles.mainCard}>

                    {/* Main Title */}
                    <h1 className={styles.mainTitle}>I. Societatea ABC | 3. Date financiare</h1>
                    <h4 className={styles.secondhalf}>Analiza evolutiei financiare, tabel pe ultimii 3 ani si anexe grafice</h4>
                    {/* Section Title */}
                    <h3 className={styles.sectionTitle}>💬 Analiza financiara (text cursiv)</h3>
                    <div className={styles.textAreaWrapper}>

                        <textarea
                            className={styles.textarea}
                            placeholder="[Introdu textul narativ aici]"
                        />
                        <button className={styles.deleteBox}>Șterge căsuța</button>
                    </div>                </div>
            </div>
        </div>
    );
};

export default SectionHeader;
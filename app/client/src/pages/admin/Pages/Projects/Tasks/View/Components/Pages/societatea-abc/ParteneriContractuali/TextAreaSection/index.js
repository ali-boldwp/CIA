import React, { useState } from 'react';
import styles from './styles.module.css';

const Index = () => {
    const [introText, setIntroText] = useState(
        "In urma verificării surselor disponibile si a consultarilor cu persoane avizate, a fost conturata o lista a partenerilor contractuali ai Societatii [denumire societate], incluzand companii precum:"
    );

    const handleClearText = () => {
        setIntroText("");
    };

    return (
        <div className={styles.introductionSection}>
            <h3 className={styles.introTitle}>💬 Introducere</h3>
            <div className={styles.textareaContainer}>
                <textarea
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    className={styles.introTextarea}
                    placeholder="Scrie introducerea aici..."
                    rows={4}
                />
                <div className={styles.clearButtonContainer}>
                    <button
                        className={styles.clearButton}
                        onClick={handleClearText}
                        type="button"
                    >
                        🗑️ Sterge casuta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;

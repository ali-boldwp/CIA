

import React, { useEffect } from 'react';
import styles from './styles.module.css';

const Index = ({ value, onChange, onClear }) => {
    // value = introText from parent
    // onChange = setIntroText from parent
    // onClear = () => setIntroText("")

    return (
        <div className={styles.introductionSection}>
            <h3 className={styles.introTitle}>💬 Introducere</h3>
            <div className={styles.textareaContainer}>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.introTextarea}
                    placeholder="Scrie introducerea aici..."
                    rows={4}
                />
                <div className={styles.clearButtonContainer}>
                    <button
                        className={styles.clearButton}
                        onClick={onClear}
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

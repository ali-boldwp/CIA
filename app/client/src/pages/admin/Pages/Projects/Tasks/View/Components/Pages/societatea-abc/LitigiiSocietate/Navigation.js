import React, { useState } from 'react';
import styles from './Navigation.module.css';

const Navigation = ({ onSave, onNext, nextLabel }) => {
    const [loading, setLoading] = useState(false);

    const handleSaveClick = async () => {
        if (!onSave) return;
        setLoading(true);
        try {
            await onSave();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.navigation}>
            <button
                className={styles.saveButton}
                onClick={handleSaveClick}
                disabled={loading}
            >
                {loading ? (
                    <>
                    <span className={styles.loader}></span>
                        <span>...Salveaza</span>
                    </>
                ) : (
                    "💾 Salveaza sectiunea"
                )}
            </button>
            <button className={styles.middleButton}>
                ❌ Exclude acest capitol
                <span className={styles.arrowIcon}>→</span>
            </button>
            {onNext && (
                <button className={styles.nextButton} onClick={onNext}>
                    {nextLabel || "➡️ Urmatoarea sectiune"}
                </button>
            )}
        </div>
    );
};

export default Navigation;

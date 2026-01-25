import React from 'react';
import styles from './Navigation.module.css';

const Navigation = ({handleSave,isSaving}) => {
    return (
        <div className={styles.navigation}>
            <div className={styles.navButtons}>
                <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>
                    {isSaving ? (
                        <>
                            <span className={styles.loader}></span>
                            <span>...Salveaza</span>
                        </>
                    ) : (
                        "💾 Salveaza sectiunea"
                    )}
                </button>
                <button className={styles.middleButton}>
                    ❌  Exclude acest capitol
                    <span className={styles.arrowIcon}>→</span>
                </button>
                <button className={styles.nextButton}>
                    ➡️  Mergi la I.2. „Istoric societate”
                    <span className={styles.arrowIcon}>→</span>
                </button>
            </div>
        </div>
    );
};

export default Navigation;
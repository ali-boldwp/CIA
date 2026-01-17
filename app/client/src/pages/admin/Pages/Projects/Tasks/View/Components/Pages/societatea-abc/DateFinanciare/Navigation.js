import React from 'react';
import styles from './Navigation.module.css';

const Navigation = () => {
    return (
        <div className={styles.navigation}>
            <div className={styles.navButtons}>
                <button className={styles.saveButton}>
                    <span className={styles.saveIcon}>💾</span>
                    Salveaza sectiunea
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
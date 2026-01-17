import React from 'react';
import styles from './Navigation.module.css';

const Navigation = () => {
    return (
        <div className={styles.navigation}>
            <button className={styles.saveButton}>
                💾  Salveaza sectiunea
            </button>
            <button className={styles.nextButton}>
                ➡️  Mergi la I.2. „Istoric societate”
            </button>
        </div>
    );
};

export default Navigation;
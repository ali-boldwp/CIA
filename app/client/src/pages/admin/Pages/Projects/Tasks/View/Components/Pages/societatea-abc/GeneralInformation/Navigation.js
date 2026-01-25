import React, { useState } from 'react';
import styles from './Navigation.module.css';

const Navigation = ({ onNext, nextLabel,isSaving }) => {

    return (
        <div className={styles.navigation}>
            <button
                type="submit"
                className={styles.saveButton}
                disabled={isSaving}
            >
                {isSaving ? (
                    <>
                        <span className={styles.loader}></span>
                        <span>...Salveaza</span>
                    </>
                ) : (
                    "💾 Salveaza sectiunea"
                )}
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

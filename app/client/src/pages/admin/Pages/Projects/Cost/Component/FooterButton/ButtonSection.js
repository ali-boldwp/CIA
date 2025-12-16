import React from 'react';
import styles from './ButtonSection.module.css';
import {useNavigate} from "react-router-dom";

const ButtonSection = ({
                           onSave = () => {},
                           onBack = () => {},
                           saveButtonText = "Salvează modificări",
                           backButtonText = "Înapoi la Pagina Proiect",
                           saveButtonColor = "#10B981",
                           showSaveButton = true,
                           showBackButton = true,
                           projectId
                       }) => {

    const navigate = useNavigate();

    const handleSave = () => {
        console.log("Save button clicked");
        onSave();
    };

    const handleBack = () => {

        navigate( `/project/view/${projectId}` )

        console.log("Back button clicked");
        onBack();
    };

    return (
        <div className={styles.footerCard}>
            <div className={styles.buttonContainer}>
                <div className={styles.buttonRow}>
                    {showSaveButton && (
                        <button
                            className={styles.btnSecondary}
                            onClick={handleSave}
                            style={{ backgroundColor: saveButtonColor }}
                        >
                            {saveButtonText}
                        </button>
                    )}

                    {showBackButton && (
                        <button
                            className={styles.btnPrimary}
                            onClick={handleBack}
                        >
                            {backButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ButtonSection;
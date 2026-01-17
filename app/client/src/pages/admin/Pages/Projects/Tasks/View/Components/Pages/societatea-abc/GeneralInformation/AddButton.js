import React from 'react';
import styles from './AddButton.module.css';

const AddButton = ({ text, onClick }) => {
    return (
        <button className={styles.addButton} onClick={onClick}>
            <span className={styles.addIcon}>+</span>
            {text}
        </button>
    );
};

export default AddButton;
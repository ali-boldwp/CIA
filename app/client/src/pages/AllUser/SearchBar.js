// src/components/SearchBar/SearchBar.js
import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.inputWrap}>
                    <span className={styles.icon}>🔍</span>
                    <input
                        type="text"
                        className={styles.input}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;

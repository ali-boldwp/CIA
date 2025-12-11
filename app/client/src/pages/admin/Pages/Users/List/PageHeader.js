// src/components/PageHeader/PageHeader.js
import React from "react";
import { useNavigate } from "react-router-dom";      // 👈 add this
import styles from "./PageHeader.module.css";

const PageHeader = ({ title }) => {
    const navigate = useNavigate();                 // 👈 router hook

    const goBack = () => {
        navigate("/");             // 👈 redirect
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <button className={styles.backBtn} onClick={goBack}>
                    <span className={styles.backBtnIcon}>⟵</span>
                    Înapoi la Dashboard
                </button>

                <h2 className={styles.title}>{title}</h2>
            </div>
        </div>
    );
};

export default PageHeader;

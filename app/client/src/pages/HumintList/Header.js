import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/manager/dashboard");
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                {/* LEFT: BACK BUTTON */}
                <button className={styles.backBtn} onClick={goBack}>
                    <span className={styles.backBtnIcon}>⟵</span>
                    Înapoi la Dashboard
                </button>

                {/* TITLE */}
                <h2 className={styles.title}>Solicitări HUMINT — De aprobat</h2>

            </div>
        </div>
    );
};

export default Header;

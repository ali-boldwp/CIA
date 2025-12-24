import React from "react";
import styles from "./Header.module.css";
import { FaEye } from "react-icons/fa";
import {Link} from "react-router-dom";


const Header = () => {
    return (
        <div className={styles.header}>
            <Link to="/categories" className={styles.headerLeft}>
                <span className={styles.arrow}>←</span>
                <span>Go back</span>
            </Link>

            <div className={styles.headerCenter}>Person</div>

            <div className={styles.headerRight}>
                <FaEye />
            </div>
        </div>
    );
};

export default Header;

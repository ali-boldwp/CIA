import React from "react";
import styles from "./Header.module.css";
import { FaEye } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Header = ({ category }) => {
    const location = useLocation();
    const isViewPage = location.pathname.startsWith("/view/");
    return (
        <div className={styles.header}>
            <Link to="/categories" className={styles.headerLeft}>
                <span className={styles.arrow}>←</span>
                <span>Go back</span>
            </Link>

            <div className={styles.headerCenter}>{isViewPage && category?.name ? category.name : "Hello"} </div>

            <div className={styles.headerRight}>
                <FaEye />
            </div>
        </div>
    );
};

export default Header;

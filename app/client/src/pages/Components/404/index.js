import React from "react";
import styles from "./404.module.css";
import {Link} from "react-router-dom";

const NotFound = () => {
    return (
        <div className={styles["cia-404-wrapper"]}>
            <div className={styles["cia-404-card"]}>

                <div className={styles["cia-404-badge"]}>404</div>

                <h1 className={styles["cia-404-title"]}>
                    Pagina nu a fost găsită
                </h1>

                {/* Subtitle removed */}

                <div className={styles["cia-404-illu"]}>
                    <div className={`${styles["cia-404-circle"]} ${styles.big}`}></div>
                    <div className={`${styles["cia-404-circle"]} ${styles.medium}`}></div>
                    <div className={`${styles["cia-404-circle"]} ${styles.small}`}></div>
                    <div className={styles["cia-404-dots"]}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <Link href="/login" className={styles["cia-404-button"]}>
                    ← Înapoi la dashboard
                </Link>

            </div>
        </div>
    );
};

export default NotFound;

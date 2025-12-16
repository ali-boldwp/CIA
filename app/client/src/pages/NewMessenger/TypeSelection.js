import React, { useState } from "react";
import styles from "./TypeSelection.module.css";
import UserTable from "./UserTable";

const TypeSelection = () => {
    // mode: "single" | "group"
    const [mode, setMode] = useState("single");

    const handleModeChange = (nextMode) => {
        setMode(nextMode);
    };

    return (
        <div className={styles.container}>
            {/* TOP: MODE CARDS */}
            <div className={styles.row}>
                {/* LEFT: SINGLE USER */}
                <div
                    className={`${styles.card} ${
                        mode === "single" ? styles.cardActive : ""
                    }`}
                    onClick={() => handleModeChange("single")}
                >
                    <div className={styles.radioWrapper}>
                        <span
                            className={`${styles.radioOuter} ${
                                mode === "single"
                                    ? styles.radioOuterActive
                                    : ""
                            }`}
                        >
                            {mode === "single" && (
                                <span className={styles.radioInner} />
                            )}
                        </span>
                    </div>

                    <div className={styles.textBlock}>
                        <h3 className={styles.title}>Single user selector</h3>

                    </div>
                </div>

                {/* RIGHT: MULTI USER */}
                <div
                    className={`${styles.card} ${
                        mode === "group" ? styles.cardActive : ""
                    }`}
                    onClick={() => handleModeChange("group")}
                >
                    <div className={styles.radioWrapper}>
                        <span
                            className={`${styles.radioOuter} ${
                                mode === "group"
                                    ? styles.radioOuterActive
                                    : ""
                            }`}
                        >
                            {mode === "group" && (
                                <span className={styles.radioInner} />
                            )}
                        </span>
                    </div>

                    <div className={styles.textBlock}>
                        <h3 className={styles.title}>Group by multiple users</h3>
                    </div>
                </div>
            </div>

            {/* BOTTOM: USER TABLE AS SEPARATE COMPONENT */}
            <UserTable mode={mode} />
        </div>
    );
};

export default TypeSelection;

// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetailButton.js
import React from "react";
import styles from "./ProjectDetailButton.module.css";

const ProjectDetailButton = ({
                                 onSave,
                                 onGoToTask,
                                 onViewCosts,
                             }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.buttonRow}>
                <button
                    type="button"
                    className={styles.saveBtn}
                    onClick={onSave}
                >
                    Salvează modificările
                </button>

                <button
                    type="button"
                    className={styles.taskBtn}
                    onClick={onGoToTask}
                >
                    Mergi la Task Proiect
                </button>

                <button
                    type="button"
                    className={styles.costBtn}
                    onClick={onViewCosts}
                >
                    Vezi Costuri
                </button>
            </div>
        </div>
    );
};

export default ProjectDetailButton;

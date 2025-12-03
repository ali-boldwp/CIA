// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetailButton.js
import React from "react";
import styles from "./ProjectDetailButton.module.css";
import {Link} from "react-router-dom";

const ProjectDetailButton = ({
                                 onSave,
                                 onGoToTask,
                                 onViewCosts,
                                    id
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

                <Link  to={`/project/${id}/tasks`}
                    type="button"
                    className={styles.taskBtna}
                    onClick={onGoToTask}
                >
                    Mergi la Task Proiect
                </Link>

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

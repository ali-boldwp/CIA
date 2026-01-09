import React from "react";
import styles from "./Task.module.css";
import TableField from "./TableField";

const Task = ({ taskId }) => {
    return (
        <div className={styles.item}>
            <span className={styles.name}>{taskId?.name}</span>

            {taskId?.foamFields?.map((field) =>
                field.type === "table" ? (
                    <TableField key={field._id || field.id} field={field} />
                ) : null
            )}
        </div>
    );
};

export default Task;

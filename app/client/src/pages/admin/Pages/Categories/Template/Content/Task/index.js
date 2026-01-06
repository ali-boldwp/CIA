import styles from "./Task.module.css";

const Task = ({ taskId }) => {
    console.log(taskId?.foamFields?.name)
    return (
        <div className={styles.item}>
            <span className={styles.name}>{taskId?.name}</span>
            {
                taskId?.foamFields?.map((nme) => (
                    nme.type === "table" && (
                        <table border={1} style={{marginTop:"10px"}}>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                        )
                ))
            }
        </div>
    );
};

export default Task;

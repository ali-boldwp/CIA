import styles from "./Task.module.css";

const Task = ({ taskId }) => {
    console.log(taskId?.foamFields?.name)
    return (
        <div className={styles.item}>
            <span className={styles.name}>{taskId?.name}</span>
            {
                taskId?.foamFields?.map((nme) => (
                    nme.type === "table" && (
                        <>
                        <span>{nme.name}</span>
                        <table className={styles.table} style={{ marginTop: "10px" }}>
                            <tr className={styles.tablerow}>
                                {nme.columns.map((item, index) => (
                                    <th key={index} className={styles.tablehead}>
                                        {item.name}
                                    </th>
                                ))}
                            </tr>

                            <tr>
                                {nme.columns.map((item, index) => (
                                    <td key={index} className={styles.tabledata}>
                                        {/* yahan data ayega */}
                                    </td>
                                ))}
                            </tr>
                        </table>
                        </>
                    )
                ))
            }
        </div>
    );
};

export default Task;

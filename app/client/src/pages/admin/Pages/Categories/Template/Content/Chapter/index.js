    import styles from "./style.module.css";
    import Task from "../Task";
    const Chapter = ({ data }) => {
    console.log(data.tasks)
        return (
            <div className={ styles.wrapper }>
                <h2> { data.name } </h2>

                    {data.tasks?.map(taskId => (
                        <Task
                            key={taskId}
                            taskId={taskId}

                        />
                    ))}

                <div
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            </div>
        )

    }

    export default Chapter;
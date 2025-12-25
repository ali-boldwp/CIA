import styles from "./style.module.css";

const Chapter = ({ data }) => {

    return (
        <div className={ styles.wrapper }>
            <h2> { data.name } </h2>
            <div
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </div>
    )

}

export default Chapter;
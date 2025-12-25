import styles from "./style.module.css";

const Chapter = ({ data }) => {

    return (
        <div className={ styles.wrapper }>
            <h2> { data.name } </h2>
            { data.content }
        </div>
    )

}

export default Chapter;
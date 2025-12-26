import styles from "./style.module.css";

const Title = ({ title, onClick }) => {
    const displayTitle =
        title && title.trim() !== "" ? title : "Click To Change Title";

    return (
        <div className={styles.wrapper}>
            <h1
                className={!title ? styles.placeholder : ""}
                style={{ cursor: "pointer" }}
                onClick={onClick}
            >
                {displayTitle}
            </h1>
        </div>
    );
};

export default Title;

import Title from "./Title";
import Chapter from "./Chapter";
import styles from "./style.module.css";

const Content = ({ data, onTitleClick }) => {
    return (
        <div className={styles.container}>
            <Title title={data.title} onClick={onTitleClick} />

            <div className={styles.chapters}>
                {data.chapters.map((chapter, ci) => {
                    return <Chapter key={chapter._id || ci} data={chapter} />;
                })}
            </div>
        </div>
    );
};

export default Content;

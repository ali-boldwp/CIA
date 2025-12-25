import styles from "./style.module.css";

const Popup = ({ header, content, footer, onClose, open = true }) => {
    if (!open) return null;

    return (
        <div className={styles.popup}>
            <div
                className={styles.overlay}
                onClick={() => onClose(false)}
            ></div>

            <div className={styles.wrap}>
                <div className={styles.header}>{header}</div>

                <div className={styles.body}>{content}</div>

                <div className={styles.footer}>{footer}</div>
            </div>
        </div>
    );
};

export default Popup;

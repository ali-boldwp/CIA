import styles from "./style.module.css";

const Header = ({ title }) => {

    return (
        <div className={ styles.header }>
            <div></div>
            <span>{ title }</span>
            <div></div>
        </div>
    )

}

export default Header;
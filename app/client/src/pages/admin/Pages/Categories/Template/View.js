import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import styles from "./style.module.css";

const View = ({ data }) => {

    return (
        <div className={ styles.container }>
            <Header
                title={ data.name }
            />
            <div className={ styles.content }>
                <Sidebar
                    data={ data }
                />
                <div className={ styles.contentTemplate }>
                    <Content
                        data={ data }
                    />
                </div>
            </div>
        </div>
    )

}

export default View;
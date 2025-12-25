import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import ChapterPopup from "./Popup/Chapter"

import styles from "./style.module.css";
import {useState} from "react";

const View = ({ data }) => {

    const [ newChapterPopup, setNewChapterPopup ] = useState( false );

    return (
        <>
            <div className={ styles.container }>
                <Header
                    title={ data.name }
                />
                <div className={ styles.content }>
                    <Sidebar
                        data={ data }
                        openChapterNew={ setNewChapterPopup }
                    />
                    <div className={ styles.contentTemplate }>
                        <Content
                            data={ data }
                        />
                    </div>
                </div>
            </div>
            { newChapterPopup && <ChapterPopup
                open={ newChapterPopup }
                onClose={ setNewChapterPopup }
            /> }
        </>
    )

}

export default View;
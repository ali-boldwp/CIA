import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import ChapterPopup from "./Popup/Chapter"

import styles from "./style.module.css";
import {useState} from "react";

const View = ({ data, categoryId, onChapterCreated }) => {


    const [newChapterPopup, setNewChapterPopup] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);


    return (
        <>
            <div className={ styles.container }>
                <Header
                    title={ data.name }
                />
                <div className={ styles.content }>
                    <Sidebar
                        data={data}
                        openChapterNew={() => {
                            setSelectedChapter(null);
                            setNewChapterPopup(true);
                        }}
                        onEditChapter={(ch) => {
                            setSelectedChapter(ch);
                            setNewChapterPopup(true);
                        }}
                    />

                    <div className={ styles.contentTemplate }>
                        <Content
                            data={ data }
                        />
                    </div>
                </div>
            </div>
            {newChapterPopup && (
                <ChapterPopup
                    open={newChapterPopup}
                    onClose={setNewChapterPopup}
                    categoryId={categoryId}
                    chapter={selectedChapter}
                    onCreated={onChapterCreated}
                />
            )}

        </>
    )

}

export default View;
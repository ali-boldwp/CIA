import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import ChapterPopup from "./Popup/Chapter";
import TaskPopup from "./Popup/Task";


import styles from "./style.module.css";
import {useState} from "react";

const View = ({ data, categoryId, onChapterCreated }) => {

    // Chapter popup sate
    const [newChapterPopup, setNewChapterPopup] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);


    // Task popup State
    const [newTaskPopup, setNewTaskPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);



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

                        // ✅ ADD THESE
                        openTaskNew={(chapter) => {
                            setSelectedTask({ chapterId: chapter._id }); // new task for this chapter
                            setNewTaskPopup(true);
                        }}
                        onEditTask={(task, chapter) => {
                            setSelectedTask({
                                uid: task._id,
                                name: task.name,
                                content: task.content || "",
                                chapterId: chapter._id,
                            });
                            setNewTaskPopup(true);
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


                {newTaskPopup && (
                    <TaskPopup
                        open={newTaskPopup}
                        onClose={setNewTaskPopup}
                        chapterId={selectedTask?.chapterId}  // ✅ yahi sahi hai
                        task={selectedTask}
                        onCreated={onChapterCreated}         // ✅ same refetch function
                    />
                )}





        </>
    )

}

export default View;
import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import ChapterPopup from "./Popup/Chapter";
import TaskPopup from "./Popup/Task";
import FieldPopup from "./Popup/Field";
import TitlePopup from "./Popup/Title";
import TablePopup from "./Popup/Table";
import TableRecordsPopup from "./Popup/TableRecords";





import styles from "./style.module.css";
import {useState , useEffect} from "react";

const View = ({ data, categoryId, onChapterCreated }) => {

    // Chapter popup sate
    const [newChapterPopup, setNewChapterPopup] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);


    // Task popup State
    const [newTaskPopup, setNewTaskPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Field popup state
    const [newFieldPopup, setNewFieldPopup] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    // Title PopUp

    const [titlePopup, setTitlePopup] = useState(false);

    // Table Column popup state

    const [newColumnPopup, setNewColumnPopup] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);


    // 🔹 Table Records popup state
    const [recordPopup, setRecordPopup] = useState(false);
    const [recordData, setRecordData] = useState(null);


    // For Set Data According to drag and drop

    const [localData, setLocalData] = useState(null);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    if (!localData) return null;

    ;




    return (
        <>
            <div className={ styles.container }>
                <Header title={localData.name} />

                <div className={ styles.content }>
                    <Sidebar
                        data={localData}
                        setData={setLocalData}
                        openChapterNew={() => {
                            setSelectedChapter(null);
                            setNewChapterPopup(true);
                        }}
                        onEditChapter={(ch) => {
                            setSelectedChapter(ch);
                            setNewChapterPopup(true);
                        }}


                        openTaskNew={(chapter) => {
                            setSelectedTask({ chapterId: chapter._id });
                            setNewTaskPopup(true);
                        }}
                        onEditTask={(task, chapter) => {
                            setSelectedTask({
                                uid: task._id,
                                name: task.name,
                                content: task.content || "",
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewTaskPopup(true);
                        }}


                        openFieldNew={(task, chapter) => {
                            setSelectedField({
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewFieldPopup(true);
                        }}
                        onEditField={(field, task, chapter) => {
                            setSelectedField({
                                uid: field._id,
                                name: field.name,
                                slug: field.slug,
                                type: field.type,
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewFieldPopup(true);
                        }}

                        openColumnNew={(field, task, chapter) => {
                            setSelectedColumn({
                                chapterId: chapter._id,
                                taskId: task._id,
                                tableField: field,
                            });
                            setNewColumnPopup(true);
                        }}

                        onEditColumn={(column, field, task, chapter) => {
                            setSelectedColumn({
                                chapterId: chapter._id,
                                taskId: task._id,
                                tableField: field,
                                column: {
                                    uid: column._id,
                                    name: column.name,
                                    slug: column.slug,
                                    type: column.type || "text",
                                },
                            });
                            setNewColumnPopup(true);
                        }}

                        openTableRecords={(field, task, chapter) => {
                            setRecordData({
                                tableField: field,
                                taskId: task._id,
                            });
                            setRecordPopup(true);
                        }}


                    />



                    <div className={ styles.contentTemplate }>
                        <Content
                            data={localData}
                            onTitleClick={() => setTitlePopup(true)}
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
                        chapterId={selectedTask?.chapterId}
                        task={selectedTask}
                        categoryId={categoryId}
                        onCreated={onChapterCreated}
                    />
                )}

            {newFieldPopup && (
                <FieldPopup
                    open={newFieldPopup}
                    onClose={setNewFieldPopup}
                    chapterId={selectedField?.chapterId}
                    taskId={selectedField?.taskId}
                    field={selectedField}
                    onCreated={onChapterCreated} // refetch
                />
            )}

            {newColumnPopup && (
                <TablePopup
                    open={newColumnPopup}
                    onClose={setNewColumnPopup}
                    chapterId={selectedColumn?.chapterId}
                    taskId={selectedColumn?.taskId}
                    tableField={selectedColumn?.tableField}
                    column={selectedColumn?.column || null}
                    onCreated={onChapterCreated}
                />


            )}



            {titlePopup && (
                <TitlePopup
                    open={titlePopup}
                    onClose={setTitlePopup}
                    categoryId={categoryId}
                    titleData={{
                        title: data?.title || "",
                        content: data?.content || "",
                    }}
                    onUpdated={onChapterCreated}
                />
            )}

            {recordPopup && (
                <TableRecordsPopup
                    open={recordPopup}
                    onClose={setRecordPopup}
                    tableField={recordData?.tableField}
                    taskId={recordData?.taskId}
                    onCreated={onChapterCreated}
                />
            )}









        </>
    )

}

export default View;
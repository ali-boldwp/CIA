
import { useState, useEffect } from "react";
import Header from "../../../../../CategoryView/Components/Header";
import AddButton from "../Component/AddButton/AddButton";
import CategoryViewform from "../Component/TaskViewFoam/TaskViewFoam";
import { useParams } from "react-router-dom";
import {useGetTaskTemplatesByChapterQuery} from "../../../../../../services/categoryApi";


const CategoryView = () => {
    const {id:chapterId}=useParams()

    const { data: taskData } =
        useGetTaskTemplatesByChapterQuery(chapterId, {
            skip: !chapterId
        });

    const task = taskData?.data || {};
    const [tasks, setTasks] = useState([]);

    /* ✅ LOAD CHAPTERS FROM BACKEND */
    useEffect(() => {
        if (taskData?.data) {
            setTasks(
                taskData.data.map(ch => ({
                    uid: ch._id,          // backend id
                    name: ch.name,
                    content: ch.content || "",
                    isCreated: true
                }))
            );
        }
    }, [taskData]);

    /* ➕ ADD NEW CHAPTER */
    const addNewChapter = () => {
        setTasks(prev => [
            ...prev,
            {
                uid: `temp-${Date.now()}`, // temp id
                name: "",
                content: "",
                isCreated: false
            }
        ]);
    };

    /* ✏️ UPDATE CHAPTER */
    const updateChapter = (uid, changes) => {
        setTasks(prev =>
            prev.map(ch =>
                ch.uid === uid ? { ...ch, ...changes } : ch
            )
        );
    };

    /* 🔁 REPLACE TEMP WITH REAL ID */
    const replaceChapterId = (tempUid, realId) => {
        taskData(prev =>
            prev.map(ch =>
                ch.uid === tempUid
                    ? { ...ch, uid: realId, isCreated: true }
                    : ch
            )
        );
    };

    return (
        <div className="CategoryView">
            <Header />

            {tasks.map(task => (
                <CategoryViewform
                    key={task.uid}
                    task={task}
                    chapterId={chapterId}
                    onUpdate={updateChapter}
                    onCreated={replaceChapterId}
                />
            ))}

            <AddButton onAdd={addNewChapter} />
        </div>
    );
};

export default CategoryView;

import "./CategoryView.css";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import AddButton from "./Components/AddButton/AddButton";
import CategoryViewform from "./Components/CategoryViewform/CategoryViewform";
import { useParams } from "react-router-dom";
import {
    useGetCategoryByIdQuery,
    useGetChapterTemplatesByCategoryQuery
} from "../../services/categoryApi";

const CategoryView = () => {
    const { id: categoryId } = useParams();

    const { data: categoryData } = useGetCategoryByIdQuery(categoryId, {
        skip: !categoryId
    });

    const { data: chapterData } =
        useGetChapterTemplatesByCategoryQuery(categoryId, {
            skip: !categoryId
        });

    const category = categoryData?.data || {};
    const [chapters, setChapters] = useState([]);

    /* ✅ LOAD CHAPTERS FROM BACKEND */
    useEffect(() => {
        if (chapterData?.data) {
            setChapters(
                chapterData.data.map(ch => ({
                    uid: ch._id,          // backend id
                    name: ch.name,
                    content: ch.content || "",
                    isCreated: true
                }))
            );
        }
    }, [chapterData]);

    /* ➕ ADD NEW CHAPTER */
    const addNewChapter = () => {
        setChapters(prev => [
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
        setChapters(prev =>
            prev.map(ch =>
                ch.uid === uid ? { ...ch, ...changes } : ch
            )
        );
    };

    /* 🔁 REPLACE TEMP WITH REAL ID */
    const replaceChapterId = (tempUid, realId) => {
        setChapters(prev =>
            prev.map(ch =>
                ch.uid === tempUid
                    ? { ...ch, uid: realId, isCreated: true }
                    : ch
            )
        );
    };

    return (
        <div className="CategoryView">
            <Header category={category} />

            {chapters.map(chapter => (
                <CategoryViewform
                    key={chapter.uid}
                    chapter={chapter}
                    categoryId={categoryId}
                    onUpdate={updateChapter}
                    onCreated={replaceChapterId}
                />
            ))}

            <AddButton onAdd={addNewChapter} />
        </div>
    );
};

export default CategoryView;

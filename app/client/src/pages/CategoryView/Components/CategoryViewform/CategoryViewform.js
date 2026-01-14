import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useCreateChapterTemplateMutation,useUpdateChapterTemplateMutation } from "../../../../services/categoryApi";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CategoryViewform = ({ chapter, categoryId, onUpdate, onCreated }) => {
    const [updateChapterTemplate] = useUpdateChapterTemplateMutation();

    const editor = useRef(null);
    const navigate = useNavigate();

    const [createChapterTemplate] = useCreateChapterTemplateMutation();

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut inițial",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    // 🔹 CREATE ON BLUR
    const handleTitleBlur = async () => {
        if (!chapter.name.trim() || chapter.isCreated) return;

        try {
            const res = await createChapterTemplate({
                name: chapter.name,
                content: chapter.content || "",
                category: categoryId
            }).unwrap();

            const realId = res?.data?._id;

            // 🔑 UPDATE PARENT (SOURCE OF TRUTH)
            onCreated(chapter.uid, realId);

            toast.success("Capitol creat cu succes ");
        } catch {
            toast.error("Operația a eșuat ");
        }
    };

    // 🔹 SETTINGS CLICK (ALWAYS WORKS)
    const handleSettingsClick = () => {
        if (!chapter.isCreated) return;
        navigate(`/categories/chapter/${chapter.uid}`);
    };

    const handleUpdate = async (payload) => {
        if (!chapter.isCreated) return;

        try {
            await updateChapterTemplate({
                id: chapter.uid,
                data: {
                    ...payload,
                    category: categoryId
                }
            }).unwrap();

            toast.success("Capitol actualizat cu succes");
        } catch {
            toast.error("Actualizarea a eșuat");
        }
    };

    return (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele capitolului"
                    className="input"
                    value={chapter.name}
                    onChange={(e) =>
                        onUpdate(chapter.uid, { name: e.target.value })
                    }
                    onBlur={() =>
                        chapter.isCreated
                            ? handleUpdate({ name: chapter.name })
                            : handleTitleBlur()
                    }
                />


                <IoMdSettings
                    onClick={handleSettingsClick}
                    style={{
                        position: "absolute",
                        top: "10px",
                        fontSize: "13pt",
                        cursor: chapter.isCreated ? "pointer" : "not-allowed",
                        right: "7px",
                    }}
                />


                <JoditEditor
                    ref={editor}
                    value={chapter.content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => {
                        onUpdate(chapter.uid, { content: newContent });
                        handleUpdate({ content: newContent }); // ✅ REAL CONTENT
                    }}
                />


            </div>
        </div>
    );
};

export default CategoryViewform;

import React, { useState, useRef, useMemo, useCallback } from "react";
import JoditEditor from "jodit-react";
import { useCreateChapterTemplateMutation } from "../../../../services/categoryApi";
import {toast} from "react-toastify";

const CategoryViewform = () => {
    const editor = useRef(null);

    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [isCreated, setIsCreated] = useState(false);

    const [createChapterTemplate] = useCreateChapterTemplateMutation();

    // ===== JODIT CONFIG =====
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Start typing...",
            buttons: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "font",
                "fontsize",
                "brush",
                "|",
                "image",
                "link",
                "|",
                "align",
                "undo",
                "redo",
            ],
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    // ===== CREATE ON BLUR =====
    const tryCreateChapter = async () => {
        if (!name.trim() || !content.trim() || isCreated) return;

        try {
            await createChapterTemplate({
                name,
                content,
            }).unwrap();

            setIsCreated(true); // prevent duplicate calls
            toast.success("Capitol creat cu succes ✅");
        } catch (error) {
            toast.error("Crearea a eșuat ❌", error);
        }
    };

    // ===== HANDLERS =====
    const handleTitleBlur = () => {
        tryCreateChapter();
    };

    const handleEditorBlur = (newContent) => {
        setContent(newContent);
        tryCreateChapter();
    };

    return (
        <div className="form-box">
            <input
                type="text"
                placeholder="Numele capitolului"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleTitleBlur}
            />

            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={handleEditorBlur}
            />
        </div>
    );
};

export default CategoryViewform;

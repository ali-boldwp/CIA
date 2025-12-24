import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useCreateChapterTemplateMutation } from "../../../../services/categoryApi";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";

const CategoryViewform = () => {
    const editor = useRef(null);

    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [isCreated, setIsCreated] = useState(false);

    const [createChapterTemplate] = useCreateChapterTemplateMutation();

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Start typing...",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    // ===== CREATE ON NAME BLUR ONLY =====
    const handleTitleBlur = async () => {
        if (!name.trim() || isCreated) return;

        try {
            await createChapterTemplate({
                name,
                content: content || "", // empty allowed
            }).unwrap();

            setIsCreated(true);
            toast.success("Capitol creat cu succes ✅");
        } catch (error) {
            toast.error("Crearea a eșuat ❌");
        }
    };

    return (
        <div className="form-box">
            <div style={{position:"relative"}}>
            <input
                type="text"
                placeholder="Numele capitolului"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleTitleBlur}
            />
                <IoMdSettings style={{position:"absolute",top:"10px",fontSize:"13pt",cursor:"pointer",right:"7px"}} />
            </div>
            {/* Editor OPTIONAL */}
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
            />
        </div>
    );
};

export default CategoryViewform;

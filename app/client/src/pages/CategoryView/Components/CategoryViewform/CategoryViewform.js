import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useCreateChapterTemplateMutation } from "../../../../services/categoryApi";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CategoryViewform = () => {
    const editor = useRef(null);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [isCreated, setIsCreated] = useState(false);
    const [chapterId, setChapterId] = useState(null);

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

    // ===== CREATE CHAPTER ON BLUR =====
    const handleTitleBlur = async () => {
        if (!name.trim() || isCreated) return;

        try {
            const res = await createChapterTemplate({
                name,
                content: content || "",
            }).unwrap();

            const id = res?.data?._id; // 👈 backend id
            setChapterId(id);
            setIsCreated(true);

            toast.success("Capitol creat cu succes ✅");
        } catch (error) {
            toast.error("Crearea a eșuat ❌");
        }
    };

    // ===== SETTINGS CLICK =====
    const handleSettingsClick = () => {
        if (!chapterId) return;
        navigate(`/categories/chapter/${chapterId}`);
    };

    return (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele capitolului"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleTitleBlur}
                />

                <IoMdSettings
                    onClick={handleSettingsClick}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "7px",
                        fontSize: "13pt",
                        cursor: chapterId ? "pointer" : "not-allowed",
                        opacity: chapterId ? 1 : 0.4,
                    }}
                />
            </div>

            {/* OPTIONAL EDITOR */}
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

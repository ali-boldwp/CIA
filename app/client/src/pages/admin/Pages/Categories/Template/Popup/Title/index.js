import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { useUpdateCategoryMutation } from "../../../../../../../services/categoryApi";

const Title = ({ open, onClose, categoryId, titleData, onUpdated }) => {
    const editor = useRef(null);

    const [title, setTitle] = useState(titleData?.title || "");
    const [content, setContent] = useState(titleData?.content || "");
    const [loading, setLoading] = useState(false);

    const [updateCategory] = useUpdateCategoryMutation();

    useEffect(() => {
        setTitle(titleData?.title || "");
        setContent(titleData?.content || "");
    }, [titleData, open]);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut titlu",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Titlul este obligatoriu");
            return;
        }

        if (!categoryId) {
            toast.error("Category ID missing");
            return;
        }

        setLoading(true);

        try {
            await toast.promise(
                updateCategory({
                    id: categoryId,
                    title: title.trim(),
                    content: content || "",
                }).unwrap(),
                {
                    pending: "Se salvează...",
                    success: "Titlu actualizat cu succes",
                    error: "Actualizarea a eșuat",
                }
            );

            if (typeof onUpdated === "function") onUpdated();
            onClose(false);
        } catch (e) {
            console.error("Title update error:", e);
        } finally {
            setLoading(false);
        }
    };

    const contentUI = (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Titlu"
                    className={`input ${styles.titleInput}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className={styles.editorWrap}>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                    />
                </div>
            </div>
        </div>
    );

    const footerUI = (
        <div className={styles.footerRow}>
            <button
                className={styles.addBtn}
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
            >
                {loading ? "Se salvează..." : "Salvează"}
            </button>

            <button
                className={styles.cancelBtn}
                onClick={() => onClose(false)}
                disabled={loading}
            >
                Anulează
            </button>
        </div>
    );

    return (
        <Popup
            open={open}
            header="Actualizează titlul"
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default Title;

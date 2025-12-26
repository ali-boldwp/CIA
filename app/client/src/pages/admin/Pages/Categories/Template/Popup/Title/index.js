import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import { toast } from "react-toastify";

/**
 * Props:
 * open: boolean
 * onClose: (false) => void
 * titleData: { title?: string, content?: string } (optional)
 * onSave: ({ title, content }) => void  // parent will handle state update for now
 */
const Title = ({ open, onClose, titleData, onSave }) => {
    const editor = useRef(null);

    const [title, setTitle] = useState(titleData?.title || "");
    const [content, setContent] = useState(titleData?.content || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle(titleData?.title || "");
        setContent(titleData?.content || "");
    }, [titleData, open]);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Write title content...",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error("Title is required");

        setLoading(true);
        try {
            // ✅ backend integration skipped for now
            if (typeof onSave === "function") {
                onSave({
                    title: title.trim(),
                    content: content || "",
                });
            }

            toast.success("Title updated (local)");
            onClose(false);
        } catch (e) {
            console.error("Title submit error:", e);
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    const contentUI = (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Conținut titlu"
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
            header={"Actualizează titlul"}
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default Title;

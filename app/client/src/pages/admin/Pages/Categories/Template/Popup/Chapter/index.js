import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import {
    useCreateChapterTemplateMutation,
    useUpdateChapterTemplateMutation
} from "../../../../../../../services/categoryApi";

import { toast } from "react-toastify";

const Chapter = ({ open, onClose, categoryId, chapter, onCreated }) => {

    const editor = useRef(null);


    const [name, setName] = useState(chapter?.name || "");
    const [content, setContent] = useState(chapter?.content || "");


    const isEdit = Boolean(chapter?.uid);
    const [loading, setLoading] = useState(false);

    const [createChapterTemplate] = useCreateChapterTemplateMutation();
    const [updateChapterTemplate] = useUpdateChapterTemplateMutation();


    useEffect(() => {
        setName(chapter?.name || "");
        setContent(chapter?.content || "");
    }, [chapter, open]);


    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut inițial",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true
            }
        }),
        []
    );




    const handleSubmit = async () => {
        if (!name.trim()) return;

        // ✅ guard
        if (!categoryId) {
            console.error("❌ categoryId missing!", { categoryId });
            toast.error("Category ID missing");
            return;
        }

        const payload = {
            name: name.trim(),
            content: content || "",
            category: categoryId,
        };

        setLoading(true);

        try {
            await toast.promise(
                isEdit
                    ? updateChapterTemplate({ id: chapter.uid, data: payload }).unwrap()
                    : createChapterTemplate(payload).unwrap(),
                {
                    pending: isEdit ? "Se salvează..." : "Se adaugă...",
                    success: isEdit
                        ? "Capitol actualizat cu succes"
                        : "Capitol creat cu succes",
                    error: isEdit ? "Actualizarea a eșuat" : "Operația a eșuat",
                }
            );

            // ✅ tell parent to refetch category / chapters (if provided)
            if (typeof onCreated === "function") onCreated();

            // ✅ close popup
            onClose(false);
        } catch (e) {
            // toast.promise already shows error, but keep console for debugging
            console.error("Chapter submit error:", e);
        } finally {
            setLoading(false);
        }
    };


    const contentUI = (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele capitolului"
                    className={`input ${styles.titleInput}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                disabled={loading || !name.trim()}
            >
                {loading ? (isEdit ? "Se salvează..." : "Se adaugă...") : (isEdit ? "Salvează" : "Adaugă")}
            </button>

            <button className={styles.cancelBtn} onClick={() => onClose(false)}>
                Anulează
            </button>
        </div>
    );

    return (
        <Popup
            open={open}
            header={isEdit ? "Update Chapter" : "New Chapter"}
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default Chapter;

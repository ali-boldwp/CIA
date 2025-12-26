import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import {
    useCreateChapterTemplateMutation,
    useUpdateChapterTemplateMutation,
    useDeleteChapterTemplateMutation,
} from "../../../../../../../services/categoryApi";

import { toast } from "react-toastify";
import ConfirmDelete from "../ConfirmDelete";

const Chapter = ({ open, onClose, categoryId, chapter, onCreated }) => {
    const editor = useRef(null);

    const [name, setName] = useState(chapter?.name || "");
    const [content, setContent] = useState(chapter?.content || "");

    const isEdit = Boolean(chapter?.uid);
    const [loading, setLoading] = useState(false);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [createChapterTemplate] = useCreateChapterTemplateMutation();
    const [updateChapterTemplate] = useUpdateChapterTemplateMutation();
    const [deleteChapterTemplate] = useDeleteChapterTemplateMutation();

    useEffect(() => {
        setName(chapter?.name || "");
        setContent(chapter?.content || "");
        setConfirmDeleteOpen(false);
    }, [chapter, open]);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut inițial",
            height: 300,

            uploader: {
                insertImageAsBase64URI: true,
            },

            filebrowser: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );


    const handleSubmit = async () => {
        if (!name.trim()) return;

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

            if (typeof onCreated === "function") onCreated();
            onClose(false);
        } catch (e) {
            console.error("Chapter submit error:", e);
        } finally {
            setLoading(false);
        }
    };


    const handleConfirmDelete = async () => {
        if (!chapter?.uid) return;

        setDeleteLoading(true);
        try {
            await toast.promise(deleteChapterTemplate(chapter.uid).unwrap(), {
                pending: "Se șterge...",
                success: "Capitol șters cu succes",
                error: "Ștergerea a eșuat",
            });

            if (typeof onCreated === "function") onCreated();

            // close both
            setConfirmDeleteOpen(false);
            onClose(false);
        } catch (e) {
            console.error("Delete chapter error:", e);
        } finally {
            setDeleteLoading(false);
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
            {isEdit && (
                <button
                    className={styles.deleteBtn}
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={loading}
                >
                    Șterge
                </button>
            )}

            <div className={styles.rightBtns}>
                <button
                    className={styles.addBtn}
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                >
                    {loading
                        ? isEdit
                            ? "Se salvează..."
                            : "Se adaugă..."
                        : isEdit
                            ? "Salvează"
                            : "Salvează"}
                </button>

                <button
                    className={styles.cancelBtn}
                    onClick={() => onClose(false)}
                    disabled={loading}
                >
                    Anulează
                </button>
            </div>
        </div>

    );

    return (
        <>

            <Popup
                open={open && !confirmDeleteOpen}
                header={isEdit ? "Update Chapter" : "New Chapter"}
                content={contentUI}
                footer={footerUI}
                onClose={onClose}
            />


            {confirmDeleteOpen && (
                <ConfirmDelete
                    open={confirmDeleteOpen}
                    onClose={setConfirmDeleteOpen}
                    onConfirm={handleConfirmDelete}
                    loading={deleteLoading}
                />
            )}
        </>
    );
};

export default Chapter;

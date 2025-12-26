import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import {
    useCreateTaskTemplateMutation,
    useUpdateTaskTemplateMutation,
    useDeleteTaskTemplateMutation,
} from "../../../../../../../services/categoryApi";

import { toast } from "react-toastify";
import ConfirmDelete from "../ConfirmDelete"; // ✅ reuse same confirm popup

const Task = ({ open, onClose, chapterId, categoryId, task, onCreated }) => {
    const editor = useRef(null);

    const [name, setName] = useState(task?.name || "");
    const [content, setContent] = useState(task?.content || "");

    const isEdit = Boolean(task?.uid);
    const [loading, setLoading] = useState(false);

    // ✅ confirm delete state (same as chapter)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [createTaskTemplate] = useCreateTaskTemplateMutation();
    const [updateTaskTemplate] = useUpdateTaskTemplateMutation();
    const [deleteTaskTemplate] = useDeleteTaskTemplateMutation();

    useEffect(() => {
        setName(task?.name || "");
        setContent(task?.content || "");
        setConfirmDeleteOpen(false);
    }, [task, open]);

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

        // ✅ guards
        if (!chapterId) {
            console.error("❌ chapterId missing!", { chapterId });
            toast.error("Chapter ID missing");
            return;
        }
        if (!categoryId) {
            console.error("❌ categoryId missing!", { categoryId });
            toast.error("Category ID missing");
            return;
        }


        const payload = {
            name: name.trim(),
            content: content || "",

            chapter: chapterId,
            chapterId: chapterId,

            category: categoryId,
            categoryId: categoryId,
        };

        setLoading(true);

        try {
            await toast.promise(
                isEdit
                    ? updateTaskTemplate({ id: task.uid, data: payload }).unwrap()
                    : createTaskTemplate(payload).unwrap(),
                {
                    pending: isEdit ? "Se salvează..." : "Se adaugă...",
                    success: isEdit
                        ? "Task actualizat cu succes"
                        : "Task creat cu succes",
                    error: isEdit ? "Actualizarea a eșuat" : "Operația a eșuat",
                }
            );

            if (typeof onCreated === "function") onCreated();
            onClose(false);
        } catch (e) {
            console.error("Task submit error:", e);
            toast.error(e?.data?.message || e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const handleConfirmDelete = async () => {
        if (!task?.uid) return;

        setDeleteLoading(true);
        try {
            await toast.promise(deleteTaskTemplate(task.uid).unwrap(), {
                pending: "Se șterge...",
                success: "Task șters cu succes",
                error: "Ștergerea a eșuat",
            });

            if (typeof onCreated === "function") onCreated();

            setConfirmDeleteOpen(false);
            onClose(false);
        } catch (e) {
            console.error("Delete task error:", e);
        } finally {
            setDeleteLoading(false);
        }
    };

    const contentUI = (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele sarcinii"
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
                            : "Adaugă"}
                </button>

                <button className={styles.cancelBtn} onClick={() => onClose(false)}>
                    Anulează
                </button>
            </div>
        </div>
    );

    return (
        <>

            <Popup
                open={open && !confirmDeleteOpen}
                header={isEdit ? "Update Task" : "New Task"}
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

export default Task;

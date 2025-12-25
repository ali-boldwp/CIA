import React, { useEffect, useMemo, useRef, useState } from "react";

import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";

import JoditEditor from "jodit-react";
import {
    useCreateTaskTemplateMutation,
    useUpdateTaskTemplateMutation,
} from "../../../../../../../services/categoryApi";

import { toast } from "react-toastify";

const Task = ({ open, onClose, chapterId, categoryId, task, onCreated }) => {
    const editor = useRef(null);

    const [name, setName] = useState(task?.name || "");
    const [content, setContent] = useState(task?.content || "");

    const isEdit = Boolean(task?.uid); // uid = existing task id
    const [loading, setLoading] = useState(false);

    const [createTaskTemplate] = useCreateTaskTemplateMutation();
    const [updateTaskTemplate] = useUpdateTaskTemplateMutation();

    useEffect(() => {
        setName(task?.name || "");
        setContent(task?.content || "");
    }, [task, open]);

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

        // ✅ payload (send both variants to avoid backend mismatch)
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
                    success: isEdit ? "Task actualizat cu succes" : "Task creat cu succes",
                    error: isEdit ? "Actualizarea a eșuat" : "Operația a eșuat",
                }
            );

            // ✅ simplest + safest: refetch after create/update
            if (typeof onCreated === "function") onCreated();

            onClose(false);
        } catch (e) {
            console.error("Task submit error:", e);
            toast.error(e?.data?.message || e?.message || "Something went wrong");
        } finally {
            setLoading(false);
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
            <button
                className={styles.addBtn}
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
            >
                {loading ? (isEdit ? "Se salvează..." : "Se adaugă...") : isEdit ? "Salvează" : "Adaugă"}
            </button>

            <button className={styles.cancelBtn} onClick={() => onClose(false)}>
                Anulează
            </button>
        </div>
    );

    return (
        <Popup
            open={open}
            header={isEdit ? "Update Task" : "New Task"}
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default Task;

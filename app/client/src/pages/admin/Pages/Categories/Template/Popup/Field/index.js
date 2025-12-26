import React, { useEffect, useState } from "react";
import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";
import { toast } from "react-toastify";

import {
    useCreateFormFieldsMutation,
    useUpdateFormFieldMutation,
} from "../../../../../../../services/categoryApi";

const INPUT_TYPES = [
    "text","number","email","password","textarea","information",
    "select","checkbox","radio","date","file","url"
];

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

const Field = ({ open, onClose, chapterId, taskId, field, onCreated }) => {
    const isEdit = Boolean(field?.uid);

    const [name, setName] = useState(field?.name || "");
    const [slug, setSlug] = useState(field?.slug || "");
    const [type, setType] = useState(field?.type || "text");
    const [isSlugTouched, setIsSlugTouched] = useState(false);
    const [loading, setLoading] = useState(false);

    const [createField] = useCreateFormFieldsMutation();
    const [updateField] = useUpdateFormFieldMutation();

    useEffect(() => {
        setName(field?.name || "");
        setSlug(field?.slug || "");
        setType(field?.type || "text");
        setIsSlugTouched(false);
    }, [field, open]);

    const handleNameChange = (val) => {
        setName(val);
        if (!isSlugTouched) setSlug(slugify(val));
    };

    const handleSubmit = async () => {
        if (!name.trim() || !slug.trim()) return;

        // ✅ guards
        if (!chapterId) return toast.error("Chapter ID missing");
        if (!taskId) return toast.error("Task ID missing");

        const payload = {
            name: name.trim(),
            slug: slug.trim(),
            type,
            chapter: chapterId,
            task: taskId,
        };

        setLoading(true);

        try {
            await toast.promise(
                isEdit
                    ? updateField({ id: field.uid, data: payload }).unwrap()
                    : createField(payload).unwrap(),
                {
                    pending: isEdit ? "Se salvează..." : "Se adaugă...",
                    success: isEdit ? "Field updated successfully" : "Field created successfully",
                    error: isEdit ? "Update failed" : "Create failed",
                }
            );

            if (typeof onCreated === "function") onCreated();
            onClose(false);
        } catch (e) {
            console.error("Field submit error:", e);
        } finally {
            setLoading(false);
        }
    };

    const contentUI = (
        <div className="form-box">
            <div className={styles.formGrid}>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>Nume câmp</label>
                    <input
                        className={`input ${styles.input}`}
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ex: Adresă IP"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.fieldRow}>
                    <label className={styles.label}>Slug</label>
                    <input
                        className={`input ${styles.input}`}
                        value={slug}
                        onChange={(e) => {
                            setIsSlugTouched(true);
                            setSlug(e.target.value);
                        }}
                        placeholder="ex: adresa-ip"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.fieldRow}>
                    <label className={styles.label}>Tip câmp</label>
                    <select
                        className={`input ${styles.input}`}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {INPUT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const footerUI = (
        <div className={styles.footerRow}>
            <button
                className={styles.addBtn}
                onClick={handleSubmit}
                disabled={loading || !name.trim() || !slug.trim()}
            >
                {loading ? (isEdit ? "Se salvează..." : "Se adaugă...") : (isEdit ? "Salvează" : "Adaugă")}
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
            header={isEdit ? "Update Field" : "New Field"}
            content={contentUI}
            footer={footerUI}
            onClose={onClose}
        />
    );
};

export default Field;

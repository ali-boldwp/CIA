import React, { useEffect, useState } from "react";
import Popup from "../../../../../../Components/Popup";
import styles from "./style.module.css";
import { toast } from "react-toastify";

import ConfirmDelete from "../ConfirmDelete";


import {
    useAddTableColumnMutation,
    useUpdateTableColumnMutation,
    useDeleteTableColumnMutation,
} from "../../../../../../../services/formFieldsApi";


// ✅ SAME TYPES AS FIELD
const COLUMN_TYPES = [
    "text",
    "number",
    "email",
    "password",
    "textarea",
    "table",
    "information",
    "select",
    "checkbox",
    "radio",
    "date",
    "file",
    "url",
];

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

const Table = ({ open, onClose, chapterId, taskId, tableField, column, onCreated }) => {
    const isEdit = Boolean(column?.uid);

    const [name, setName] = useState(column?.name || "");
    const [slug, setSlug] = useState(column?.slug || "");
    const [type, setType] = useState(column?.type || "text");
    const [isSlugTouched, setIsSlugTouched] = useState(false);
    const [loading, setLoading] = useState(false);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const [addColumn] = useAddTableColumnMutation();
    const [updateColumn] = useUpdateTableColumnMutation();
    const [deleteColumn] = useDeleteTableColumnMutation();


    useEffect(() => {
        setName(column?.name || "");
        setSlug(column?.slug || "");
        setType(column?.type || "text");
        setIsSlugTouched(false);
        setConfirmDeleteOpen(false);
    }, [open, column]);

    const handleNameChange = (val) => {
        setName(val);
        if (!isSlugTouched) setSlug(slugify(val));
    };

    const handleSubmit = async () => {
        if (!name.trim() || !slug.trim()) return;

        if (!tableField?._id) return toast.error("Table field missing");

        const fieldId = tableField._id;

        const payload = {
            name: name.trim(),
            slug: slug.trim(),
            type,
        };

        setLoading(true);

        try {
            await toast.promise(
                isEdit
                    ? updateColumn({ fieldId, columnId: column.uid, data: payload }).unwrap()
                    : addColumn({ fieldId, data: payload }).unwrap(),
                {
                    pending: isEdit ? "Se salvează..." : "Se adaugă...",
                    success: isEdit ? "Coloană actualizată cu succes" : "Coloană creată cu succes",
                    error: isEdit ? "Actualizarea a eșuat" : "Operația a eșuat",
                }
            );

            if (typeof onCreated === "function") onCreated();
            onClose(false);
        } catch (err) {
            toast.error(err?.data?.message || "Operația a eșuat");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!column?.uid) return;
        if (!tableField?._id) return toast.error("Table field missing");

        const fieldId = tableField._id;

        setDeleteLoading(true);
        try {
            await toast.promise(
                deleteColumn({ fieldId, columnId: column.uid }).unwrap(),
                {
                    pending: "Se șterge...",
                    success: "Coloană ștearsă cu succes",
                    error: "Ștergerea a eșuat",
                }
            );

            if (typeof onCreated === "function") onCreated();
            setConfirmDeleteOpen(false);
            onClose(false);
        } catch (e) {
            console.error("Delete column error:", e);
        } finally {
            setDeleteLoading(false);
        }
    };


    const contentUI = (
        <div className="form-box">
            <div className={styles.formGrid}>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>Nume coloană</label>
                    <input
                        className={`input ${styles.input}`}
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ex: Număr serie"
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
                        placeholder="ex: numar-serie"
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
                        {COLUMN_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
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
                    disabled={loading || !name.trim() || !slug.trim()}
                >
                    {loading
                        ? isEdit
                            ? "Se salvează..."
                            : "Se adaugă..."
                        : isEdit
                            ? "Salvează"
                            : "Adaugă"}
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
                header={isEdit ? "Actualizează coloană" : "Coloană nouă"}
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

export default Table;

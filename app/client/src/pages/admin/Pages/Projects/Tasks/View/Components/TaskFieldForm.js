
import styles from "./TaskFieldForm.module.css";
import { useGetFoamFieldsByTaskIdQuery } from "../../../../../../../services/formFieldsApi";
import React, { useEffect, useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const TaskFieldForm = ({ taskId, taskData, formValues, setFormValues }) => {

    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    useEffect(() => {
        if (data?.data?.length) {
            const initialValues = {};

            data.data.forEach(field => {
                // 🔑 AGAR TASK ME DATA HAI → USE IT
                initialValues[field.slug] =
                    taskData?.[field.slug] || "";
            });

            setFormValues(initialValues);
        }
    }, [data, taskData, setFormValues]);

    const handleChange = (slug, value) => {
        setFormValues(prev => ({
            ...prev,
            [slug]: value,
        }));
    };

    const editor = useRef(null);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut inițial",
            height: 300,

            uploader: {
                insertImageAsBase64URI: true,
            },

            // ✅ IMAGE SETTINGS
            imageDefaultWidth: 500,          // default width
            imageDefaultAlign: "center",

            // allow resize handles
            allowResizeX: true,
            allowResizeY: true,

            // ✅ FORCE MAX WIDTH
            style: {
                maxWidth: "100%",
            },

            // toolbar buttons
            buttons: [
                "bold", "italic", "underline",
                "|",
                "ul", "ol",
                "|",
                "image", "link",
                "|",
                "align", "undo", "redo"
            ],
        }),
        []
    );



    if (isLoading) return <p>Loading...</p>;

    return (
        <div className={styles.taskFieldForm}>
            {data?.data?.map(field => (
                <div key={field._id} className={styles.formField}>
                    <label>{field.name}</label>

                    {/* 🔹 INFORMATION → JODIT EDITOR */}
                    {field.type === "information" && (
                        <JoditEditor
                            ref={editor}
                            value={formValues[field.slug] || ""}
                            config={config}
                            onBlur={(newContent) =>
                                handleChange(field.slug, newContent)
                            }
                        />
                    )}

                    {/* 🔹 TEXTAREA */}
                    {field.type === "textarea" && (
                        <textarea
                            value={formValues[field.slug] || ""}
                            onChange={e =>
                                handleChange(field.slug, e.target.value)
                            }
                        />
                    )}

                    {/* 🔹 OTHER INPUT TYPES */}
                    {field.type !== "textarea" &&
                        field.type !== "information" && (
                            <input
                                type={field.type}
                                value={formValues[field.slug] || ""}
                                onChange={e =>
                                    handleChange(field.slug, e.target.value)
                                }
                            />
                        )}
                </div>
            ))}
        </div>
    );
};
export default TaskFieldForm

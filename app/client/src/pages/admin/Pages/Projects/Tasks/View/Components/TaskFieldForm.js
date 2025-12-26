
import styles from "./TaskFieldForm.module.css";
import { useGetFoamFieldsByTaskIdQuery } from "../../../../../../../services/formFieldsApi";
import React, { useEffect, useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const TaskFieldForm = ({ taskId, formValues, setFormValues }) => {

    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    useEffect(() => {
        if (data?.data?.length) {
            const initialValues = {};
            data.data.forEach(field => {
                initialValues[field.slug] = "";
            });
            setFormValues(initialValues);
        }
    }, [data, setFormValues]);

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
            placeholder: "Information likhein...",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
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

import React, { useEffect, useState } from "react";
import styles from "./TaskFieldForm.module.css";
import { useGetFoamFieldsByTaskIdQuery } from "../../../../../../../services/formFieldsApi";
import { useParams } from "react-router-dom";

const TaskFieldForm = ({taskId}) => {

    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (data?.data?.length) {
            const initialValues = {};
            data.data.forEach(field => {
                initialValues[field.slug] = "";
            });
            setFormValues(initialValues);
        }
    }, [data]);

    const handleChange = (slug, value) => {
        setFormValues(prev => ({
            ...prev,
            [slug]: value,
        }));
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className={styles.taskFieldForm}>
            {data?.data?.map(field => (
                <div key={field._id} className={styles.formField}>
                    <label>{field.name}</label>

                    {field.type === "textarea" ? (
                        <textarea
                            value={formValues[field.slug] || ""}
                            onChange={e =>
                                handleChange(field.slug, e.target.value)
                            }
                        />
                    ) : (
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

export default TaskFieldForm;

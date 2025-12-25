import React, { useEffect, useState } from "react";
import "./TaskFieldForm.css";
import {useGetFoamFieldsByTaskIdQuery} from "../../../../../../../services/formFieldsApi";
import {useParams} from "react-router-dom";

const TaskFieldForm = () => {
    const {taskId}=useParams()
    const { data, isLoading } = useGetFoamFieldsByTaskIdQuery(taskId, {
        skip: !taskId,
    });

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [type, setType] = useState("text");

    // 🔥 AUTO FILL FORM
    useEffect(() => {
        if (data?.data?.length) {
            const field = data.data[0]; // example: first field
            setName(field.name || "");
            setSlug(field.slug || "");
            setType(field.type || "text");
        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="task-field-form">
            <div className="form-field">
                <label>Nume câmp</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-field">
                <label>Slug</label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
            </div>

            <div className="form-field">
                <label>Tip câmp</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="textarea">textarea</option>
                </select>
            </div>
        </div>
    );
};

export default TaskFieldForm;

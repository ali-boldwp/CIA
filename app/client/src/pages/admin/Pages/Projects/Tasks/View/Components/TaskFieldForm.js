import React, { useState } from "react";
import "./TaskFieldForm.css";
import styles from "../../../../Categories/List/Popup/style.module.css";

const TaskFieldForm = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [type, setType] = useState("text");

    const handleReset = () => {
        setName("");
        setSlug("");
        setType("text");
    };

    const handleSubmit = () => {
        if (!name.trim() || !slug.trim()) return;

        onSubmit?.({
            name: name.trim(),
            slug: slug.trim(),
            type
        });

        handleReset();
    };

    return (
        <div className="task-field-form">

            <div className="form-field">
                <label>Nume câmp</label>
                <input
                    type="text"
                    placeholder="Ex: Adresă IP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-field">
                <label>Slug</label>
                <input
                    type="text"
                    placeholder="ex: adresa_ip"
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

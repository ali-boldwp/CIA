// /home/ubaid/workspace/app/client/src/pages/Humint/CustumPopUp.js

import React, { useState } from "react";
import styles from "./CustumPop.module.css";

const CustumPopUp = () => {
    const [form, setForm] = useState({
        subject: "",
        entityType: "",
        deadline: "",
        priority: "",
        responsible: "",
        createProject: "",
        notifyManager: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        // remove error while typing
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.subject.trim()) newErrors.subject = "Câmp obligatoriu";
        if (!form.entityType) newErrors.entityType = "Câmp obligatoriu";
        if (!form.deadline) newErrors.deadline = "Câmp obligatoriu";
        if (!form.priority) newErrors.priority = "Câmp obligatoriu";
        if (!form.responsible) newErrors.responsible = "Câmp obligatoriu";
        if (!form.createProject) newErrors.createProject = "Câmp obligatoriu";
        if (!form.notifyManager) newErrors.notifyManager = "Câmp obligatoriu";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // yahan pe tum API call / next step kar sakte ho
        console.log("Form OK:", form);
        alert("Form valid — submit kar sakte ho (frontend validation pass).");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <h3 className={styles.title}>
                    Solicitare independentă — context minim
                </h3>
                <p className={styles.subtitle}>
                    Dacă nu există un proiect asociat, completează contextul minim
                    pentru HUMINT:
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* ROW 1 */}
                    <div className={styles.row}>
                        {/* Subiect HUMINT */}
                        <div className={styles.field}>
                            <label className={styles.label}>Subiect HUMINT</label>
                            <input
                                className={`${styles.input} ${
                                    errors.subject ? styles.inputError : ""
                                }`}
                                placeholder="ex.: Observare discretă — sediu ABC"
                                value={form.subject}
                                onChange={handleChange("subject")}
                            />
                            {errors.subject && (
                                <span className={styles.errorText}>
                                    {errors.subject}
                                </span>
                            )}
                        </div>

                        {/* Tip entitate */}
                        <div className={styles.field}>
                            <label className={styles.label}>Tip entitate</label>
                            <select
                                className={`${styles.select} ${
                                    errors.entityType ? styles.inputError : ""
                                }`}
                                value={form.entityType}
                                onChange={handleChange("entityType")}
                            >
                                <option value="">Selectează</option>
                                <option value="persoana">Persoană</option>
                                <option value="societate">Societate</option>
                                <option value="alt">Alt</option>
                            </select>
                            {errors.entityType && (
                                <span className={styles.errorText}>
                                    {errors.entityType}
                                </span>
                            )}
                        </div>

                        {/* Deadline */}
                        <div className={styles.field}>
                            <label className={styles.label}>Deadline</label>
                            <input
                                type="date"
                                className={`${styles.input} ${
                                    errors.deadline ? styles.inputError : ""
                                }`}
                                value={form.deadline}
                                onChange={handleChange("deadline")}
                            />
                            {errors.deadline && (
                                <span className={styles.errorText}>
                                    {errors.deadline}
                                </span>
                            )}
                        </div>

                        {/* Prioritate */}
                        <div className={styles.field}>
                            <label className={styles.label}>Prioritate</label>
                            <select
                                className={`${styles.select} ${
                                    errors.priority ? styles.inputError : ""
                                }`}
                                value={form.priority}
                                onChange={handleChange("priority")}
                            >
                                <option value="">Selectează</option>
                                <option value="normal">Normal</option>
                                <option value="ridicat">Ridicat</option>
                                <option value="urgent">Urgent</option>
                            </select>
                            {errors.priority && (
                                <span className={styles.errorText}>
                                    {errors.priority}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className={styles.row}>
                        {/* Responsabil */}
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label className={styles.label}>Responsabil</label>
                            <select
                                className={`${styles.select} ${
                                    errors.responsible ? styles.inputError : ""
                                }`}
                                value={form.responsible}
                                onChange={handleChange("responsible")}
                            >
                                <option value="">Alege responsabil</option>
                                <option value="analistA">Analist A</option>
                                <option value="analistB">Analist B</option>
                                <option value="analistC">Analist C</option>
                                <option value="managerX">Manager X</option>
                            </select>
                            {errors.responsible && (
                                <span className={styles.errorText}>
                                    {errors.responsible}
                                </span>
                            )}
                        </div>

                        {/* Creează proiect nou din solicitare */}
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Creează proiect nou din solicitare
                            </label>
                            <select
                                className={`${styles.select} ${
                                    errors.createProject ? styles.inputError : ""
                                }`}
                                value={form.createProject}
                                onChange={handleChange("createProject")}
                            >
                                <option value="">Selectează</option>
                                <option value="da">Da</option>
                                <option value="nu">Nu</option>
                            </select>
                            {errors.createProject && (
                                <span className={styles.errorText}>
                                    {errors.createProject}
                                </span>
                            )}
                        </div>

                        {/* Notifică manager */}
                        <div className={styles.field}>
                            <label className={styles.label}>Notifică manager</label>
                            <select
                                className={`${styles.select} ${
                                    errors.notifyManager ? styles.inputError : ""
                                }`}
                                value={form.notifyManager}
                                onChange={handleChange("notifyManager")}
                            >
                                <option value="">Selectează</option>
                                <option value="da">Da</option>
                                <option value="nu">Nu</option>
                            </select>
                            {errors.notifyManager && (
                                <span className={styles.errorText}>
                                    {errors.notifyManager}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* BUTTON ROW */}
                    <div className={styles.buttonRow}>
                        <button type="submit" className={styles.continueBtn}>
                            Continuă
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustumPopUp;

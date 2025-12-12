// /home/ubaid/workspace/app/client/src/pages/Humint/CustumPopUp.js

import React, { useState } from "react";
import styles from "./CustumPop.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


// 🔥 Fetch Analysts API
import { useGetAnalystsQuery } from "../../../services/userApi";

const CustumPopUp = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);


    // GET ANALYSTS FROM BACKEND
    const { data: AnalystData } = useGetAnalystsQuery();
    const analysts = AnalystData?.data || [];

    const [form, setForm] = useState({
        subject: "",
        reportType: "",
        deadline: "",
        priority: "",
        responsible: "",
        createProject: "",
        notifyManager: "",
        isLinkedToProject: false
    });

    const [errors, setErrors] = useState({});

    // Generic change handler
    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.subject.trim()) newErrors.subject = "Required";
        if (!form.reportType) newErrors.reportType = "Required";
        if (!form.deadline) newErrors.deadline = "Required";
        if (!form.priority) newErrors.priority = "Required";
        if (!form.responsible) newErrors.responsible = "Required";
        if (!form.createProject) newErrors.createProject = "Required";
        if (!form.notifyManager) newErrors.notifyManager = "Required";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validate();
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }

        const cleanPayload = {
            isLinkedToProject: false,
            humintSubject: form.subject,
            reportType: form.reportType,
            deadline: form.deadline,
            priority: form.priority,
            responsible: form.responsible,
            createProjectFromRequest: form.createProject === "da",
            notifyManager: form.notifyManager === "da",
        };

        setSubmitting(true);

        toast.info("Se deschide formularul HUMINT...");

        navigate("/humintRequest-Page", {
            state: { humintType: "independent", data: cleanPayload },
        });

        // navigate ke baad component unmount ho jata, but safe:
        setSubmitting(false);
    };



    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <h3 className={styles.title}>
                    Solicitare independentă — context minim
                </h3>

                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* ROW 1 */}
                    <div className={styles.row}>

                        {/* SUBJECT */}
                        <div className={styles.field}>
                            <label className={styles.label}>Subiect HUMINT</label>
                            <input
                                className={`${styles.input} ${errors.subject ? styles.inputError : ""}`}
                                value={form.subject}
                                onChange={handleChange("subject")}
                                placeholder="ex.: Observare discretă — sediu ABC"
                            />
                            {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                        </div>

                        {/* ENTITY TYPE DROPDOWN (Your list) */}
                        <div className={styles.field}>
                            <label className={styles.label}>Tip raport</label>
                            <select
                                className={`${styles.select} ${errors.reportType ? styles.inputError : ""}`}
                                value={form.reportType}
                                onChange={handleChange("reportType")}
                            >
                                <option value="">Selectează...</option>
                                <option value="Enhanced Due Diligence (Societate / Grup)">
                                    Enhanced Due Diligence (Societate / Grup)
                                </option>
                                <option value="Preliminary Due Diligence">
                                    Preliminary Due Diligence
                                </option>
                                <option value="Background Check">
                                    Background Check
                                </option>
                                <option value="Preliminary Background Check">
                                    Preliminary Background Check
                                </option>
                                <option value="Fraud Investigation">
                                    Fraud Investigation
                                </option>
                                <option value="Audit reputational">
                                    Audit reputational
                                </option>
                                <option value="Raport de informare">
                                    Raport de informare
                                </option>
                                <option value="Altele (Custom)">
                                    Altele (Custom)
                                </option>
                            </select>

                            {errors.reportType && (
                                <span className={styles.errorText}>{errors.reportType}</span>
                            )}
                        </div>

                        {/* DEADLINE */}
                        <div className={styles.field}>
                            <label className={styles.label}>Deadline</label>
                            <input
                                type="date"
                                className={`${styles.input} ${errors.deadline ? styles.inputError : ""}`}
                                value={form.deadline}
                                onChange={handleChange("deadline")}
                            />
                            {errors.deadline && <span className={styles.errorText}>{errors.deadline}</span>}
                        </div>

                        {/* PRIORITY (backend enum) */}
                        <div className={styles.field}>
                            <label className={styles.label}>Prioritate</label>
                            <select
                                className={`${styles.select} ${errors.priority ? styles.inputError : ""}`}
                                value={form.priority}
                                onChange={handleChange("priority")}
                            >
                                <option value="">Selectează...</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Confidential">Confidential</option>
                            </select>
                            {errors.priority && <span className={styles.errorText}>{errors.priority}</span>}
                        </div>

                    </div>

                    {/* ROW 2 */}
                    <div className={styles.row}>

                        {/* RESPONSIBLE (analyst dropdown) */}
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label className={styles.label}>Responsabil</label>
                            <select
                                className={`${styles.select} ${errors.responsible ? styles.inputError : ""}`}
                                value={form.responsible}
                                onChange={handleChange("responsible")}
                            >
                                <option value="">Selectează analist</option>

                                {analysts.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.name} ({a.role})
                                    </option>
                                ))}
                            </select>
                            {errors.responsible && <span className={styles.errorText}>{errors.responsible}</span>}
                        </div>

                        {/* CREATE PROJECT */}
                        <div className={styles.field}>
                            <label className={styles.label}>Creează proiect nou</label>
                            <select
                                className={`${styles.select} ${errors.createProject ? styles.inputError : ""}`}
                                value={form.createProject}
                                onChange={handleChange("createProject")}
                            >
                                <option value="">Selectează</option>
                                <option value="da">Da</option>
                                <option value="nu">Nu</option>
                            </select>
                            {errors.createProject && <span className={styles.errorText}>{errors.createProject}</span>}
                        </div>

                        {/* NOTIFY MANAGER */}
                        <div className={styles.field}>
                            <label className={styles.label}>Notifică manager</label>
                            <select
                                className={`${styles.select} ${errors.notifyManager ? styles.inputError : ""}`}
                                value={form.notifyManager}
                                onChange={handleChange("notifyManager")}
                            >
                                <option value="">Selectează</option>
                                <option value="da">Da</option>
                                <option value="nu">Nu</option>
                            </select>
                            {errors.notifyManager && <span className={styles.errorText}>{errors.notifyManager}</span>}
                        </div>

                    </div>

                    {/* SUBMIT */}
                    <div className={styles.buttonRow}>
                        <button
                            type="submit"
                            className={styles.continueBtn}
                            disabled={submitting}
                        >
                            {submitting ? "Se deschide..." : "Continuă"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CustumPopUp;

// /home/ubaid/workspace/app/client/src/pages/HumintRequestDetail/RequestDetailForm.js

import React, {
    useState,
    forwardRef,
    useImperativeHandle
} from "react";
import styles from "./RequestDetailForm.module.css";

const RequestDetailForm = forwardRef((props, ref) => {
    const [values, setValues] = useState({
        projectName: "",
        deadline: "",
        reportType: "",
        projectOwner: "",
        priority: "",
        scopeObjectives: "",
        keyQuestions: "",
        targets: "",
        locations: "",
        restrictions: "",
        managerFeedback: "", // ✅ new optional field
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        // ✅ saare required fields yahan list karo
        const requiredFields = [
            "projectName",
            "deadline",
            "reportType",
            "projectOwner",
            "priority",
            "scopeObjectives",
            "keyQuestions",
            "targets",
            "locations",
            "restrictions",
            // "managerFeedback"  // optional, isliye yahaan nahi
        ];

        requiredFields.forEach((key) => {
            const value = values[key];
            if (!value || !value.trim()) {
                newErrors[key] = "Câmp obligatoriu";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitForm = () => {
        const isValid = validate();
        if (!isValid) return false;

        console.log("Manager detail form OK:", values);
        // yahan API call / submit logic aa sakta hai
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm();
    };

    useImperativeHandle(ref, () => ({
        submitForm,
        getValues: () => values,
    }));

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* CARD 1: CONTEXT */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Context</h3>

                    <div className={styles.contextGrid}>
                        {/* Denumire proiect */}
                        <div className={`${styles.field} ${styles.span2}`}>
                            <label className={styles.label}>Denumire proiect</label>
                            <div className={styles.inline}>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={values.projectName}
                                    onChange={handleChange}
                                    className={`${styles.input} ${
                                        errors.projectName ? styles.inputError : ""
                                    }`}
                                    placeholder="ex.: Due Diligence: Societatea ABC"
                                />
                            </div>
                            {errors.projectName && (
                                <p className={styles.errorText}>{errors.projectName}</p>
                            )}
                        </div>

                        {/* Tip raport */}
                        <div className={styles.field}>
                            <label className={styles.label}>Tip raport</label>
                            <div className={styles.inline}>
                                <select
                                    name="reportType"
                                    value={values.reportType}
                                    onChange={handleChange}
                                    className={`${styles.input} ${
                                        errors.reportType ? styles.inputError : ""
                                    }`}
                                >
                                    <option value="">Selectează...</option>
                                    <option value="Enhanced Due Diligence">
                                        Enhanced Due Diligence
                                    </option>
                                    <option value="Standard Due Diligence">
                                        Standard Due Diligence
                                    </option>
                                    <option value="Background Check">Background Check</option>
                                </select>
                            </div>
                            {errors.reportType && (
                                <p className={styles.errorText}>{errors.reportType}</p>
                            )}
                        </div>

                        {/* Responsabil proiect */}
                        <div className={styles.field}>
                            <label className={styles.label}>Responsabil proiect</label>
                            <div className={styles.inline}>
                                <select
                                    name="projectOwner"
                                    value={values.projectOwner}
                                    onChange={handleChange}
                                    className={`${styles.input} ${
                                        errors.projectOwner ? styles.inputError : ""
                                    }`}
                                >
                                    <option value="">Selectează...</option>
                                    <option value="Analist A">Analist A</option>
                                    <option value="Analist B">Analist B</option>
                                    <option value="Analist C">Analist C</option>
                                </select>
                            </div>
                            {errors.projectOwner && (
                                <p className={styles.errorText}>{errors.projectOwner}</p>
                            )}
                        </div>

                        {/* Deadline */}
                        <div className={styles.field}>
                            <label className={styles.label}>Deadline</label>
                            <div className={styles.inline}>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={values.deadline}
                                    onChange={handleChange}
                                    className={`${styles.input} ${
                                        errors.deadline ? styles.inputError : ""
                                    }`}
                                />
                            </div>
                            {errors.deadline && (
                                <p className={styles.errorText}>{errors.deadline}</p>
                            )}
                        </div>

                        {/* Prioritate */}
                        <div className={styles.field}>
                            <label className={styles.label}>Prioritate</label>
                            <select
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                className={`${styles.input} ${
                                    errors.priority ? styles.inputError : ""
                                }`}
                            >
                                <option value="">Selectează...</option>
                                <option value="Normal">Normal</option>
                                <option value="Ridicată">Ridicată</option>
                                <option value="Urgentă">Urgentă</option>
                            </select>
                            {errors.priority && (
                                <p className={styles.errorText}>{errors.priority}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CARD 2: BRIEF OPERATIV */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Brief operativ</h3>

                    {/* 1: full width */}
                    <div className={styles.textareaGridFull}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Ce se dorește (scop &amp; obiective)
                            </label>
                            <textarea
                                name="scopeObjectives"
                                value={values.scopeObjectives}
                                onChange={handleChange}
                                className={`${styles.textarea} ${
                                    errors.scopeObjectives ? styles.inputError : ""
                                }`}
                                placeholder="ex.: verificare discretă reputație locală, confirmare asocieri, risc comportamental..."
                            />
                            {errors.scopeObjectives && (
                                <p className={styles.errorText}>{errors.scopeObjectives}</p>
                            )}
                        </div>
                    </div>

                    {/* 2: 2 side by side */}
                    <div className={styles.textareaGridTwo}>
                        <div className={styles.field}>
                            <label className={styles.label}>Întrebări cheie (puncte)</label>
                            <textarea
                                name="keyQuestions"
                                value={values.keyQuestions}
                                onChange={handleChange}
                                className={`${styles.textarea} ${
                                    errors.keyQuestions ? styles.inputError : ""
                                }`}
                                placeholder="ex.: cine, unde, când, cu cine colaborează..."
                            />
                            {errors.keyQuestions && (
                                <p className={styles.errorText}>{errors.keyQuestions}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Ținte / persoane de interes</label>
                            <textarea
                                name="targets"
                                value={values.targets}
                                onChange={handleChange}
                                className={`${styles.textarea} ${
                                    errors.targets ? styles.inputError : ""
                                }`}
                                placeholder="ex.: Persoana A.B.; asociat C.D.; personal cheie..."
                            />
                            {errors.targets && (
                                <p className={styles.errorText}>{errors.targets}</p>
                            )}
                        </div>
                    </div>

                    {/* 3: 2 side by side */}
                    <div className={styles.textareaGridTwo}>
                        <div className={styles.field}>
                            <label className={styles.label}>Zone / locații de interes</label>
                            <textarea
                                name="locations"
                                value={values.locations}
                                onChange={handleChange}
                                className={`${styles.textarea} ${
                                    errors.locations ? styles.inputError : ""
                                }`}
                                placeholder="ex.: sediu KLM, locații ABC, cartier X..."
                            />
                            {errors.locations && (
                                <p className={styles.errorText}>{errors.locations}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Restricții &amp; no-go</label>
                            <textarea
                                name="restrictions"
                                value={values.restrictions}
                                onChange={handleChange}
                                className={`${styles.textarea} ${
                                    errors.restrictions ? styles.inputError : ""
                                }`}
                                placeholder="ex.: fără contact direct; fără înregistrări audio; fără intrare pe proprietate privată..."
                            />
                            {errors.restrictions && (
                                <p className={styles.errorText}>{errors.restrictions}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CARD 3: FEEDBACK MANAGER (opțional) */}
                <div className={styles.card}>
                    <div className={styles.sectionHeaderRow}>
                        <h3 className={styles.sectionTitle}>Feedback manager (opțional)</h3>
                        <p className={styles.sectionHint}>
                            Aici poți adăuga comentarii, clarificări sau instrucțiuni suplimentare
                            pentru analist.
                        </p>
                    </div>

                    <div className={styles.textareaGridFull}>
                        <div className={styles.field}>
                            <label className={styles.label}>Mesaj către analist</label>
                            <textarea
                                name="managerFeedback"
                                value={values.managerFeedback}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="ex.: Aș dori să pui accent pe reputația locală pentru zona industrială X. / Să clarifici și pistele secundare..."
                            />
                            {/* optional hai, isliye yahan error nahi */}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
});

export default RequestDetailForm;

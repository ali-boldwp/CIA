// RequestDetailForm.js

import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle
} from "react";
import styles from "./RequestDetailForm.module.css";

const RequestDetailForm = forwardRef(({ humint, analysts }, ref) => {

    const [values, setValues] = useState({
        projectName: "",
        deadline: "",
        reportType: "",
        projectOwner: "",
        priority: "",
        briefObjective: "",
        keyQuestions: "",
        targets: "",
        locations: "",
        restrictions: "",
        managerFeedback: "",
    });

    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);

    // 🔥 Convert backend priority → UI format
    const priorityMap = {
        Normal: "Normal",
        Urgent: "Urgentă",
        Confidential: "Confidențial",
    };

    // 🔥 Prefill when HUMINT arrives
    useEffect(() => {
        if (!humint) return;

        setValues({
            projectName:
                humint.projectId?.projectName ||
                humint.humintSubject ||
                "",

            deadline: humint.deadline ? humint.deadline.split("T")[0] : "",

            reportType:
                humint.projectId?.reportType ||
                humint.reportType ||
                "",

            projectOwner: humint.responsibleName || "",

            priority: priorityMap[humint.priority] || humint.priority || "",

            briefObjective: humint.briefObjective || "",
            keyQuestions: humint.keyQuestions || "",
            targets: humint.targets || "",
            locations: humint.locations || "",
            restrictions: humint.restrictions || "",
            managerFeedback: humint.managerFeedback || "",
        });
        if (humint.attachments && Array.isArray(humint.attachments)) {
            setFiles(humint.attachments);
        }

    }, [humint]);

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
        const requiredFields = [
            "projectName",
            "deadline",
            "reportType",
            "projectOwner",
            "priority",
            "briefObjective",
            "keyQuestions",
            "targets",
            "locations",
            "restrictions",
        ];

        requiredFields.forEach((key) => {
            if (!values[key] || !values[key].trim()) {
                newErrors[key] = "Câmp obligatoriu";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    };

    const handleDragOver = (e) => e.preventDefault();

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // // Make functions available to parent component
    useImperativeHandle(ref, () => ({
        getValues: () => {
            return values;   // ❗ no validation block
        },
        getFiles: () => files,
    }));


    return (
        <div className={styles.wrapper}>
            <form className={styles.form}>

                {/* CONTEXT */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Context</h3>

                    <div className={styles.contextGrid}>

                        {/* projectName */}
                        <div className={`${styles.field} ${styles.span2}`}>
                            <label>Denumire proiect</label>
                            <input
                                type="text"
                                name="projectName"
                                value={values.projectName}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.projectName ? styles.inputError : ""}`}
                            />
                            {errors.projectName && <p className={styles.errorText}>{errors.projectName}</p>}
                        </div>

                        {/* reportType */}
                        <div className={styles.field}>
                            <label>Tip raport</label>
                            <select
                                name="reportType"
                                value={values.reportType}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.reportType ? styles.inputError : ""}`}
                            >
                                <option value="">Selectează...</option>
                                <option value="Enhanced Due Diligence">Enhanced Due Diligence</option>
                                <option value="Enhanced Due Diligence (Societate / Grup)">Enhanced Due Diligence (Societate / Grup)</option>
                                <option value="Preliminary Due Diligence">Preliminary Due Diligence</option>
                                <option value="Background Check">Background Check</option>
                                <option value="Preliminary Background Check">Preliminary Background Check</option>
                                <option value="Fraud Investigation">Fraud Investigation</option>
                                <option value="Audit reputational">Audit reputational</option>
                                <option value="Raport de informare">Raport de informare</option>
                                <option value="Altele (Custom)">Altele (Custom)</option>
                                <option value="HUMINT">HUMINT</option>
                            </select>
                            {errors.reportType && <p className={styles.errorText}>{errors.reportType}</p>}
                        </div>

                        {/* responsible analyst */}
                        <div className={styles.field}>
                            <label>Responsabil proiect</label>
                            <select
                                name="projectOwner"
                                value={values.projectOwner}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.projectOwner ? styles.inputError : ""}`}
                            >
                                <option value="">Selectează...</option>

                                {analysts?.map((a) => (
                                    <option key={a._id} value={a.name}>
                                        {a.name}
                                    </option>
                                ))}

                            </select>
                            {errors.projectOwner && <p className={styles.errorText}>{errors.projectOwner}</p>}
                        </div>

                        {/* deadline */}
                        <div className={styles.field}>
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={values.deadline}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.deadline ? styles.inputError : ""}`}
                            />
                            {errors.deadline && <p className={styles.errorText}>{errors.deadline}</p>}
                        </div>

                        {/* priority */}
                        <div className={styles.field}>
                            <label>Prioritate</label>
                            <select
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.priority ? styles.inputError : ""}`}
                            >
                                <option value="">Selectează...</option>
                                <option value="Normal">Normal</option>
                                <option value="Urgent">Urgentă</option>
                                <option value="Confidential">Confidențial</option>
                            </select>
                            {errors.priority && <p className={styles.errorText}>{errors.priority}</p>}
                        </div>
                    </div>
                </div>

                {/* BRIEF OPERATIVE */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Brief operativ</h3>

                    <div className={styles.textareaGridFull}>
                        <div className={styles.field}>
                            <label className={styles.label}>Ce se dorește (scop & obiective)</label>
                            <textarea
                                name="briefObjective"
                                value={values.briefObjective}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.briefObjective ? styles.inputError : ""}`}
                            />
                            {errors.briefObjective && <p className={styles.errorText}>{errors.briefObjective}</p>}
                        </div>
                    </div>

                    <div className={styles.textareaGridTwo}>
                        <div className={styles.field}>
                            <label className={styles.label}>Întrebări cheie</label>
                            <textarea
                                name="keyQuestions"
                                value={values.keyQuestions}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.keyQuestions ? styles.inputError : ""}`}
                            />
                            {errors.keyQuestions && <p className={styles.errorText}>{errors.keyQuestions}</p>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Ținte / persoane interes</label>
                            <textarea
                                name="targets"
                                value={values.targets}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.targets ? styles.inputError : ""}`}
                            />
                            {errors.targets && <p className={styles.errorText}>{errors.targets}</p>}
                        </div>
                    </div>

                    <div className={styles.textareaGridTwo}>
                        <div className={styles.field}>
                            <label className={styles.label}>Zone / locații</label>
                            <textarea
                                name="locations"
                                value={values.locations}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.locations ? styles.inputError : ""}`}
                            />
                            {errors.locations && <p className={styles.errorText}>{errors.locations}</p>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Restricții</label>
                            <textarea
                                name="restrictions"
                                value={values.restrictions}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.restrictions ? styles.inputError : ""}`}
                            />
                            {errors.restrictions && <p className={styles.errorText}>{errors.restrictions}</p>}
                        </div>
                    </div>
                    <div className={styles.dropzoncard}>
                        <h3 className={styles.sectionTitle}>Fișiere atașate HUMINT</h3>

                        <div
                            className={styles.dropzone}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <p>📁 Click sau trage fișiere aici</p>
                        </div>

                        <input
                            id="fileInput"
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileUpload}
                        />

                        {files.length > 0 && (
                            <div className={styles.fileList}>
                                {files.map((file, i) => (
                                    <div key={i} className={styles.fileItem}>

                                        {/* LEFT: icon + filename */}
                                        <div className={styles.fileLeft}>
                                            <span className={styles.fileIcon}>📄</span>
                                            <span className={styles.fileName}>
            {typeof file === "string" ? file : file.originalName}
          </span>
                                        </div>

                                        {/* RIGHT: delete */}
                                        <span
                                            className={styles.deleteFile}
                                            onClick={() => removeFile(i)}
                                        >
          ✖
        </span>

                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* MANAGER FEEDBACK */}
                <div className={styles.card}>
                    <div className={styles.sectionHeaderRow}>
                        <h3 className={styles.sectionTitle}>Feedback manager (opțional)</h3>
                    </div>

                    <div className={styles.textareaGridFull}>
                        <textarea
                            name="managerFeedback"
                            value={values.managerFeedback}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="Comentariu către analist..."
                        />
                    </div>

                </div>
            </form>
        </div>
    );
});

export default RequestDetailForm;

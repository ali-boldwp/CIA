import React, { useState } from "react";
import styles from "./ProjectRequest.module.css";
import { useSelector } from "react-redux";
import { useCreateProjectMutation } from "../../../services/projectApi";

const ProjectRequest = () => {
    const user = useSelector((state) => state.auth.user);

    // FORM STATES
    const [name, setName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [position, setPosition] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [contractNumber, setContractNumber] = useState("");
    const [contractDone, setContractDone] = useState(false);

    const [annexNumber, setAnnexNumber] = useState("");
    const [annexDone, setAnnexDone] = useState(false);

    const [projectSubject, setProjectSubject] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    const [entityType, setEntityType] = useState("");
    const [deadline, setDeadline] = useState("");

    const [category, setCategory] = useState("");
    const [projectPrice, setProjectPrice] = useState("");

    const [priority, setPriority] = useState("Normal");
    const [language, setLanguage] = useState("Română");

    const [preferredAnalyst, setPreferredAnalyst] = useState("");
    const [referenceRequest, setReferenceRequest] = useState("");

    const [services, setServices] = useState(["OSINT"]);

    const [projectDescription, setProjectDescription] = useState("");
    const [internalNotes, setInternalNotes] = useState("");

    const [files, setFiles] = useState([]);

    const [createProject, { isLoading }] = useCreateProjectMutation();

    // MULTI SELECT SERVICES
    const toggleService = (name) => {
        setServices((prev) =>
            prev.includes(name)
                ? prev.filter((s) => s !== name)
                : [...prev, name]
        );
    };

    // DROPZONE HANDLER
    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    // SUBMIT
    const handleSubmit = async () => {
        if (!user?._id) return alert("User not logged in");

        const payload = {
            name,
            contactPerson,
            position,
            email,
            phone,

            contractNumber,
            contractDone,

            annexNumber,
            annexDone,

            projectSubject,
            additionalInfo,

            entityType,
            deadline,

            category,
            projectPrice,

            priority,
            deliverableLanguage: language === "Română" ? "Romanian" : "English",

            preferredAnalyst,
            selectedAnalysts: [],
            wantedServices: services,
            referenceRequest,

            projectDescription,
            internalNotes,

            files: files.map((f) => f.name),

            projectRequestedBy: user._id,
            projectCreatedBy: user._id,
            status: "requested",
        };

        try {
            const response = await createProject(payload).unwrap();
            alert("Project created successfully!");
            console.log(response);
        } catch (err) {
            console.error(err);
            alert("Error creating project");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.topBar} />

            {/* HEADER */}
            <div className={styles.headerWrapper}>
                <div className={styles.headerCard}>
                    <div className={styles.headerInner}>
                        <button className={styles.backLink}>← Înapoi la Dashboard</button>
                        <h1 className={styles.headerTitle}>Solicitare nouă de proiect</h1>
                    </div>
                </div>
            </div>

            {/* FORM CARD */}
            <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Detalii client & proiect</h2>

                        {/* --- FORM START --- */}
                        <div className={styles.sectionGrid}>

                            {/* NAME */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>Nume client
                                    <input className={styles.input}
                                           value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           placeholder="ex: Societatea ABC" />
                                </label>
                            </div>

                            {/* CONTACT PERSON */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>Persoană de contact
                                    <input className={styles.input}
                                           value={contactPerson}
                                           onChange={(e) => setContactPerson(e.target.value)} />
                                </label>
                            </div>

                            {/* POSITION */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>Funcție (optional)
                                    <input className={styles.input}
                                           value={position}
                                           onChange={(e) => setPosition(e.target.value)} />
                                </label>
                            </div>

                            {/* EMAIL */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>Email
                                    <input className={styles.input}
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)} />
                                </label>
                            </div>

                            {/* PHONE */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>Telefon
                                    <input className={styles.input}
                                           value={phone}
                                           onChange={(e) => setPhone(e.target.value)} />
                                </label>
                            </div>

                            {/* CONTRACT */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    <span className={styles.labelRow}>
                                        <span>Nr. Contract</span>
                                        <input type="checkbox"
                                               className={styles.checkboxSquare}
                                               checked={contractDone}
                                               onChange={() => setContractDone(!contractDone)} />
                                    </span>
                                    <input className={styles.input}
                                           value={contractNumber}
                                           onChange={(e) => setContractNumber(e.target.value)} />
                                </label>
                            </div>

                            {/* ANNEX */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    <span className={styles.labelRow}>
                                        <span>Nr. Anexa</span>
                                        <input type="checkbox"
                                               className={styles.checkboxSquare}
                                               checked={annexDone}
                                               onChange={() => setAnnexDone(!annexDone)} />
                                    </span>
                                    <input className={styles.input}
                                           value={annexNumber}
                                           onChange={(e) => setAnnexNumber(e.target.value)} />
                                </label>
                            </div>

                            {/* SUBJECT */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Subiect proiect
                                    <textarea className={`${styles.textarea} ${styles.textareaTall}`}
                                              value={projectSubject}
                                              onChange={(e) => setProjectSubject(e.target.value)} />
                                </label>
                            </div>

                            {/* ADDITIONAL INFO */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Alte informații
                                    <textarea className={`${styles.textarea} ${styles.textareaTall}`}
                                              value={additionalInfo}
                                              onChange={(e) => setAdditionalInfo(e.target.value)} />
                                </label>
                            </div>

                            {/* ENTITY TYPE */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Tip entitate
                                    <input className={styles.input}
                                           value={entityType}
                                           onChange={(e) => setEntityType(e.target.value)} />
                                </label>
                            </div>

                            {/* DEADLINE */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Termen limită
                                    <input type="date"
                                           className={styles.input}
                                           value={deadline}
                                           onChange={(e) => setDeadline(e.target.value)} />
                                </label>
                            </div>

                            {/* CATEGORY */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Categorie
                                    <input className={styles.input}
                                           value={category}
                                           onChange={(e) => setCategory(e.target.value)} />
                                </label>
                            </div>

                            {/* PRICE */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Preț proiect
                                    <input className={styles.input}
                                           value={projectPrice}
                                           onChange={(e) => setProjectPrice(e.target.value)} />
                                </label>
                            </div>
                        </div>

                        {/* ==== SERVICES ==== */}
                        <div className={`${styles.chipRow} ${styles.chipRowStandalone}`}>
                            <div className={styles.chipRowLabel}>Se dorește:</div>
                            <div className={styles.chipRowChips}>
                                {[
                                    "OSINT",
                                    "HUMINT",
                                    "OSINT preliminar",
                                    "Supraveghere operativă",
                                    "Supraveghere tehnică",
                                    "TCSM",
                                ].map((srv) => (
                                    <button
                                        key={srv}
                                        type="button"
                                        className={`${styles.chip} ${
                                            services.includes(srv) ? styles.chipActive : ""
                                        }`}
                                        onClick={() => toggleService(srv)}
                                    >
                                        {srv}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PROJECT DESCRIPTION */}
                        <div className={styles.fullWidthBlock}>
                            <label className={styles.label}>
                                Descriere proiect
                                <textarea
                                    className={`${styles.textarea} ${styles.largeTextarea}`}
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* INTERNAL NOTES */}
                        <div className={styles.fullWidthBlock}>
                            <label className={styles.label}>
                                Note interne
                                <textarea
                                    className={`${styles.textarea} ${styles.largeTextarea}`}
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* FILE UPLOAD */}
                        <div className={`${styles.fullWidthBlock} ${styles.fileUploadHalf}`}>
                            <label className={styles.label}>
                                Atașează fișiere
                                <div className={styles.dropZone}>
                                    <input type="file" multiple onChange={handleFileChange} />
                                    Trage aici fișierele sau fă click pentru a încărca
                                </div>
                            </label>

                            {files.map((file, idx) => (
                                <div key={idx} className={styles.fileRow}>
                                    {file.name} - {(file.size / 1024).toFixed(1)} KB
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BUTTONS */}
            <div className={styles.buttonsCard}>
                <div className={styles.actionsRow}>
                    <button
                        className={`${styles.actionBtn} ${styles.actionAdd}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Se trimite..." : "Adaugă"}
                    </button>

                    <button className={`${styles.actionBtn} ${styles.actionDraft}`}>
                        Salvează draft
                    </button>

                    <button className={`${styles.actionBtn} ${styles.actionCancel}`}>
                        Anulează
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectRequest;

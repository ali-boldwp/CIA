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
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        );
    };

    // FILE INPUT HANDLER
    const handleFileChange = (e) => {
        setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    };

    const handleSubmit = async () => {
        if (!user?._id) {
            alert("User not logged in");
            return;
        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("contactPerson", contactPerson);
        formData.append("position", position);
        formData.append("email", email);
        formData.append("phone", phone);

        formData.append("contractNumber", contractNumber);
        formData.append("contractDone", contractDone);

        formData.append("annexNumber", annexNumber);
        formData.append("annexDone", annexDone);

        formData.append("projectSubject", projectSubject);
        formData.append("additionalInfo", additionalInfo);

        formData.append("entityType", entityType);
        formData.append("deadline", deadline);

        formData.append("category", category);
        formData.append("projectPrice", projectPrice);

        formData.append("priority", priority);
        formData.append(
            "deliverableLanguage",
            language === "Română" ? "Romanian" : "English"
        );

        formData.append("preferredAnalyst", preferredAnalyst);
        formData.append("referenceRequest", referenceRequest);

        services.forEach((srv) => {
            formData.append("wantedServices", srv);
        });

        formData.append("projectDescription", projectDescription);
        formData.append("internalNotes", internalNotes);

        files.forEach((file) => {
            formData.append("files", file);
        });

        formData.append("projectRequestedBy", user._id);
        formData.append("projectCreatedBy", user._id);
        formData.append("status", "requested");

        try {
            const response = await createProject(formData).unwrap();
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
                        <button className={styles.backLink}>
                            ← Înapoi la Dashboard
                        </button>
                        <h1 className={styles.headerTitle}>Solicitare nouă de proiect</h1>
                    </div>
                </div>
            </div>

            {/* FORM CARD */}
            <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Detalii client &amp; proiect</h2>

                        <div className={styles.sectionGrid}>
                            {/* NAME */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Nume client
                                    <input
                                        className={styles.input}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="ex: Societatea ABC"
                                    />
                                </label>
                            </div>

                            {/* CONTACT PERSON */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Persoană de contact
                                    <input
                                        className={styles.input}
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* POSITION */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Funcție (optional)
                                    <input
                                        className={styles.input}
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* EMAIL */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Email
                                    <input
                                        className={styles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* PHONE */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Telefon
                                    <input
                                        className={styles.input}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* CONTRACT */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Contract</span>
                    <input
                        type="checkbox"
                        className={styles.checkboxSquare}
                        checked={contractDone}
                        onChange={() => setContractDone(!contractDone)}
                    />
                  </span>
                                    <input
                                        className={styles.input}
                                        value={contractNumber}
                                        onChange={(e) => setContractNumber(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* ANNEX */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                  <span className={styles.labelRow}>
                    <span>Nr. Anexa</span>
                    <input
                        type="checkbox"
                        className={styles.checkboxSquare}
                        checked={annexDone}
                        onChange={() => setAnnexDone(!annexDone)}
                    />
                  </span>
                                    <input
                                        className={styles.input}
                                        value={annexNumber}
                                        onChange={(e) => setAnnexNumber(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* SUBJECT */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Subiect proiect
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        value={projectSubject}
                                        onChange={(e) => setProjectSubject(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* ADDITIONAL INFO */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Alte informații
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* ENTITY TYPE */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Tip entitate
                                    <input
                                        className={styles.input}
                                        value={entityType}
                                        onChange={(e) => setEntityType(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* DEADLINE */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Termen limită
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* CATEGORY */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <label className={styles.label}>
                                    Categorie
                                    <input
                                        className={styles.input}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* PRICE */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Preț proiect
                                    <input
                                        className={styles.input}
                                        value={projectPrice}
                                        onChange={(e) => setProjectPrice(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* PRIORITY */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>Prioritate</div>
                                    <div className={styles.chipRowChips}>
                                        {["Normal", "Urgent", "Confidențial", "Bench Task"].map(
                                            (p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    className={`${styles.chip} ${
                                                        priority === p ? styles.chipActive : ""
                                                    }`}
                                                    onClick={() => setPriority(p)}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* PREFERRED ANALYST */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Preferința analist implicat în proiect
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        value={preferredAnalyst}
                                        onChange={(e) => setPreferredAnalyst(e.target.value)}
                                    >
                                        <option value="">Selectează analist -</option>
                                        <option value="Analist A">Analist A</option>
                                        <option value="Analist B">Analist B</option>
                                        <option value="Analist C">Analist C</option>
                                        <option value="Analist D">Analist D</option>
                                        <option value="Analist E">Analist E</option>
                                        <option value="Analist F">Analist F</option>
                                        <option value="Analist G">Analist G</option>
                                    </select>
                                </label>
                            </div>

                            {/* LANGUAGE */}
                            <div className={`${styles.gridItem} ${styles.span2Left}`}>
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>Limba livrabilă</div>
                                    <div className={styles.chipRowChips}>
                                        {["Română", "Engleză"].map((lng) => (
                                            <button
                                                key={lng}
                                                type="button"
                                                className={`${styles.chip} ${
                                                    language === lng ? styles.chipActive : ""
                                                }`}
                                                onClick={() => setLanguage(lng)}
                                            >
                                                {lng}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* REFERENCE REQUEST */}
                            <div className={`${styles.gridItem} ${styles.span2Right}`}>
                                <label className={styles.label}>
                                    Solicitare referințe / informații suplimentare
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        value={referenceRequest}
                                        onChange={(e) => setReferenceRequest(e.target.value)}
                                    >
                                        <option value="">Selectează opțiune -</option>
                                        <option value="Referințe bancare">
                                            Referințe bancare
                                        </option>
                                        <option value="Referințe legale">Referințe legale</option>
                                        <option value="Verificare persoană de contact">
                                            Verificare persoană de contact
                                        </option>
                                        <option value="Detalii suplimentare despre companie">
                                            Detalii suplimentare despre companie
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* SERVICES */}
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
                        <div
                            className={`${styles.fullWidthBlock} ${styles.fileUploadHalf}`}
                        >
                            <label className={styles.label}>
                                Atașează fișiere (drag &amp; drop)
                                <div className={styles.dropZone}>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className={styles.hiddenFileInput}
                                    />

                                    <label
                                        htmlFor="fileUpload"
                                        className={styles.uploadButton}
                                    >
                                        <span className={styles.uploadIcon}>📎</span>
                                        <span>Încarcă fișiere</span>
                                    </label>

                                    <span className={styles.dropZoneText}>
                    sau trage aici fișierele pentru a le încărca
                  </span>
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

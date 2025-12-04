import React, { useState } from "react";
import styles from "./ProjectRequest.module.css";
import { useSelector } from "react-redux";
import {useCreateProjectMutation, useRequestProjectMutation} from "../../../services/projectApi";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {useGetAnalystsQuery} from "../../../services/userApi";

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

    const [requestProject, { isLoading }] = useRequestProjectMutation();

    const { data  } = useGetAnalystsQuery();
    const analystData=data?.data || [];
    const analyst=analystData.filter((p)=>p.role==="analyst");






    const toggleService = (name) => {
        setServices((prev) =>
            prev.includes(name)
                ? prev.filter((s) => s !== name)
                : [...prev, name]
        );
    };

    // DROPZONE HANDLER
    const handleFileChange = (e) => {
        setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    };

    // SUBMIT
    const handleSubmit = async () => {
        if (!user?._id) return alert("User not logged in");

        const formData = new FormData();

        // REQUIRED FIELDS → match backend EXACTLY
        formData.append("projectName", name);
        formData.append("projectSubject", projectSubject);
        formData.append("reportType", category);
        formData.append("entityType", entityType);
        formData.append("priority", priority);
        formData.append(
            "deliverableLanguage",
            language === "Română" ? "Romanian" : "English"
        );
        formData.append("projectDescription", projectDescription);

        // CLIENT FIELDS
        formData.append("clientName", name);
        formData.append("clientContactPerson", contactPerson);
        formData.append("clientEmail", email);
        formData.append("clientPhone", phone);
        formData.append("clientPosition", position);

        // PRICE
        formData.append("projectPrice", Number(projectPrice));
        formData.append("currency", "EUR");

        if (deadline) formData.append("deadline", deadline);

        formData.append("contractNumber", contractNumber);
        formData.append("annexNumber", annexNumber);
        formData.append("contractInfo", additionalInfo);
        formData.append("referenceRequest", referenceRequest);
        formData.append("internalNotes", internalNotes);

        // SERVICES → backend expects servicesRequested[]
        services.forEach((srv) => {
            formData.append("servicesRequested", srv);
        });

        // ANALYST FIELDS (optional)
        if (preferredAnalyst) {
            formData.append("responsibleAnalyst", preferredAnalyst);
        }

        // FILES
        files.forEach((file) => {
            formData.append("files", file);
        });

        // REQUIRED BY BACKEND
        formData.append("fromRequestId", user._id);
        formData.append("status", "requested");

        try {
            const response = await requestProject(formData).unwrap();
            toast.success("Proiect creat cu succes!");
            console.log(response);
        } catch (err) {
            console.error(err);
            toast.error("Eroare la crearea proiectului");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.topBar} />

            {/* HEADER */}
            <div className={styles.headerWrapper}>
                <div className={styles.headerCard}>
                    <div className={styles.headerInner}>
                        <Link to="/dashboard/sales" className={styles.backLink}>
                            ← Înapoi la Dashboard
                        </Link>
                        <h1 className={styles.headerTitle}>
                            Solicitare nouă de proiect
                        </h1>
                    </div>
                </div>
            </div>

            {/* FORM CARD */}
            <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            Detalii client & proiect
                        </h2>

                        {/* --- FORM START --- */}
                        <div className={styles.sectionGrid}>
                            {/* NAME */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <label className={styles.label}>
                                    Nume client
                                    <input
                                        className={styles.input}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="ex: Societatea ABC / POPESCU Ion"
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
                                        onChange={(e) =>
                                            setContactPerson(e.target.value)
                                        }
                                        placeholder="nume"
                                    />
                                </label>
                            </div>

                            {/* POSITION */}
                            <div className={styles.gridItem}>
                                <label className={styles.label}>
                                    Funcție
                                    <input
                                        className={styles.input}
                                        value={position}
                                        onChange={(e) =>
                                            setPosition(e.target.value)
                                        }
                                        placeholder="funcție"
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
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="ex: contact@client.ro"
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
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="+40 7xx xxx xxx"
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
                                            onChange={() =>
                                                setContractDone(!contractDone)
                                            }
                                        />
                                    </span>
                                    <input
                                        className={styles.input}
                                        value={contractNumber}
                                        onChange={(e) =>
                                            setContractNumber(e.target.value)
                                        }
                                        placeholder="ex: CTR-2025-014"
                                        disabled={!contractDone}
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
                                            onChange={() =>
                                                setAnnexDone(!annexDone)
                                            }
                                        />
                                    </span>
                                    <input
                                        className={styles.input}
                                        value={annexNumber}
                                        onChange={(e) =>
                                            setAnnexNumber(e.target.value)
                                        }
                                        placeholder="de făcut"
                                        disabled={!annexDone} 
                                    />
                                </label>
                            </div>

                            {/* SUBJECT */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <label className={styles.label}>
                                    Subiect proiect
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        value={projectSubject}
                                        onChange={(e) =>
                                            setProjectSubject(e.target.value)
                                        }
                                        placeholder="persoană de interes, societate/societăți (nume complet / denumire)..."
                                    />
                                </label>
                            </div>

                            {/* ADDITIONAL INFO */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Right}`}
                            >
                                <label className={styles.label}>
                                    Alte informații
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaTall}`}
                                        value={additionalInfo}
                                        onChange={(e) =>
                                            setAdditionalInfo(e.target.value)
                                        }
                                        placeholder="Alte info despre contract etc"
                                    />
                                </label>
                            </div>

                            {/* ENTITY TYPE (Dropdown) */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <label className={styles.label}>
                                    Tip entitate / caz (dropdown)
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        value={entityType}
                                        onChange={(e) =>
                                            setEntityType(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Societate (include persoane cheie)
                                        </option>
                                        <option value="Persoana">
                                            Persoana
                                        </option>
                                        <option value="ONG">ONG</option>
                                        <option value="Investigatie frauda">
                                            Investigatie frauda
                                        </option>
                                        <option value="Analiza de piata">
                                            Analiza de piata
                                        </option>
                                        <option value="Supraveghere operativa">
                                            Supraveghere operativa
                                        </option>
                                        <option value="TCSM">TCSM</option>
                                        <option value="Protectie supraveghere clandestina">
                                            Protectie supraveghere clandestina
                                        </option>
                                    </select>
                                </label>
                            </div>

                            {/* DEADLINE */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Right}`}
                            >
                                <label className={styles.label}>
                                    Termen limită
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={deadline}
                                        onChange={(e) =>
                                            setDeadline(e.target.value)
                                        }
                                    />
                                </label>
                            </div>

                            {/* CATEGORY (Dropdown) */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <label className={styles.label}>
                                    Categorie (dropdown)
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                    >
                                        <option value="" className="option-bold" >
                                            Enhanced Due Diligence
                                        </option>
                                        <option value="Enhanced Due Diligence (Societate / Grup)">
                                            Enhanced Due Diligence (Societate /
                                            Grup)
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
                                </label>
                            </div>

                            {/* PRICE */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Right}`}
                            >
                                <label className={styles.label}>
                                    Preț proiect
                                    <input
                                        className={styles.input}
                                        value={projectPrice}
                                        onChange={(e) =>
                                            setProjectPrice(e.target.value)
                                        }
                                        placeholder="ex: 3.500 EUR"
                                    />
                                </label>
                            </div>

                            {/* ===== ROW: Prioritate + Preferința analist ===== */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>
                                        Prioritate
                                    </div>
                                    <div className={styles.chipRowChips}>
                                        {[
                                            "Normal",
                                            "Urgent",
                                            "Confidențial",
                                            "Bench Task",
                                        ].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                className={`${styles.chip} ${
                                                    priority === p
                                                        ? styles.chipActive
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setPriority(p)
                                                }
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`${styles.gridItem} ${styles.span2Right}`}
                            >
                                <label className={styles.label}>
                                    Preferința analist implicat în proiect
                                    <select
                                        className={`${styles.input} ${styles.selectAnalyst}`}
                                        value={preferredAnalyst}
                                        onChange={(e) =>
                                            setPreferredAnalyst(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Selectează analist -
                                        </option>

                                        {analyst.map((a) => (
                                            <option
                                                key={a._id}
                                                value={a._id}
                                            >
                                                {a.name} — {a.role}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {/* ===== ROW: Limba livrabilă + Solicitare referințe (dropdown) ===== */}
                            <div
                                className={`${styles.gridItem} ${styles.span2Left}`}
                            >
                                <div className={styles.chipRow}>
                                    <div className={styles.chipRowLabel}>
                                        Limba livrabilă
                                    </div>
                                    <div className={styles.chipRowChips}>
                                        {["Română", "Engleză"].map((lng) => (
                                            <button
                                                key={lng}
                                                type="button"
                                                className={`${styles.chip} ${
                                                    language === lng
                                                        ? styles.chipActive
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setLanguage(lng)
                                                }
                                            >
                                                {lng}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`${styles.gridItem} ${styles.span2Right}`}
                            >
                                <label className={styles.label}>
                                    Solicitare referințe / informații
                                    suplimentare
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={referenceRequest}
                                        onChange={(e) =>
                                            setReferenceRequest(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Introdu solicitarea de referințe..."
                                    />
                                </label>
                            </div>
                        </div>

                        {/* ==== SERVICES ==== */}
                        <div
                            className={`${styles.chipRow} ${styles.chipRowStandalone}`}
                        >
                            <div className={styles.chipRowLabel}>
                                Se dorește:
                            </div>
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
                                            services.includes(srv)
                                                ? styles.chipActive
                                                : ""
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
                                    onChange={(e) =>
                                        setProjectDescription(e.target.value)
                                    }
                                    placeholder="ce se vrea, întrebările clientului, pe ce se pune accent..."
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
                                    onChange={(e) =>
                                        setInternalNotes(e.target.value)
                                    }
                                    placeholder="constrângeri, jurisdicții, termeni contractuali, preferințe livrare..."
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
                                        <span className={styles.uploadIcon}>
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={styles.uploadSvg}
                                                aria-hidden="true"
                                            >
                                                <path d="M12 16V5" />
                                                <path d="M8.5 8.5L12 5L15.5 8.5" />
                                                <path d="M5 19H19" />
                                            </svg>
                                        </span>
                                        <span>Încarcă fișiere</span>
                                    </label>

                                    <span className={styles.dropZoneText}>
                                        sau trage aici fișierele pentru a le
                                        încărca
                                    </span>
                                </div>
                            </label>

                            {files.map((file, idx) => (
                                <div key={idx} className={styles.fileRow}>
                                    <span className={styles.fileName}>
                                        {file.name}
                                    </span>
                                    <span className={styles.fileSize}>
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
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

                    <button
                        className={`${styles.actionBtn} ${styles.actionDraft}`}
                    >
                        Salvează draft
                    </button>

                    <button
                        className={`${styles.actionBtn} ${styles.actionCancel}`}
                    >
                        Anulează
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectRequest;

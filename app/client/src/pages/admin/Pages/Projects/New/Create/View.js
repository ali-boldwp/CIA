import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetAnalystsQuery} from "../../../../../../services/userApi";
import { useGetCategoriesQuery } from "../../../../../../services/categoryApi";

import styles from "./NewProjectstyle.css";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {
    useCreateProjectMutation,
    useRequestProjectMutation
} from "../../../../../../services/projectApi";

const CreateProject = ({ data, main }) => {

    const {id} = useParams();

    // API sometimes returns: { data: [...] } — so we normalize it
    const dataAnalyst = Array.isArray(data?.data) ? data.data : [];

    // Filter only analysts
    const analysts = dataAnalyst.filter((p) => p?.role === "analyst");

    // Build dropdown options
    const analystOptions = analysts.map((a) => ({
        id: String(a._id),
        name: a.name,
    }));


    // Categogies

    const { data: catRes, isLoading: catsLoading, isError: catsError } = useGetCategoriesQuery();

    const categories = Array.isArray(catRes?.data) ? catRes.data : [];
    const categoryOptions = categories.map((c) => ({
        id: String(c._id),
        name: c.name,
    }));


    // LOAD REQUEST BY ID


    const request = main?.data;

    // ============================
    // FORM STATES
    // ============================
    const [errors, setErrors] = useState({});
    const [projectName, setProjectName] = useState("");
    const [projectSubject, setProjectSubject] = useState("");
    const [reportType, setReportType] = useState("");
    const [entityType, setEntityType] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("");
    const [language, setLanguage] = useState(["Română"]);
    const [projectDescription, setProjectDescription] = useState("");

    const [clientName, setClientName] = useState("");
    const [clientPerson, setClientPerson] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientPosition, setClientPosition] = useState("");

    const [contractNo, setContractNo] = useState("");
    const [annexNo, setAnnexNo] = useState("");
    const [services, setServices] = useState("");
    const [projectPrice, setProjectPrice] = useState("");

    const [contractInfo, setContractInfo] = useState("");
    const [referenceRequest, setReferenceRequest] = useState("");
    const [internalNotes, setInternalNotes] = useState("");

    const [files, setFiles] = useState([]);

    const [respOpen, setRespOpen] = useState(false);
    const [responsible, setResponsible] = useState("");

    const [multiOpen, setMultiOpen] = useState(false);
    const [selectedAnalysts, setSelectedAnalysts] = useState([]);

    const respRef = useRef(null);
    const multiRef = useRef(null);

    // ============================
    // AUTOFILL from Request
    // ============================
    useEffect(() => {
        if (request && id) {
            const backendToUi = {
                "Normal": "Normal",
                "High": "Ridicată",
                "Urgent": "Urgentă",
                "Confidential": "Confidențial"
            };
            setProjectName(request.projectName || "");
            setProjectSubject(request.projectSubject || "");
            setReportType(request.reportType || "");
            setEntityType(request.entityType || "");
            setDeadline(request.deadline?.substring(0, 10) || "");
            setPriority(backendToUi[request.priority] || "");
            setLanguage(
                Array.isArray(request.deliverableLanguage)
                    ? request.deliverableLanguage
                    : request.deliverableLanguage
                        ? [request.deliverableLanguage]
                        : []
            );

            setProjectDescription(request.projectDescription || "");

            setClientName(request.clientName || "");
            setClientPerson(request.clientContactPerson || "");
            setClientEmail(request.clientEmail || "");
            setClientPhone(request.clientPhone || "");
            setClientPosition(request.clientPosition || "");

            setContractNo(request.contractNumber || "");
            setAnnexNo(request.annexNumber || "");
            setServices(request.servicesRequested?.join(", ") || "");
            setProjectPrice(request.projectPrice || "");

            setContractInfo(request.contractInfo || "");
            setReferenceRequest(request.referenceRequest || "");
            setInternalNotes(request.internalNotes || "");
            setFiles(request.files || []);

            setResponsible(
                request?.responsibleAnalyst?._id
                    ? String(request.responsibleAnalyst._id)
                    : ""
            );

            setSelectedAnalysts(
                Array.isArray(request.assignedAnalysts)
                    ? request.assignedAnalysts.map((a) =>
                        typeof a === "object" ? String(a._id) : String(a)
                    )
                    : []
            );
        }
    }, [request, id]);

    // ============================
    // VALIDATION
    // ============================
    const navigate = useNavigate();
    const validateForm = () => {
        let newErrors = {};

        // Email validation function
        const validateEmailFormat = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // PROJECT DETAILS
        if (!projectName.trim())
            newErrors.projectName = "Numele proiectului este obligatoriu";
        if (!projectSubject.trim())
            newErrors.projectSubject = "Subiectul proiectului este obligatoriu";
        if (!reportType.trim())
            newErrors.reportType = "Tipul raportului este obligatoriu";
        if (!entityType.trim())
            newErrors.entityType = "Tipul entității este obligatoriu";
        if (!deadline)
            newErrors.deadline = "Termenul limită este obligatoriu";
        if (!priority.trim())
            newErrors.priority = "Prioritatea este obligatorie";
        if (!Array.isArray(language) || language.length === 0)
            newErrors.language = "Limba livrabilului este obligatorie";
        if (!projectDescription.trim())
            newErrors.projectDescription =
                "Descrierea proiectului este obligatorie";

        // CLIENT INFO
        if (!clientName.trim())
            newErrors.clientName = "Numele clientului este obligatoriu";
        if (!clientPerson.trim())
            newErrors.clientPerson =
                "Persoana de contact este obligatorie";

        // EMAIL VALIDATION - Check if empty AND check format
        if (!clientEmail.trim()) {
            newErrors.clientEmail = "Emailul clientului este obligatoriu";
        } else if (!validateEmailFormat(clientEmail)) {
            newErrors.clientEmail = "Formatul emailului este incorect. Exemplu: nume@domeniu.com";
        }

        if (!clientPhone.trim())
            newErrors.clientPhone = "Telefonul clientului este obligatoriu";
        if (!clientPosition.trim())
            newErrors.clientPosition = "Funcția este obligatorie";

        // CONTRACT
        if (!contractNo.trim())
            newErrors.contractNo = "Numărul contractului este obligatoriu";
        if (!annexNo.trim())
            newErrors.annexNo = "Numărul anexei este obligatoriu";
        if (!services.trim())
            newErrors.services = "Serviciile solicitate sunt obligatorii";
        if (!projectPrice || projectPrice === "")
            newErrors.projectPrice = "Prețul proiectului este obligatoriu";

        if (!contractInfo.trim())
            newErrors.contractInfo =
                "Informațiile despre contract sunt obligatorii";
        if (!referenceRequest.trim())
            newErrors.referenceRequest = "Solicitarea de referințe este obligatorie";
        if (!internalNotes.trim())
            newErrors.internalNotes = "Notele interne sunt obligatorii";

        // RESPONSIBLE
        if (!responsible.trim())
            newErrors.responsible = "Responsabilul proiectului este obligatoriu";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // ============================
    // DROPDOWN HANDLERS
    // ============================
    const toggleAnalyst = (id) => {

        if (id === responsible) return;

        if (selectedAnalysts.includes(id)) {
            setSelectedAnalysts(selectedAnalysts.filter((a) => a !== id));
        } else {
            setSelectedAnalysts([...selectedAnalysts, id]);
        }
    };


    // ============================
    // FILE HANDLERS
    // ============================
    const handleFileUpload = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    };

    const handleDragOver = (e) => e.preventDefault();

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (respRef.current && !respRef.current.contains(e.target))
                setRespOpen(false);
            if (multiRef.current && !multiRef.current.contains(e.target))
                setMultiOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ============================
    // API MUTATIONS
    // ============================
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

    const [requestProject] = useRequestProjectMutation();

    // ============================
    // FINAL PAYLOAD
    // ============================
    const buildPayload = () => ({
        requestedId: id,
        projectName,
        projectSubject,
        reportType,
        entityType,
        priority,
        deliverableLanguage: language,
        projectDescription,

        clientName,
        clientContactPerson: clientPerson,
        clientEmail,
        clientPhone,
        clientPosition,

        contractNumber: contractNo,
        annexNumber: annexNo,
        servicesRequested: services.split(",").map((s) => s.trim()),
        projectPrice,

        contractInfo,
        referenceRequest,
        internalNotes,
        responsibleAnalyst: responsible,
        assignedAnalysts: selectedAnalysts,

        deadline

    });


    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all required fields!");
            return;
        }

        try {
            const formData = new FormData();

            // 🔹 Normal fields
            const payload = buildPayload();
            Object.entries(payload).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        if (v !== undefined && v !== null) {
                            formData.append(key, v);
                        }
                    });
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // 🔹 Files
            files.forEach(file => {
                if (file instanceof File) {
                    formData.append("files", file);
                }
            });

            // 🔹 SINGLE API CALL (IMPORTANT)
            const response = await toast.promise(
                createProject(formData).unwrap(),
                {
                    pending: "Se creează proiectul...",
                    success: "Proiect final creat cu succes!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la salvare!";
                        },
                    },
                },
                { autoClose: 3000 }
            );

            navigate(`/project/view/${response.data._id}`);

        } catch (err) {
            console.error(err);
            toast.error("Eroare neașteptată!");
        }
    };


    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // ============================
    // SAVE DRAFT HANDLER
    // ============================
    const handleDraft = async () => {
        const userId = localStorage.getItem("userId");

        const payload = {
            ...buildPayload(),
            status: "draft"        // 🔥 VERY IMPORTANT
        };

        try {
            const response = await createProject(payload).unwrap();
            toast("Draft proiect salvat!");
            navigate(`/projectDetail/${response.data._id}`);
        } catch (err) {
            console.log(err);
            toast.error("Eroare la salvarea draftului!");
        }
    };

    return (
        <div className="page-wrapper1">
            <div className="page-container">

                {/* PROJECT DETAILS */}
                <div className="form-card">
                    <h2 className="form-title">Detalii proiect</h2>

                    {/* ROW 1 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Denumire Proiect <small>(Nume Companie/Persoana/Tinta )</small></label>
                            <input
                                className="input-box"
                                placeholder="ex: Due Diligence: Societatea ABC"
                                value={projectName}
                                onChange={(e) =>
                                    setProjectName(e.target.value)
                                }
                            />
                            {errors.projectName && (
                                <p className={styles.errorText}>
                                    {errors.projectName}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Subiect proiect</label>
                            <div className="input-wrapper">
                                <input
                                    className="input-box"
                                    placeholder="Societatea ABC"
                                    value={projectSubject}
                                    onChange={(e) =>
                                        setProjectSubject(e.target.value)
                                    }
                                />
                                {errors.projectSubject && (
                                    <p className={styles.errorText}>
                                        {errors.projectSubject}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row-four">
                        <div className="form-field">
                            <label>Tip raport</label>
                            <select
                                className={`${styles.input} input-box ${styles.selectAnalyst}`}
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="" className="option-bold">
                                    Selectați Tip raport
                                </option>
                                <option value="">
                                    Enhanced Due Diligence
                                </option>
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
                                <p className={styles.errorText}>{errors.reportType}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Tip entitate</label>

                            <select
                                className={`${styles.input} input-box ${styles.selectAnalyst}`}
                                value={entityType}
                                onChange={(e) => {
                                    const selectedId = e.target.value;

                                    setEntityType(selectedId);      // state me _id save
                                    console.log("Selected category Mongo ID:", selectedId);
                                }}
                            >
                                <option value="">Selectați tipul entității</option>

                                {categoryOptions.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>


                            {catsError && (
                                <p className={styles.errorText}>
                                    Nu s-au putut încărca categoriile.
                                </p>
                            )}

                            {errors.entityType && (
                                <p className={styles.errorText}>{errors.entityType}</p>
                            )}
                        </div>


                        <div className="form-field">
                            <label>Termen limită</label>
                            <input
                                type="date"
                                className="input-box"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                            {errors.deadline && (
                                <p className={styles.errorText}>
                                    {errors.deadline}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Prioritate</label>
                            <select
                                className={`${styles.input} input-box ${errors.priority ? styles.inputError : ""}`}
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="">Selectează...</option>
                                <option value="Normal">Normal</option>
                                <option value="Urgentă">Urgentă</option>
                                <option value="Confidențial">Confidențial</option>
                            </select>

                            {errors.priority && (
                                <p className={styles.errorText}>{errors.priority}</p>
                            )}
                        </div>

                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Limbă livrabil</label>
                            <input
                                className="input-box"
                                placeholder="Română, Engleză"
                                value={language.join(", ")}
                                onChange={(e) =>
                                    setLanguage(
                                        e.target.value
                                            .split(",")
                                            .map(l => l.trim())
                                            .filter(Boolean)
                                    )
                                }
                            />

                            {errors.language && (
                                <p className={styles.errorText}>
                                    {errors.language}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Fișiere atașate</label>

                            <div
                                className="dropzone"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() =>
                                    document
                                        .getElementById("fileInput")
                                        .click()
                                }
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

                            {files.map((file, i) => (
                                <div className="file-item" key={i}>
                                    📄{" "}
                                    {typeof file === "string"
                                        ? file
                                        : file.name}
                                    <span
                                        className="delete-file"
                                        onClick={() => removeFile(i)}
                                    >
                                ✖
                            </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-field full-width">
                        <label>Descriere proiect</label>
                        <textarea
                            className="textarea-box"
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(e.target.value)
                            }
                            placeholder="Scop, cerintele proiectului, instructiuni, etc"
                        />
                        {errors.projectDescription && (
                            <p className={styles.errorText}>
                                {errors.projectDescription}
                            </p>
                        )}
                    </div>
                </div>

                {/* RESPONSIBLES */}
                <div className="form-card">
                    <h2 className="form-title">Responsabili proiect</h2>

                    <div className="row-two">
                        {/* RESPONSIBLE */}
                        <div className="form-field" ref={respRef}>
                            <label>Responsabil (1)</label>

                            <div
                                className="dropdown-box"
                                onClick={() => setRespOpen(!respOpen)}
                            >
                        <span>
                            {analystOptions.find(
                                    (a) => a.id === responsible
                                )?.name ||
                                "Selectează responsabilul"}
                        </span>
                            </div>

                            {respOpen && (
                                <div className="dropdown-list">
                                    {analystOptions.map((a) => (
                                        <label
                                            className="radio-item"
                                            key={a.id}
                                        >
                                            <input
                                                type="radio"
                                                checked={responsible === a.id}
                                                onChange={() => {
                                                    setResponsible(a.id);
                                                    setRespOpen(false);
                                                }}
                                            />
                                            {a.name}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {errors.responsible && (
                                <p className={styles.errorText}>
                                    {errors.responsible}
                                </p>
                            )}
                        </div>

                        {/* MULTI SELECT ANALYSTS */}
                        <div className="form-field" ref={multiRef}>
                            <label>Analiști suplimentari</label>

                            <div
                                className="dropdown-box"
                                onClick={() => setMultiOpen(!multiOpen)}
                            >
                        <span>
                            {selectedAnalysts.length
                                ? selectedAnalysts
                                    .map(
                                        (id) =>
                                            analystOptions.find(
                                                (a) => a.id === id
                                            )?.name || ""
                                    )
                                    .filter(Boolean)
                                    .join(", ")
                                : "Selectează ▾"}
                        </span>
                            </div>

                            {multiOpen && (
                                <div className="dropdown-list">
                                    {analystOptions.map((a) => (
                                        <label
                                            className={`checkbox-item ${
                                                a.id === responsible ? "disabled" : ""
                                            }`}
                                            key={a.id}
                                        >

                                        <input
                                                type="checkbox"
                                                checked={selectedAnalysts.includes(a.id)}
                                                disabled={a.id === responsible}
                                                onChange={() => toggleAnalyst(a.id)}
                                            />

                                            {a.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CLIENT & CONTRACT DETAILS */}
                <div className="form-card">
                    <h2 className="form-title">
                        Detalii contract & client
                    </h2>

                    {/* ROW 1 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Nume client</label>
                            <input
                                className="input-box"
                                value={clientName}
                                onChange={(e) =>
                                    setClientName(e.target.value)
                                }
                                placeholder="ZZZ SRL"
                            />
                            {errors.clientName && (
                                <p className={styles.errorText}>
                                    {errors.clientName}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Persoană de contact</label>
                            <input
                                className="input-box"
                                value={clientPerson}
                                onChange={(e) =>
                                    setClientPerson(e.target.value)
                                }
                                placeholder="Ana Popescu"
                            />
                            {errors.clientPerson && (
                                <p className={styles.errorText}>
                                    {errors.clientPerson}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Funcție</label>
                            <input
                                className="input-box"
                                value={clientPosition}
                                onChange={(e) =>
                                    setClientPosition(e.target.value)
                                }
                                placeholder="Director Achiziții"
                            />
                            {errors.clientPosition && (
                                <p className={styles.errorText}>
                                    {errors.clientPosition}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Email</label>
                            <input
                                className="input-box"
                                value={clientEmail}
                                onChange={(e) =>
                                    setClientEmail(e.target.value)
                                }
                                placeholder="ana.popescu@zzz.ro"
                            />
                            {errors.clientEmail && (
                                <p className={styles.errorText}>
                                    {errors.clientEmail}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Telefon</label>
                            <input
                                type="text"
                                className="input-box no-spin"
                                value={clientPhone}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow digits and + only (block - and all other symbols)
                                    if (/^[0-9+]*$/.test(value)) {
                                        setClientPhone(value);
                                    }
                                }}
                                placeholder="+40 7xx xxx xxx"
                            />

                            {errors.clientPhone && (
                                <p className={styles.errorText}>
                                    {errors.clientPhone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Nr. contract</label>
                            <input
                                className="input-box"
                                value={contractNo}
                                onChange={(e) =>
                                    setContractNo(e.target.value)
                                }
                                placeholder="CTR-2025-014"
                            />
                            {errors.contractNo && (
                                <p className={styles.errorText}>
                                    {errors.contractNo}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Nr. anexă</label>
                            <input
                                className="input-box"
                                value={annexNo}
                                onChange={(e) =>
                                    setAnnexNo(e.target.value)
                                }
                                placeholder="ANX-03"
                            />
                            {errors.annexNo && (
                                <p className={styles.errorText}>
                                    {errors.annexNo}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Se dorește</label>
                            <input
                                className="input-box"
                                value={services}
                                onChange={(e) =>
                                    setServices(e.target.value)
                                }
                                placeholder="OSINT, HUMINT"
                            />
                            {errors.services && (
                                <p className={styles.errorText}>
                                    {errors.services}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ROW 4 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Preț proiect</label>
                            <input
                                type="text"
                                className="input-box no-spin"
                                value={projectPrice}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow digits and + (block - and any other symbol)
                                    if (/^[0-9+]*$/.test(value)) {
                                        setProjectPrice(value);
                                    }
                                }}
                                placeholder="3.500"
                            />

                            {errors.projectPrice && (
                                <p className={styles.errorText}>
                                    {errors.projectPrice}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Monedă</label>
                            <input
                                className="input-box"
                                value="EUR"
                                disabled
                            />
                        </div>
                    </div>

                    {/* ROW 5 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Alte informații despre contract</label>
                            <textarea
                                className="textarea-box"
                                value={contractInfo}
                                onChange={(e) =>
                                    setContractInfo(e.target.value)
                                }
                                placeholder="Informatii confidentiale, care nu sunt deschise analistilor; instructiuni etc"
                            />
                            {errors.contractInfo && (
                                <p className={styles.errorText}>
                                    {errors.contractInfo}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Solicitare referințe</label>
                            <textarea
                                className="textarea-box"
                                value={referenceRequest}
                                onChange={(e) =>
                                    setReferenceRequest(e.target.value)
                                }
                                placeholder="De mentionat persoanele care ar putea detine informatii despre speta"
                            />
                            {errors.referenceRequest && (
                                <p className={styles.errorText}>
                                    {errors.referenceRequest}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ROW 6 */}
                    <div className="form-field full-width">
                        <label>Note interne</label>
                        <textarea
                            className="textarea-box"
                            value={internalNotes}
                            onChange={(e) =>
                                setInternalNotes(e.target.value)
                            }
                            placeholder="Alte informatii confidentiale despre proiect, recomandari etc"
                        />
                        {errors.internalNotes && (
                            <p className={styles.errorText}>
                                {errors.internalNotes}
                            </p>
                        )}
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="button-row">

                        <button
                            className="createProject"
                            onClick={handleSave}
                            disabled={isCreating}
                        >
                            {isCreating ? "Se creează..." : (id ? "Creează proiect nou" : "Creează proiect nou")}
                        </button>

                        <button className="draftProject" onClick={handleDraft} disabled={isCreating}>
                            Salvează draft
                        </button>





                    </div>


                </div>
            </div>
        </div>
    )

}

export default CreateProject;
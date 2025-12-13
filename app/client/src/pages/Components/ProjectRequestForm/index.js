import React, { useState,useEffect,useRef } from "react";
import styles from "./ProjectRequest.module.css";
import { useSelector } from "react-redux";
import { useRequestProjectMutation } from "../../../services/projectApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAnalystsQuery } from "../../../services/userApi";

const Index = () => {

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
    const [languages, setLanguages] = useState(["Română"]);

    const [preferredAnalyst, setPreferredAnalyst] = useState("");
    const [referenceRequest, setReferenceRequest] = useState("");

    const [services, setServices] = useState(["OSINT"]);

    const [projectDescription, setProjectDescription] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [surname, setSurname] = useState("");

    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const [requestProject, { isLoading }] = useRequestProjectMutation();

    const { data } = useGetAnalystsQuery();
    const analystData = data?.data || [];
    const analyst = analystData.filter((p) => p.role === "analyst");

    const [respOpen, setRespOpen] = useState(false);
    const [multiOpen, setMultiOpen] = useState(false);

    const [responsibleAnalyst, setResponsibleAnalyst] = useState("");
    const [assignedAnalysts, setAssignedAnalysts] = useState([]);


    const respRef = useRef(null);
    const multiRef = useRef(null);

    const toggleAnalyst = (id) => {
        if (assignedAnalysts.includes(id)) {
            setAssignedAnalysts(assignedAnalysts.filter(a => a !== id));
        } else {
            setAssignedAnalysts([...assignedAnalysts, id]);
        }
    };

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


    // Email validation function
    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation function
    const validatePhoneFormat = (phone) => {
        const phoneRegex = /^[\d\s+()-]*$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
    };

    // Price validation function
    const validatePriceFormat = (price) => {
        if (!price) return false;
        const priceValue = parseFloat(price);
        return !isNaN(priceValue) && priceValue > 0;
    };

    const toggleService = (name) => {
        setServices((prev) =>
            prev.includes(name)
                ? prev.filter((s) => s !== name)
                : [...prev, name]
        );
    };

    // DROPZONE HANDLER
    // DROPZONE HANDLERS
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    };

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };


    // VALIDATION FUNCTION
    const validateForm = () => {
        let newErrors = {};

        // Nume client validation
        if (!name.trim()) {
            newErrors.name = "Numele clientului este obligatoriu";
        }

        // Persoană de contact validation
        if (!contactPerson.trim()) {
            newErrors.contactPerson = "Persoana de contact este obligatorie";
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Emailul este obligatoriu";
        } else if (!validateEmailFormat(email)) {
            newErrors.email = "Formatul emailului este incorect. Exemplu: nume@domeniu.com";
        }

        // Phone validation
        if (!phone.trim()) {
            newErrors.phone = "Telefonul este obligatoriu";
        } else if (!validatePhoneFormat(phone)) {
            newErrors.phone = "Formatul telefonului este incorect. Exemplu: +40 712 345 678";
        }

        // Contract number validation (only if contractDone is true)
        if (contractDone && !contractNumber.trim()) {
            newErrors.contractNumber = "Numărul contractului este obligatoriu dacă este bifat";
        }

        // Annex number validation (only if annexDone is true)
        if (annexDone && !annexNumber.trim()) {
            newErrors.annexNumber = "Numărul anexei este obligatoriu dacă este bifat";
        }

        // Project subject validation
        if (!projectSubject.trim()) {
            newErrors.projectSubject = "Subiectul proiectului este obligatoriu";
        }

        // Entity type validation
        if (!entityType.trim()) {
            newErrors.entityType = "Tipul entității este obligatoriu";
        }

        // Deadline validation
        if (!deadline) {
            newErrors.deadline = "Termenul limită este obligatoriu";
        } else {
            // Check if deadline is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(deadline);
            if (selectedDate < today) {
                newErrors.deadline = "Termenul limită nu poate fi în trecut";
            }
        }

        // Category validation
        if (!category.trim()) {
            newErrors.category = "Categoria proiectului este obligatorie";
        }

        // Project price validation
        if (!projectPrice) {
            newErrors.projectPrice = "Prețul proiectului este obligatoriu";
        } else if (!validatePriceFormat(projectPrice)) {
            newErrors.projectPrice = "Prețul trebuie să fie un număr pozitiv";
        }

        // Reference request validation
        if (!referenceRequest.trim()) {
            newErrors.referenceRequest = "Solicitarea de referințe este obligatorie";
        }

        // Project description validation
        if (!projectDescription.trim()) {
            newErrors.projectDescription = "Descrierea proiectului este obligatorie";
        }

        if (!surname.trim()) {
            newErrors.surname = "Prenumele este obligatoriu";
        }

        // Internal notes validation
        if (!internalNotes.trim()) {
            newErrors.internalNotes = "Notele interne sunt obligatorii";
        }

        // Services validation (at least one service must be selected)
        if (services.length === 0) {
            newErrors.services = "Selectați cel puțin un serviciu";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT
    const handleSubmit = async () => {
        if (!user?._id) {
            toast.error("Utilizatorul nu este autentificat");
            return;
        }

        // Validate form before submission
        if (!validateForm()) {
            toast.error("Vă rugăm completați toate câmpurile obligatorii!");
            return;
        }

        const formData = new FormData();

        // REQUIRED FIELDS → match backend EXACTLY
        formData.append("projectName", name);
        formData.append("projectSubject", projectSubject);
        formData.append("reportType", category);
        formData.append("entityType", entityType);
        formData.append("priority", priority);
        languages.forEach((lng) => {
            formData.append(
                "deliverableLanguage",
                lng === "Română" ? "Romanian" : "English"
            );
        });

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
        formData.append("surname", surname);

        // SERVICES → backend expects servicesRequested[]
        services.forEach((srv) => {
            formData.append("servicesRequested", srv);
        });

        // ANALYST FIELDS (optional)
        // ANALYST FIELDS (optional)
        if (preferredAnalyst) {
            formData.append("responsibleAnalyst", preferredAnalyst);
        }

// MULTI ANALYSTS
        assignedAnalysts.forEach((id) => {
            formData.append("assignedAnalysts", id);
        });


        // FILES
        files.forEach((file) => {
            formData.append("files", file);
        });

        // REQUIRED BY BACKEND
        
        formData.append("status", "requested");

        try {
            const response = await toast.promise(
                requestProject(formData).unwrap(),
                {
                    pending: "Se trimite cererea...",
                    success: "Proiect creat cu succes!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la crearea proiectului";
                        },
                    },
                },
                { autoClose: 3000 }
            );

            console.log(response);

            // Clear form after successful submission
            setName("");
            setContactPerson("");
            setPosition("");
            setEmail("");
            setPhone("");
            setContractNumber("");
            setContractDone(false);
            setAnnexNumber("");
            setAnnexDone(false);
            setProjectSubject("");
            setAdditionalInfo("");
            setEntityType("");
            setDeadline("");

            //  BUG FIX: this should be [] not ""
            setAssignedAnalysts([]);

            setCategory("");
            setProjectPrice("");
            setSurname("");
            setPriority("Normal");
            setLanguages(["Română"]);
            setPreferredAnalyst("");
            setReferenceRequest("");
            setServices(["OSINT"]);
            setProjectDescription("");
            setInternalNotes("");
            setFiles([]);
            setErrors({});
        } catch (err) {
            console.error(err);
            // toast.promise already handled error toast
        }
    };
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const analystOptions = analyst.map((a) => ({
        id: String(a._id),
        name: a.name
    }));

    const toggleLanguage = (lng) => {
        setLanguages((prev) =>
            prev.includes(lng)
                ? prev.filter((l) => l !== lng)
                : [...prev, lng]
        );
    };


    return (
        <div className={ styles.pageWrapper1 }>
            <div className={styles.page}>
                <div className={styles.topBar} />

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
                                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="ex: Societatea ABC / POPESCU Ion"
                                        />
                                    </label>
                                    {errors.name && (
                                        <div className={styles.errorMessage}>
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* CONTACT PERSON */}
                                <div className={styles.gridItem}>
                                    <label className={styles.label}>
                                        Persoană de contact
                                        <input
                                            className={`${styles.input} ${errors.contactPerson ? styles.inputError : ''}`}
                                            value={contactPerson}
                                            onChange={(e) =>
                                                setContactPerson(e.target.value)
                                            }
                                            placeholder="nume"
                                        />
                                    </label>
                                    {errors.contactPerson && (
                                        <div className={styles.errorMessage}>
                                            {errors.contactPerson}
                                        </div>
                                    )}
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
                                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="ex: contact@client.ro"
                                        />
                                    </label>
                                    {errors.email && (
                                        <div className={styles.errorMessage}>
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* PHONE */}
                                <div className={styles.gridItem}>
                                    <label className={styles.label}>
                                        Telefon
                                        <input
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'Minus') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`${styles.input} ${styles['no-spin-project-request']} ${errors.phone ? styles.inputError : ''}`}
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="+40 7xx xxx xxx"
                                        />
                                    </label>
                                    {errors.phone && (
                                        <div className={styles.errorMessage}>
                                            {errors.phone}
                                        </div>
                                    )}
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
                                            className={`${styles.input} ${errors.contractNumber ? styles.inputError : ''}`}
                                            value={contractNumber}
                                            onChange={(e) =>
                                                setContractNumber(e.target.value)
                                            }
                                            placeholder={contractDone? "":"ex: CTR-2025-014"}
                                            disabled={!contractDone}
                                        />
                                    </label>
                                    {errors.contractNumber && (
                                        <div className={styles.errorMessage}>
                                            {errors.contractNumber}
                                        </div>
                                    )}
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
                                            className={`${styles.input} ${errors.annexNumber ? styles.inputError : ''}`}
                                            value={annexNumber}
                                            onChange={(e) =>
                                                setAnnexNumber(e.target.value)
                                            }
                                            placeholder={annexDone ? "":"de făcut"}
                                            disabled={!annexDone}
                                        />
                                    </label>
                                    {errors.annexNumber && (
                                        <div className={styles.errorMessage}>
                                            {errors.annexNumber}
                                        </div>
                                    )}
                                </div>

                                {/* SUBJECT */}
                                <div
                                    className={`${styles.gridItem} ${styles.span2Left}`}
                                >
                                    <label className={styles.label}>
                                        Subiect proiect
                                        <textarea
                                            className={`${styles.textarea} ${styles.textareaTall} ${errors.projectSubject ? styles.inputError : ''}`}
                                            value={projectSubject}
                                            onChange={(e) =>
                                                setProjectSubject(e.target.value)
                                            }
                                            placeholder="persoană de interes, societate/societăți (nume complet / denumire)..."
                                        />
                                    </label>
                                    {errors.projectSubject && (
                                        <div className={styles.errorMessage}>
                                            {errors.projectSubject}
                                        </div>
                                    )}
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
                                        Tip entitate / caz
                                        <select
                                            className={`${styles.input} ${styles.selectAnalyst} ${errors.entityType ? styles.inputError : ''}`}
                                            value={entityType}
                                            onChange={(e) =>
                                                setEntityType(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Selectați tipul entității
                                            </option>
                                            <option value="Societate (include persoane cheie)">
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
                                    {errors.entityType && (
                                        <div className={styles.errorMessage}>
                                            {errors.entityType}
                                        </div>
                                    )}
                                </div>

                                {/* DEADLINE */}
                                <div
                                    className={`${styles.gridItem} ${styles.span2Right}`}
                                >
                                    <label className={styles.label}>
                                        Termen limită
                                        <input
                                            type="date"
                                            className={`${styles.input} ${errors.deadline ? styles.inputError : ''}`}
                                            value={deadline}
                                            onChange={(e) =>
                                                setDeadline(e.target.value)
                                            }
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </label>
                                    {errors.deadline && (
                                        <div className={styles.errorMessage}>
                                            {errors.deadline}
                                        </div>
                                    )}
                                </div>

                                {/* CATEGORY (Dropdown) */}
                                <div
                                    className={`${styles.gridItem} ${styles.span2Left}`}
                                >
                                    <label className={styles.label}>
                                        Tip raport
                                        <select
                                            className={`${styles.input} ${styles.selectAnalyst} ${errors.category ? styles.inputError : ''}`}
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                        >
                                            <option value="" className="option-bold">
                                                Selectați Tip raport
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
                                    {errors.category && (
                                        <div className={styles.errorMessage}>
                                            {errors.category}
                                        </div>
                                    )}
                                </div>

                                {/* PRICE */}
                                <div
                                    className={`${styles.gridItem} ${styles.span2Right}`}
                                >
                                    <label className={styles.label}>
                                        Preț proiect
                                        <input
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'Minus') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`${styles.input} ${styles['no-spin-project-request']} ${errors.projectPrice ? styles.inputError : ''}`}
                                            value={projectPrice}
                                            onChange={(e) =>
                                                setProjectPrice(e.target.value)
                                            }
                                            placeholder="ex: 3.500 EUR"
                                        />
                                    </label>
                                    {errors.projectPrice && (
                                        <div className={styles.errorMessage}>
                                            {errors.projectPrice}
                                        </div>
                                    )}
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
                                                        languages.includes(lng) ? styles.chipActive : ""
                                                    }`}
                                                    onClick={() => toggleLanguage(lng)}
                                                >
                                                    {lng}
                                                </button>
                                            ))}

                                        </div>
                                    </div>
                                </div>

                                {/* MULTI SELECT ANALYSIS */}
                                <div className={`${styles.gridItem} ${styles.span2Right}`} ref={multiRef}>
                                    <div className={styles.main2}>
                                        <label className={styles.label}>Analiști suplimentari</label>

                                        <div
                                            className={`${styles.multiSelectBox} ${multiOpen ? styles.active : ""}`}
                                            onClick={() => setMultiOpen(!multiOpen)}
                                        >
                                            {assignedAnalysts.length
                                                ? assignedAnalysts
                                                    .map(id => analystOptions.find(a => a.id === id)?.name)
                                                    .filter(Boolean)
                                                    .join(", ")
                                                : "Selectează ▾"}
                                        </div>


                                        {multiOpen && (
                                            <div className={styles.dropdownList}>
                                                {analystOptions.map(a => (
                                                    <label key={a.id} className={styles.dropdownItem}>
                                                        <input
                                                            type="checkbox"
                                                            checked={assignedAnalysts.includes(a.id)}
                                                            onChange={() => toggleAnalyst(a.id)}
                                                        />
                                                        <div>{a.name}</div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div
                                    className={`${styles.gridItem} ${styles.span2Right}`}
                                >
                                    <label className={styles.label}>
                                        Preferinta detectiv implicat in proiect
                                        <input
                                            type="text"
                                            className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                                            value={surname}
                                            onChange={(e) =>
                                                setSurname(
                                                    e.target.value
                                                )
                                            }
                                            placeholder=" Nume prenume persoane"
                                        />
                                    </label>
                                    {errors.surname && (
                                        <div className={styles.errorMessage}>
                                            {errors.surname}
                                        </div>
                                    )}
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
                                        className={`${styles.input} ${errors.referenceRequest ? styles.inputError : ''}`}
                                        value={referenceRequest}
                                        onChange={(e) =>
                                            setReferenceRequest(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Introdu solicitarea de referințe..."
                                    />
                                </label>
                                {errors.referenceRequest && (
                                    <div className={styles.errorMessage}>
                                        {errors.referenceRequest}
                                    </div>
                                )}
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
                                {errors.services && (
                                    <div className={styles.errorMessage}>
                                        {errors.services}
                                    </div>
                                )}
                            </div>


                            {/* PROJECT DESCRIPTION */}
                            <div className={styles.fullWidthBlock}>
                                <label className={styles.label}>
                                    Descriere proiect
                                    <textarea
                                        className={`${styles.textarea} ${styles.largeTextarea} ${errors.projectDescription ? styles.inputError : ''}`}
                                        value={projectDescription}
                                        onChange={(e) =>
                                            setProjectDescription(e.target.value)
                                        }
                                        placeholder="ce se vrea, întrebările clientului, pe ce se pune accent..."
                                    />
                                </label>
                                {errors.projectDescription && (
                                    <div className={styles.errorMessage}>
                                        {errors.projectDescription}
                                    </div>
                                )}
                            </div>

                            {/* INTERNAL NOTES */}
                            <div className={styles.fullWidthBlock}>
                                <label className={styles.label}>
                                    Note interne
                                    <textarea
                                        className={`${styles.textarea} ${styles.largeTextarea} ${errors.internalNotes ? styles.inputError : ''}`}
                                        value={internalNotes}
                                        onChange={(e) =>
                                            setInternalNotes(e.target.value)
                                        }
                                        placeholder="constrângeri, jurisdicții, termeni contractuali, preferințe livrare..."
                                    />
                                </label>
                                {errors.internalNotes && (
                                    <div className={styles.errorMessage}>
                                        {errors.internalNotes}
                                    </div>
                                )}
                            </div>


                            {/* FILE UPLOAD – DROPZONE */}
                            <div className={styles.halfWidthBlock}>
                                <label className={styles.label}>Atașează fișiere</label>

                                <div
                                    className={styles.dropzone}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById("fileInput").click()}
                                >
                                    <p style={{color : "gray"}}>Trage aici fișierele sau fă click pentru a încărca</p>
                                </div>

                                <input
                                    id="fileInput"
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFileUpload}
                                />

                                {files.map((file, i) => (
                                    <div className={styles.fileRow} key={i}>
                                        📄 {file.name}
                                        <span
                                            className={styles.deleteFileBtn}
                                            onClick={() => removeFile(i)}
                                        >
                ✖
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
                        <button onClick={handleSubmit} disabled={isLoading}  className={`${styles.actionBtn} ${styles.actionAdd}`}>
                            {isLoading ? "Se trimite..." : "Adaugă"}
                        </button>

                        <button
                            className={`${styles.actionBtn} ${styles.actionDraft}`}
                        >
                            Salvează draft
                        </button>
                        <Link to={`/`}
                            className={`${styles.actionBtn} ${styles.actionCancel}`}
                        >
                            Anulează
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
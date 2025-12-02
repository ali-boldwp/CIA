// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetail.js
import React, { useState } from "react";
import styles from "./ProjectDetail.module.css";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectBilling from "./ProjectBilling";
import ProjectDetailButton from "./ProjectDetailButton";

const ProjectDetail = () => {
    const [project, setProject] = useState({
        name: "Due Diligence: Societatea ABC",
        subject: "Societatea ABC",
        reportType: "Enhanced Due Diligence",
        entityType: "Societate",
        deadline: "2025-12-20",

        createdAt: "2025-12-01 09:20",
        startDate: "2025-12-02 10:15",
        status: "În lucru",

        priority: "Normal",
        language: "Română",
        services: "OSINT, HUMINT",
        description: "Scop, contexte preexistente, interdependențe, etc.",

        files: [
            "Contract_ABC.pdf – 1.2 MB",
            "Lista_interna_client.docx – 86 KB",
        ],

        responsible: "Analist C",
        team: ["Analist A", "Analist B"],

        clientName: "ZZZ SRL",
        contactPerson: "Ana Popescu",
        contactRole: "Director Achiziții",
        email: "ana.popescu@zzz.ro",
        phone: "+40 7xx xxx xxx",

        contractNumber: "CTR-2025-014",
        annexNumber: "ANX-03",
        price: "3.500",
        currency: "EUR",

        referenceRequest:
            "De menționat persoanele care ar putea deține informații despre speță.",
        contractNotes:
            "Informații contractuale confidențiale, termeni, clauze, etc.",
        internalNotes:
            "Alte informații confidențiale despre proiect, recomandări interne, etc.",
    });

    const handleBack = () => {
        window.history.back();
    };

    const billingData = {
        price: 3500,
        fixed: 300,
        osint: 150,
        staff: 1050,
        humint: 554.4,
        total: 2054.4,
        margin: 1445.6,
        percentage: 41.3,
    };

    const handleFieldChange = (field) => (e) => {
        const value = e.target.value;
        setProject((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFilesChange = (e) => {
        const filesArray = Array.from(e.target.files || []);
        setProject((prev) => ({
            ...prev,
            files: filesArray.map((f) => f.name),
        }));
    };

    const handleSave = () => {
        // yahan backend call wire karna hai (PUT/POST)
        console.log("SAVE PAYLOAD:", project);
    };

    return (
        <div className={styles.page}>
            {/* PAGE HEADER */}
            <ProjectDetailHeader
                title={`Proiect: ${project.name}`}
                onBack={handleBack}
            />

            <div className={styles.contentWrapper}>
                {/* ========== SINGLE CARD: DETALII PROIECT + CLIENT & CONTRACT + NOTE INTERNE ========== */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Detalii proiect (preluate automat din solicitare)
                    </h2>

                    {/* ROW 1 – Denumire + status pills */}
                    <div className={styles.detailTop}>
                        {/* Denumire proiect (EDITABLE) */}
                        <div className={styles.nameBlock}>
                            <span className={styles.label}>Denumire proiect</span>

                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.nameValueBox}
                                    value={project.name}
                                    onChange={handleFieldChange("name")}
                                />
                            </div>
                        </div>

                        {/* Created / Start / Status (READ ONLY) */}
                        <div className={styles.statusBlock}>
                            <span
                                className={`${styles.statusPill} ${styles.statusCreated}`}
                            >
                                <span className={styles.statusBold}>Creat la:</span>{" "}
                                {project.createdAt}
                            </span>

                            <span
                                className={`${styles.statusPill} ${styles.statusStart}`}
                            >
                                <span className={styles.statusBold}>Start proiect:</span>{" "}
                                {project.startDate}
                            </span>

                            <span
                                className={`${styles.statusPill} ${styles.statusState}`}
                            >
                                <span className={styles.statusBold}>Status:</span>{" "}
                                {project.status}
                            </span>
                        </div>
                    </div>

                    {/* ROW 2 – Subiect, Tip raport, Tip entitate, Deadline */}
                    <div className={styles.metaRow}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Subiect proiect</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.subject}
                                    onChange={handleFieldChange("subject")}
                                />
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip raport</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.reportType}
                                    onChange={handleFieldChange("reportType")}
                                />
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip entitate</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.entityType}
                                    onChange={handleFieldChange("entityType")}
                                />
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Deadline</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="date"
                                    className={`${styles.metaValueBox} ${styles.metaValueBold}`}
                                    value={project.deadline}
                                    onChange={handleFieldChange("deadline")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ROW 3 – Prioritate, Limba, Se dorește */}
                    <div className={styles.metaRow2}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Prioritate</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.priority}
                                    onChange={handleFieldChange("priority")}
                                />
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Limba livrabilă</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.language}
                                    onChange={handleFieldChange("language")}
                                />
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Se dorește (tipuri)</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.services}
                                    onChange={handleFieldChange("services")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== Descriere, Fișiere, Echipă ===== */}
                    <div className={styles.detailGrid}>
                        {/* Descriere proiect – TEXTAREA */}
                        <div className={styles.itemFull}>
                            <div className={styles.label}>Descriere proiect</div>

                            <div className={styles.bigInputWrapper}>
                                <textarea
                                    className={styles.bigInputBox}
                                    value={project.description}
                                    onChange={handleFieldChange("description")}
                                />
                            </div>
                        </div>

                        {/* Fișiere atașate – FILE DROP + LIST */}
                        <div className={styles.itemFull}>
                            <div className={styles.label}>Fișiere atașate</div>

                            <div className={styles.filesWrapper}>
                                <label className={styles.fileDrop}>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFilesChange}
                                        className={styles.fileInput}
                                    />
                                    <span>
                                        Trage fișierele aici sau fă click pentru a le selecta
                                    </span>
                                </label>

                                <div className={styles.filesBox}>
                                    {project.files.map((file, idx) => (
                                        <div key={idx} className={styles.fileRow}>
                                            {file}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Echipă proiect – READ ONLY */}
                        <div className={styles.itemFull}>
                            <span className={styles.label}>Echipă proiect</span>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Responsabil:</span>
                                <span className={styles.chipPrimary}>
                                    {project.responsible}
                                </span>
                            </div>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Analiști alocați:</span>
                                {project.team.map((member) => (
                                    <span key={member} className={styles.chipGhost}>
                                        {member}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* bottom thin line inside card */}
                    <div className={styles.sectionDivider} />

                    {/* ========== Detalii client & contract (EDITABLE) ========== */}
                    <h2 className={styles.subSectionTitle}>
                        Detalii client & contract (confidențiale — vizibile doar
                        manageri)
                    </h2>

                    <div className={styles.clientGrid}>
                        {/* ROW 1 – 3 fields */}
                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Nume client</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.clientName}
                                    onChange={handleFieldChange("clientName")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Persoană de contact</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.contactPerson}
                                    onChange={handleFieldChange("contactPerson")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Funcție (opțional)</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.contactRole}
                                    onChange={handleFieldChange("contactRole")}
                                />
                            </div>
                        </div>

                        {/* ROW 2 – 2 fields */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Email</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="email"
                                    className={styles.metaValueBox}
                                    value={project.email}
                                    onChange={handleFieldChange("email")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Telefon</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.phone}
                                    onChange={handleFieldChange("phone")}
                                />
                            </div>
                        </div>

                        {/* ROW 3 – 4 fields */}
                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. contract</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.contractNumber}
                                    onChange={handleFieldChange("contractNumber")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. anexă</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.annexNumber}
                                    onChange={handleFieldChange("annexNumber")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Preț proiect</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.price}
                                    onChange={handleFieldChange("price")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Monedă</span>
                            <div className={styles.valueWrapper}>
                                <input
                                    type="text"
                                    className={styles.metaValueBox}
                                    value={project.currency}
                                    onChange={handleFieldChange("currency")}
                                />
                            </div>
                        </div>

                        {/* ROW 4 – 2 text areas */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>
                                Alte informații despre contract
                            </span>
                            <div className={styles.bigInputWrapper}>
                                <textarea
                                    className={styles.bigInputBox}
                                    value={project.contractNotes}
                                    onChange={handleFieldChange("contractNotes")}
                                />
                            </div>
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>
                                Solicitare referințe / informații suplimentare
                            </span>
                            <div className={styles.bigInputWrapper}>
                                <textarea
                                    className={styles.bigInputBox}
                                    value={project.referenceRequest}
                                    onChange={handleFieldChange("referenceRequest")}
                                />
                            </div>
                        </div>

                        {/* ROW 5 – Note interne (confidențiale) */}
                        <div className={styles.clientItemFull}>
                            <span className={styles.label}>Note interne (confidențiale)</span>
                        </div>

                        <div className={styles.clientItemFull}>
                            <div className={styles.bigInputWrapper}>
                                <textarea
                                    className={styles.bigInputBox}
                                    value={project.internalNotes}
                                    onChange={handleFieldChange("internalNotes")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <ProjectBilling billing={billingData} />

                <ProjectDetailButton
                    onSave={handleSave}
                    onGoToTask={() => console.log("go to task clicked")}
                    onViewCosts={() => console.log("view costs clicked")}
                />
            </div>
        </div>
    );
};

export default ProjectDetail;

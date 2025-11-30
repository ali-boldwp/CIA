// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetail.js
import React from "react";
import styles from "./ProjectDetail.module.css";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectBilling from "./ProjectBilling";
import ProjectDetailButton from "./ProjectDetailButton";

const ProjectDetail = () => {
    const project = {
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
    };

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
                        {/* Denumire proiect */}
                        <div className={styles.nameBlock}>
                            <span className={styles.label}>Denumire proiect</span>

                            <div className={styles.valueWrapper}>
                                <div className={styles.nameValueBox}>{project.name}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* Created / Start / Status */}
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
                                <div className={styles.metaValueBox}>{project.subject}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip raport</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.reportType}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip entitate</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.entityType}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Deadline</span>
                            <div className={styles.valueWrapper}>
                                <div
                                    className={`${styles.metaValueBox} ${styles.metaValueBold}`}
                                >
                                    {project.deadline}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ROW 3 – Prioritate, Limba, Se dorește */}
                    <div className={styles.metaRow2}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Prioritate</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.priority}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Limba livrabilă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.language}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Se dorește (tipuri)</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.services}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ===== Descriere, Fișiere, Echipă ===== */}
                    <div className={styles.detailGrid}>
                        {/* Descriere proiect – full width text */}
                        <div className={styles.itemFull}>
                            <div className={styles.label}>Descriere proiect</div>

                            <div className={styles.bigInputWrapper}>
                                <div className={styles.bigInputBox}>
                                    {project.description}
                                </div>

                                <span className={styles.autoChipInsideBig}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* Fișiere atașate – full width light box */}
                        <div className={styles.itemFull}>
                            <div className={styles.label}>Fișiere atașate</div>

                            <div className={styles.filesWrapper}>
                                <div className={styles.filesBox}>
                                    {project.files.map((file, idx) => (
                                        <div key={idx} className={styles.fileRow}>
                                            {file}
                                        </div>
                                    ))}
                                </div>

                                <span className={styles.autoChipInsideBig}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* Echipă proiect – full width */}
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

                    {/* ========== Detalii client & contract ========== */}
                    <h2 className={styles.subSectionTitle}>
                        Detalii client & contract (confidențiale — vizibile doar
                        manageri)
                    </h2>

                    <div className={styles.clientGrid}>
                        {/* ROW 1 – 3 fields */}
                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Nume client</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.clientName}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Persoană de contact</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.contactPerson}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Funcție (opțional)</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.contactRole}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* ROW 2 – 2 fields */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Email</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.email}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Telefon</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.phone}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* ROW 3 – 4 fields */}
                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. contract</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.contractNumber}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. anexă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.annexNumber}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Preț proiect</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.price} {project.currency}
                                </div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Monedă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.currency}</div>
                                <span className={styles.autoChipInside}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* ROW 4 – 2 text areas */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>
                                Alte informații despre contract
                            </span>
                            <div className={styles.bigInputWrapper}>
                                <div className={styles.bigInputBox}>
                                    {project.contractNotes}
                                </div>
                                <span className={styles.autoChipInsideBig}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>
                                Solicitare referințe / informații suplimentare
                            </span>
                            <div className={styles.bigInputWrapper}>
                                <div className={styles.bigInputBox}>
                                    {project.referenceRequest}
                                </div>
                                <span className={styles.autoChipInsideBig}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>

                        {/* ROW 5 – Note interne (confidențiale) in same section */}
                        <div className={styles.clientItemFull}>
                            <span className={styles.label}>Note interne (confidențiale)</span>
                        </div>

                        <div className={styles.clientItemFull}>
                            <div className={styles.bigInputWrapper}>
                                <div className={styles.bigInputBox}>
                                    {project.internalNotes}
                                </div>
                                <span className={styles.autoChipInsideBig}>
                                    auto din solicitare
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <ProjectBilling billing={billingData} />
                <ProjectDetailButton
                    onSave={() => console.log("save clicked")}
                    onGoToTask={() => console.log("go to task clicked")}
                    onViewCosts={() => console.log("view costs clicked")}
                />
            </div>
        </div>
    );
};

export default ProjectDetail;

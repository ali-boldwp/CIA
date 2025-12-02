// /home/ubaid/workspace/app/client/src/pages/ProjectDetail/ProjectDetail.js
import React from "react";
import styles from "./ProjectDetail.module.css";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectBilling from "./ProjectBilling";
import ProjectDetailButton from "./ProjectDetailButton";
import { useGetProjectRequestByIdQuery } from "../../services/projectApi";
import {useParams} from "react-router-dom";
import {useGetAllUsersQuery} from "../../services/userApi";

const ProjectDetail = () => {

    const { id } = useParams();  // URL se ID mil gayi

    const { data, isLoading } = useGetProjectRequestByIdQuery(id);
    const { data: usersData } = useGetAllUsersQuery();
    const project = data?.data || {};  // backend se project
    if (isLoading) return <p>Loading...</p>;


    const users = usersData?.data || [];

// Get responsible name
    const responsible = users.find(
        u => u._id === project.responsibleAnalyst
    );

// Assigned analysts (IDs → names)
    const assigned = project.assignedAnalysts?.map(id =>
        users.find(u => u._id === id)?.name || "Analist"
    );


    // const project = {
    //     name: "Due Diligence: Societatea ABC",
    //     subject: "Societatea ABC",
    //     reportType: "Enhanced Due Diligence",
    //     entityType: "Societate",
    //     deadline: "2025-12-20",
    //
    //     createdAt: "2025-12-01 09:20",
    //     startDate: "2025-12-02 10:15",
    //     status: "În lucru",
    //
    //     priority: "Normal",
    //     language: "Română",
    //     services: "OSINT, HUMINT",
    //     description: "Scop, contexte preexistente, interdependențe, etc.",
    //
    //     files: [
    //         "Contract_ABC.pdf – 1.2 MB",
    //         "Lista_interna_client.docx – 86 KB",
    //     ],
    //
    //     responsible: "Analist C",
    //     team: ["Analist A", "Analist B"],
    //
    //     clientName: "ZZZ SRL",
    //     contactPerson: "Ana Popescu",
    //     contactRole: "Director Achiziții",
    //     email: "ana.popescu@zzz.ro",
    //     phone: "+40 7xx xxx xxx",
    //
    //     contractNumber: "CTR-2025-014",
    //     annexNumber: "ANX-03",
    //     price: "3.500",
    //     currency: "EUR",
    //
    //     referenceRequest:
    //         "De menționat persoanele care ar putea deține informații despre speță.",
    //     contractNotes:
    //         "Informații contractuale confidențiale, termeni, clauze, etc.",
    //     internalNotes:
    //         "Alte informații confidențiale despre proiect, recomandări interne, etc.",
    // };

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
                title={`Proiect: ${project.projectName}`}
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
                                <div className={styles.nameValueBox}>{project.projectName}</div>

                            </div>
                        </div>

                        {/* Created / Start / Status */}
                        <div className={styles.statusBlock}>
                            <span
                                className={`${styles.statusPill} ${styles.statusCreated}`}
                            >
                                <span className={styles.statusBold}>Creat la:</span>{" "}
                                {new Date(project.createdAt).toLocaleString("ro-RO")}
                            </span>

                            <span
                                className={`${styles.statusPill} ${styles.statusStart}`}
                            >
                                <span className={styles.statusBold}>Start proiect:</span>{" "}
                                {new Date(project.createdAt).toLocaleString("ro-RO")}
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
                                <div className={styles.metaValueBox}>{project.projectSubject}</div>

                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip raport</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.reportType}
                                </div>

                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip entitate</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.entityType}
                                </div>

                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Deadline</span>
                            <div className={styles.valueWrapper}>
                                <div
                                    className={`${styles.metaValueBox} ${styles.metaValueBold}`}
                                >
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString("ro-RO")
                                        : "Fără deadline"}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ROW 3 – Prioritate, Limba, Se dorește */}
                    <div className={styles.metaRow2}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Prioritate</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.priority}</div>

                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Limba livrabilă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.deliverableLanguage}</div>

                            </div>
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Se dorește (tipuri)</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.servicesRequested?.length > 0
                                    ? project.servicesRequested.join(", ")
                                    : "—"
                                }
                                </div>

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
                                    {project.projectDescription}
                                </div>


                            </div>
                        </div>

                        {/* Fișiere atașate – full width light box */}
                        <div className={styles.itemFull}>
                            <div className={styles.label}>Fișiere atașate</div>

                            <div className={styles.filesWrapper}>
                                <div className={styles.filesBox}>
                                    {project.files?.length > 0 ? (
                                        project.files.map((file, idx) => (
                                            <div key={idx} className={styles.fileRow}>
                                                {file}
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.fileRow}>Niciun fișier</div>
                                    )}
                                </div>


                            </div>
                        </div>

                        {/* Echipă proiect – full width */}
                        <div className={styles.itemFull}>
                            <span className={styles.label}>Echipă proiect</span>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Responsabil:</span>
                                <span className={styles.chipPrimary}>
                                    {responsible?.name || "Nespecificat"}
                                </span>
                            </div>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Analiști alocați:</span>
                                {assigned?.length > 0 ? (
                                    assigned.map((name, idx) => (
                                        <span key={idx} className={styles.chipGhost}>
                        {name}
                    </span>
                                    ))
                                ) : (
                                    <span className={styles.chipGhost}>
                    Niciun analist asignat
                </span>
                                )}
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

                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Persoană de contact</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.clientContactPerson}
                                </div>

                            </div>
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Funcție (opțional)</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.clientPosition || "—"}
                                </div>

                            </div>
                        </div>

                        {/* ROW 2 – 2 fields */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Email</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.clientEmail}</div>

                            </div>
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Telefon</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.clientPhone}</div>

                            </div>
                        </div>

                        {/* ROW 3 – 4 fields */}
                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. contract</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.contractNumber || "—"}
                                </div>

                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. anexă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.annexNumber || "—"}
                                </div>

                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Preț proiect</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>
                                    {project.projectPrice} {project.currency}
                                </div>

                            </div>
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Monedă</span>
                            <div className={styles.valueWrapper}>
                                <div className={styles.metaValueBox}>{project.currency}</div>

                            </div>
                        </div>

                        {/* ROW 4 – 2 text areas */}
                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>
                                Alte informații despre contract
                            </span>
                            <div className={styles.bigInputWrapper}>
                                <div className={styles.bigInputBox}>
                                    {project.contractInfo}
                                </div>

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

import {useParams} from "react-router-dom";
import {
    useCreateProjectMutation,
    useGetCreateProjectByIdQuery,
    useUpdateProjectMutation
} from "../../../../../services/projectApi";
import React, {useEffect, useState} from "react";
import styles from "../../../../ProjectDetail/ProjectDetail.module.css";
import ProjectDetailHeader from "../../../../ProjectDetail/ProjectDetailHeader";
import ProjectBilling from "../../../../ProjectDetail/ProjectBilling";
import ProjectDetailButton from "../../../../ProjectDetail/ProjectDetailButton";

const defaultData = {
    name: "",
    subject: "",
    reportType: "",
    entityType: "",
    deadline: "",
    createdAt: "",
    startDate: "",
    status: "",
    priority: "",
    language: "",
    services: "",
    description: "",
    files: [],
    responsible: "",
    team: [],
    clientName: "",
    contactPerson: "",
    contactRole: "",
    email: "",
    phone: "",
    contractNumber: "",
    annexNumber: "",
    price: "",
    currency: "",
    contractNotes: "",
    referenceRequest: "",
    internalNotes: "",
};

const ProjectView = () => {

    const { id } = useParams();

    // 🧲 RTK Query Hooks
    const [createProject] = useCreateProjectMutation();
    const [updateProject] = useUpdateProjectMutation();

    const { data, isLoading } = useGetCreateProjectByIdQuery(id, {
        skip: !id,
    });

    // 📝 Component State
    const [project, setProject] = useState({ ...defaultData });


    useEffect(() => {
        if (data?.data) {
            const raw = data.data;
            const mapped = {
                _id: raw._id,
                name: raw.projectName,
                subject: raw.projectSubject,
                reportType: raw.reportType,
                entityType: raw.entityType,

                priority: raw.priority,
                language: raw.deliverableLanguage,
                description: raw.projectDescription,

                clientName: raw.clientName,
                contactPerson: raw.clientContactPerson,
                contactRole: raw.clientPosition,
                email: raw.clientEmail,
                phone: raw.clientPhone,

                price: raw.projectPrice,
                currency: raw.currency,

                deadline: raw.deadline?.split("T")[0],

                files: raw.files || [],

                responsible:
                    typeof raw.responsibleAnalyst === "object" && raw.responsibleAnalyst !== null
                        ? raw.responsibleAnalyst.name
                        : raw.responsibleAnalyst || "—",

                team: raw.assignedAnalysts || [],

                contractNotes: raw.contractInfo,
                referenceRequest: raw.referenceRequest,
                internalNotes: raw.internalNotes,

                createdAt: raw.createdAt,
                startDate: raw.updatedAt,
                status: raw.status,
                contractNumber: raw.contractNumber,
            };

            setProject(mapped);
        }
    }, [data]);


    // 💾 SAVE HANDLER
    const handleSave = async () => {
        try {
            if (id) {
                await updateProject({ id, data: project }).unwrap();
                alert("Project updated!");
            } else {
                await createProject(project).unwrap();
                alert("Project created!");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
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



    // ✏ Input Handler
    const handleFieldChange = (field) => (e) => {
        const value = e.target.value;
        setProject((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 📁 Files Handler
    const handleFilesChange = (e) => {
        const filesArray = Array.from(e.target.files || []);
        setProject((prev) => ({
            ...prev,
            files: filesArray.map((f) => f.name),
        }));
    };

    // 🌀 Loading UI
    if (isLoading) return <h2 style={{ padding: 40 }}>Loading project…</h2>;

    return (
        <div className={styles.page}>
            <ProjectDetailHeader
                title={`Proiect: ${project.name}`}
                onBack={handleBack}
            />

            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Detalii proiect (preluate automat din solicitare)
                    </h2>

                    {/* ================= ROW 1 ================= */}
                    <div className={styles.detailTop}>
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

                        <div className={styles.statusBlock}>
                            <span className={`${styles.statusPill} ${styles.statusCreated}`}>
                                <span className={styles.statusBold}>Creat la:</span>{" "}
                                {project.createdAt}
                            </span>

                            <span className={`${styles.statusPill} ${styles.statusStart}`}>
                                <span className={styles.statusBold}>Start proiect:</span>{" "}
                                {project.startDate}
                            </span>

                            <span className={`${styles.statusPill} ${styles.statusState}`}>
                                <span className={styles.statusBold}>Status:</span>{" "}
                                {project.status}
                            </span>
                        </div>
                    </div>

                    {/* ================= ROW 2 ================= */}
                    <div className={styles.metaRow}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Subiect proiect</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.subject}
                                onChange={handleFieldChange("subject")}
                            />
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip raport</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.reportType}
                                onChange={handleFieldChange("reportType")}
                            />
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Tip entitate</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.entityType}
                                onChange={handleFieldChange("entityType")}
                            />
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Deadline</span>
                            <input
                                type="date"
                                className={`${styles.metaValueBox} ${styles.metaValueBold}`}
                                value={project.deadline}
                                onChange={handleFieldChange("deadline")}
                            />
                        </div>
                    </div>

                    {/* ================= ROW 3 ================= */}
                    <div className={styles.metaRow2}>
                        <div className={styles.metaField}>
                            <span className={styles.label}>Prioritate</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.priority}
                                onChange={handleFieldChange("priority")}
                            />
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Limba livrabilă</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.language}
                                onChange={handleFieldChange("language")}
                            />
                        </div>

                        <div className={styles.metaField}>
                            <span className={styles.label}>Se dorește (tipuri)</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.services}
                                onChange={handleFieldChange("services")}
                            />
                        </div>
                    </div>

                    {/* ================= DESCRIPTION + FILES ================= */}
                    <div className={styles.detailGrid}>
                        <div className={styles.itemFull}>
                            <span className={styles.label}>Descriere proiect</span>
                            <textarea
                                className={styles.bigInputBox}
                                value={project.description}
                                onChange={handleFieldChange("description")}
                            />
                        </div>

                        <div className={styles.itemFull}>
                            <span className={styles.label}>Fișiere atașate</span>

                            <label className={styles.fileDrop}>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFilesChange}
                                    className={styles.fileInput}
                                />
                                <span>Trage fișierele aici sau fă click</span>
                            </label>

                            <div className={styles.filesBox}>
                                {project.files.map((file, idx) => (
                                    <div key={idx} className={styles.fileRow}>
                                        {file}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.itemFull}>
                            <span className={styles.label}>Echipă proiect</span>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Responsabil:</span>
                                <span className={styles.chipPrimary}>{project.responsible}</span>
                            </div>

                            <div className={styles.chipRow}>
                                <span className={styles.chipLabel}>Analiști alocați:</span>
                                {project.team.map((member) => (
                                    <span key={member._id} className={styles.chipGhost}>
        {member.name}
    </span>
                                ))}

                            </div>
                        </div>
                    </div>

                    <div className={styles.sectionDivider} />

                    {/* ================= CLIENT + CONTRACT ================= */}
                    <h2 className={styles.subSectionTitle}>Detalii client & contract</h2>

                    <div className={styles.clientGrid}>
                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Nume client</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.clientName}
                                onChange={handleFieldChange("clientName")}
                            />
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Persoană de contact</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.contactPerson}
                                onChange={handleFieldChange("contactPerson")}
                            />
                        </div>

                        <div className={styles.clientItem3}>
                            <span className={styles.label}>Funcție</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.contactRole}
                                onChange={handleFieldChange("contactRole")}
                            />
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Email</span>
                            <input
                                type="email"
                                className={styles.metaValueBox}
                                value={project.email}
                                onChange={handleFieldChange("email")}
                            />
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Telefon</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.phone}
                                onChange={handleFieldChange("phone")}
                            />
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. contract</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.contractNumber}
                                onChange={handleFieldChange("contractNumber")}
                            />
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Nr. anexă</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.annexNumber}
                                onChange={handleFieldChange("annexNumber")}
                            />
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Preț</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.price}
                                onChange={handleFieldChange("price")}
                            />
                        </div>

                        <div className={styles.clientItemQuarter}>
                            <span className={styles.label}>Monedă</span>
                            <input
                                type="text"
                                className={styles.metaValueBox}
                                value={project.currency}
                                onChange={handleFieldChange("currency")}
                            />
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Informații contract</span>
                            <textarea
                                className={styles.bigInputBox}
                                value={project.contractNotes}
                                onChange={handleFieldChange("contractNotes")}
                            />
                        </div>

                        <div className={styles.clientItemHalf}>
                            <span className={styles.label}>Solicitare referințe</span>
                            <textarea
                                className={styles.bigInputBox}
                                value={project.referenceRequest}
                                onChange={handleFieldChange("referenceRequest")}
                            />
                        </div>

                        <div className={styles.clientItemFull}>
                            <span className={styles.label}>Note interne</span>
                            <textarea
                                className={styles.bigInputBox}
                                value={project.internalNotes}
                                onChange={handleFieldChange("internalNotes")}
                            />
                        </div>
                    </div>
                </div>

                {/* Billing Component */}
                <ProjectBilling billing={billingData} />

                {/* Save Button */}
                <ProjectDetailButton
                    onSave={handleSave}
                    id={project._id}
                    onGoToTask={() => console.log("go to task clicked")}
                    onViewCosts={() => console.log("view costs clicked")}
                />
            </div>
        </div>
    );

}

export default ProjectView;
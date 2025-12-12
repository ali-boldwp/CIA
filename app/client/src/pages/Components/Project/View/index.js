import {useParams} from "react-router-dom";
import ReplaceResponsiblePopup from "../../../admin/Pages/Projects/View/popup/ReplaceResponsiblePopup";
import AnalystOptionsPopup from "../../../admin/Pages/Projects/View/popup/AnalystOptionsPopup";
import { BsThreeDots } from "react-icons/bs";
import {
    useCreateProjectMutation,
    useGetCreateProjectByIdQuery,
    useUpdateProjectMutation
} from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/userApi";
import React, {useEffect, useState} from "react";
import styles from "./style.module.css";
import Header from "./Header";
import Billing from "./Billing";
import Buttons from "./Buttons";

import { toast } from "react-toastify";


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

const ProjectView = ({ data }) => {

    const { id } = useParams();



    const { data:allData }=useGetAnalystsQuery();
    const analyst=allData?.data || [];
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

    const submitting = isCreating || isUpdating;

    // 📝 Component State
    const [project, setProject] = useState({ ...defaultData });
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberPopup, setShowMemberPopup] = useState(false);



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
                annexNumber:raw.annexNumber
            };

            setProject(mapped);
        }
    }, [data]);


    const handleSave = async () => {
        const actionPromise = id
            ? updateProject({ id, data: project }).unwrap()
            : createProject(project).unwrap();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: id ? "Se actualizează proiectul..." : "Se creează proiectul...",
                    success: id ? "Proiect actualizat!" : "Proiect creat!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Something went wrong!";
                        },
                    },
                },
                { autoClose: 3000 }
            );
        } catch (error) {
            console.error(error);
            // toast.promise already showed error
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

    return (
        <div className={styles.page}>

            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Detalii proiect (preluate automat din solicitare)
                    </h2>

                    {/* ================= ROW 1 ================= */}
                    <div className={styles.detailTop}>
                        <div className={styles.nameBlock}>
                            <span className={styles.label}>Denumire proiect</span>
                            <input
                                type="text"
                                className={styles.nameValueBox}
                                value={project.name}
                                onChange={handleFieldChange("name")}
                            />
                        </div>

                        <div className={styles.statusBlock}>

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
                                <div className={styles.chipMainPrimary} onClick={() => setShowPopup(true)}>
                                <span className={styles.chipPrimary}>{project.responsible} <span className={styles.moreDots}  ><BsThreeDots /></span></span>
                                </div>
                            </div>

                            <div className={styles.chipMainPrimary2}>
                                <span className={styles.chipLabel}>Analiști alocați:</span>
                                {project.team.map((member) => (

                                    <span key={member._id} className={styles.chipGhost} onClick={(e) => {
                                        e.stopPropagation(); // IMPORTANT
                                        setSelectedMember(member);
                                        setShowMemberPopup(true);
                                    }}>
                                        {member.name}
                                        <span className={styles.moreDots2}  ><BsThreeDots /></span>
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
                                type="number"
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

                {showPopup && (
                    <ReplaceResponsiblePopup
                        analysts={analyst}
                        currentResponsibleId={project.responsibleId}
                        onReplace={(newId) => {

                            const selected = analyst.find(a => a._id === newId);

                            if (!selected) return;

                            // ✅ UI UPDATE IMMEDIATELY
                            setProject(prev => ({
                                ...prev,
                                responsibleId: selected._id,
                                responsible: selected.name
                            }));

                            // 🔌 BACKEND UPDATE (recommended)
                            updateProject({
                                id: project._id,
                                data: {
                                    responsibleAnalyst: selected._id
                                }
                            });

                            setShowPopup(false);
                        }}
                        onRemove={() => {
                            setProject(prev => ({
                                ...prev,
                                responsibleId: "",
                                responsible: "—"
                            }));

                            updateProject({
                                id: project._id,
                                data: {
                                    responsibleAnalyst: null
                                }
                            });

                            setShowPopup(false);
                        }}
                        onClose={() => setShowPopup(false)}
                    />
                )}


                {showMemberPopup && selectedMember && (
                    <AnalystOptionsPopup
                        analysts={analyst}
                        onReplace={(newId) => {
                            console.log("Replace", selectedMember._id, "with", newId);

                            // UI update example
                            setProject(prev => ({
                                ...prev,
                                team: prev.team.map(m =>
                                    m._id === selectedMember._id
                                        ? analyst.find(a => a._id === newId)
                                        : m
                                )
                            }));

                            setShowMemberPopup(false);
                            setSelectedMember(null);
                        }}
                        onRemove={() => {
                            console.log("Remove", selectedMember._id);

                            setProject(prev => ({
                                ...prev,
                                team: prev.team.filter(m => m._id !== selectedMember._id)
                            }));

                            setShowMemberPopup(false);
                            setSelectedMember(null);
                        }}
                        onClose={() => {
                            setShowMemberPopup(false);
                            setSelectedMember(null);
                        }}
                    />
                )}



                {/* Billing Component */}
                <Billing billing={billingData} />

                {/* Save Button */}
                <Buttons
                    onSave={handleSave}
                    id={project._id}
                    isLoading={submitting}
                    onGoToTask={() => console.log("go to task clicked")}
                    onViewCosts={() => console.log("view costs clicked")}
                />

            </div>
        </div>
    );

}

export default ProjectView;
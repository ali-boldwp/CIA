import {useParams} from "react-router-dom";
import ReplaceResponsiblePopup from "../../../admin/Pages/Projects/View/popup/ReplaceResponsiblePopup";
import AnalystOptionsPopup from "../../../admin/Pages/Projects/View/popup/AnalystOptionsPopup";
import { useGetProjectFinancialStatesQuery }
    from "../../../../services/projectApi";

import { BsThreeDots } from "react-icons/bs";
import {
    useCreateProjectMutation,

    useUpdateProjectMutation
} from "../../../../services/projectApi";
import { useGetCategoriesQuery } from "../../../../services/categoryApi";

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

    const { id: projectId } = useParams();




    const { data:allData }=useGetAnalystsQuery();
    const analyst=allData?.data || [];
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const {
        data: financialResponse,
        isLoading: isBillingLoading,
        error: billingError
    } = useGetProjectFinancialStatesQuery(projectId, {
        skip: !projectId
    });

    const submitting = isCreating || isUpdating;

    // 📝 Component State
    const [project, setProject] = useState({ ...defaultData });
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberPopup, setShowMemberPopup] = useState(false);
    const [showAddAnalystPopup, setShowAddAnalystPopup] = useState(false);


    // Categories

    const { data: catRes, isLoading: catsLoading, isError: catsError } = useGetCategoriesQuery();
    const categories = Array.isArray(catRes?.data) ? catRes.data : [];

    const categoryOptions = categories.map((c) => ({
        id: String(c._id),
        name: c.name,
    }));




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
                    raw.responsibleAnalyst?.name || "—",

                responsibleId:
                    raw.responsibleAnalyst?._id || null,


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
        const payload = {
            projectName: project.name,
            projectSubject: project.subject,
            reportType: project.reportType,
            entityType: project.entityType,
            priority: project.priority,
            deliverableLanguage: project.language,
            projectDescription: project.description,

            deadline: project.deadline,
            currency: project.currency,
            contractNumber: project.contractNumber,
            annexNumber: project.annexNumber,
            contractInfo: project.contractNotes,
            referenceRequest: project.referenceRequest,
            internalNotes: project.internalNotes,

            clientName: project.clientName,
            clientContactPerson: project.contactPerson,
            clientPosition: project.contactRole,
            clientEmail: project.email,
            clientPhone: project.phone,

            // 🔴 MOST IMPORTANT
            responsibleAnalyst: project.responsibleId,
            assignedAnalysts: project.team.map(m => m._id),
        };

        try {
            await toast.promise(
                updateProject({ id: project._id, data: payload }).unwrap(),
                {
                    pending: "Se actualizează proiectul...",
                    success: "Proiect actualizat!",
                    error: "Eroare la actualizare",
                }
            );
        } catch (err) {
            console.error(err);
        }
    };



    const handleBack = () => {
        window.history.back();
    };

    const billingData = financialResponse?.data
        ? {
            price: financialResponse.data.pretProject,

            fixed: financialResponse.data.cheltuieliFixe,
            osint: financialResponse.data.cheltuieliOSINT,
            tesa: financialResponse.data.cheltuieliTESA,
            humint: financialResponse.data.supraveghereTehnica,
            other: financialResponse.data.alteCheltuieli,

            // ✅ STAFF = Angajați
            staff: financialResponse.data.cheltuieliAngajati,

            // ✅ TOTALS
            total: financialResponse.data.totalCheltuieli,
            margin: financialResponse.data.profit,
            percentage: financialResponse.data.profitPercentage,

            currency: financialResponse.data.currency,
        }
        : null;








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
                        Detalii proiect
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

                            <select
                                className={styles.metaValueBox}
                                value={project.entityType || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;

                                    setProject((prev) => ({
                                        ...prev,
                                        entityType: selectedId,
                                    }));

                                    console.log("Selected category Mongo ID:", selectedId);
                                }}
                                disabled={catsLoading}
                            >
                                <option value="">
                                    {catsLoading ? "Se încarcă..." : "Selectați tipul entității"}
                                </option>

                                {categoryOptions.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {catsError && (
                                <div style={{ fontSize: 12, marginTop: 6 }}>
                                    Nu s-au putut încărca categoriile.
                                </div>
                            )}
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

                                <span
                                    className={`${styles.chipGhostAddBtn} ${styles.addChip}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMember(null);
                                        setShowMemberPopup(true);
                                    }}
                                >
    +
</span>


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


                {showMemberPopup && (
                    <AnalystOptionsPopup
                        analysts={
                            selectedMember
                                ? analyst // EDIT → sab analysts
                                : analyst.filter(a =>
                                    !project.team.some(m => m._id === a._id)
                                ) // ADD → sirf unassigned
                        }

                        mode={selectedMember ? "edit" : "add"} // 👈 OPTIONAL (nice)

                        onReplace={(newId) => {
                            const selected = analyst.find(a => a._id === newId);
                            if (!selected) return;

                            setProject(prev => ({
                                ...prev,
                                team: selectedMember
                                    ? prev.team.map(m =>
                                        m._id === selectedMember._id ? selected : m
                                    )
                                    : [...prev.team, selected] // 👈 ADD MODE
                            }));

                            setShowMemberPopup(false);
                            setSelectedMember(null);
                        }}

                        onRemove={() => {
                            if (!selectedMember) return;

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
                {isBillingLoading && (
                    <div className={styles.card}>Se încarcă datele financiare…</div>
                )}

                {billingError && (
                    <div className={styles.card}>
                        Eroare la încărcarea datelor financiare
                    </div>
                )}

                {billingData && !isBillingLoading && (
                    <Billing billing={billingData} />
                )}

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
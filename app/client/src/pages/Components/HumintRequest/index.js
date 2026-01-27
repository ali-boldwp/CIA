import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RequestDetailForm from "./RequestDetailForm";
import ActionButtons from "./Button";
import ClarificationSectiom from "./ClarificationSectiom";
import clarificationStyles from "./Clarification.module.css";

import {
    useApproveHumintMutation,
    useRejectHumintMutation,
    useClarificationHumintMutation,
    useUpdateHumintMutation,
    useCreateClarificationMutation,
} from "../../../services/humintApi";

const ClarificationHistoryCard = ({ messages, currentUserId }) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        return null;
    }

    return (
        <div className={clarificationStyles.wrapper}>
            <div className={clarificationStyles.card}>
                <h3 className={clarificationStyles.title}>Istoric clarificări</h3>
                <p className={clarificationStyles.subtitle}>
                    Mesaje de clarificare între tine și analist.
                </p>

                <div className={clarificationStyles.chatThread}>
                    {messages.map((msg) => {
                        const id = msg._id;
                        const user = msg.userId || {};
                        const isOwn = user._id === currentUserId || msg.userId === currentUserId;
                        const name = user.name || (isOwn ? "Tu" : "Utilizator");
                        const rawDate = msg.createdAt;
                        let formattedDate = "";

                        if (rawDate) {
                            try {
                                formattedDate = new Date(rawDate).toLocaleString("ro-RO", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                            } catch {
                                formattedDate = rawDate;
                            }
                        }

                        return (
                            <div
                                key={id}
                                className={`${clarificationStyles.chatRow} ${
                                    isOwn ? clarificationStyles.chatRowOwn : clarificationStyles.chatRowOther
                                }`}
                            >
                                <div className={clarificationStyles.bubble}>
                                    <div className={clarificationStyles.bubbleHeader}>
                                        <span className={clarificationStyles.bubbleName}>{name}</span>
                                        {formattedDate && (
                                            <span className={clarificationStyles.bubbleTime}>
                                                {formattedDate}
                                            </span>
                                        )}
                                    </div>
                                    <div className={clarificationStyles.bubbleMessage}>
                                        {msg.clarificationText}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>
            </div>
        </div>
    );
};

const Index = ({ data, analystData, clarificationData, refetchClarifications }) => {
    const { id } = useParams();
    const [submitting, setSubmitting] = useState(false);
    const [isClarifyMode, setIsClarifyMode] = useState(false);

    const humint = data?.data;
    const analysts = analystData?.data || [];
    const clarifications = clarificationData?.data || [];
    const formRef = useRef(null);

    // Get current user ID
    let currentUserId = "";
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            currentUserId = parsed._id || parsed.id || "";
        }
    } catch (e) {
        console.error("Error getting user from localStorage:", e);
    }

    // Mutations
    const [approveHumint] = useApproveHumintMutation();
    const [rejectHumint] = useRejectHumintMutation();
    const [clarificationHumint] = useClarificationHumintMutation();
    const [updateHumint] = useUpdateHumintMutation();
    const [createClarification] = useCreateClarificationMutation();

    // Auto scroll to bottom when clarify mode is on
    useEffect(() => {
        if (isClarifyMode) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 100);
        }
    }, [isClarifyMode]);

    // Resolve analyst name
    const resolveAnalystName = (responsible) => {
        if (!responsible) return "";
        if (typeof responsible === "object" && responsible._id) {
            return responsible.name;
        }
        const found = analysts.find((a) => a._id === responsible);
        return found ? found.name : "";
    };

    const enrichedHumint = {
        ...humint,
        responsibleName: resolveAnalystName(humint?.responsible),
    };

    const getValuesWithoutValidation = () => {
        if (!formRef.current) return null;
        return formRef.current.getValues();
    };

    // Approve function
    const handleApprove = async () => {
        if (submitting) return;

        const values = getValuesWithoutValidation();
        if (!values) return;

        setSubmitting(true);
        const actionPromise = approveHumint(id).unwrap();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: "Se aprobă...",
                    success: "Aprobat!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la aprobare";
                        },
                    },
                },
                { autoClose: 3000 }
            );
        } catch (err) {
            console.error("Approve error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Reject function
    const handleReject = async () => {
        if (submitting) return;

        const values = getValuesWithoutValidation();
        if (!values) return;

        setSubmitting(true);
        const actionPromise = rejectHumint({
            id,
            feedback: values.managerFeedback || "",
        }).unwrap();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: "Se respinge...",
                    success: "Respins!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la respingere";
                        },
                    },
                },
                { autoClose: 3000 }
            );
        } catch (err) {
            console.error("Reject error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Show clarify box
    const handleShowClarifyBox = () => {
        const values = getValuesWithoutValidation();
        if (!values) return;
        setIsClarifyMode(true);
    };

    // Submit clarification
    const handleClarifySubmit = async (message) => {
        if (submitting || !message.trim()) return;

        const values = getValuesWithoutValidation();
        if (!values) return;

        setSubmitting(true);

        const actionPromise = (async () => {
            await clarificationHumint({
                id,
                feedback: message
            }).unwrap();

            await createClarification({
                humintId: id,
                clarificationText: message
            }).unwrap();

            await refetchClarifications();
        })();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: "Se trimit clarificările...",
                    success: "Solicitare trimisă!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la clarificări";
                        },
                    },
                },
                { autoClose: 3000 }
            );
        } catch (err) {
            console.error("Clarify error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Update function
    const handleUpdate = async () => {
        const values = getValuesWithoutValidation();
        if (!values) return;

        try {
            await updateHumint({
                id,
                data: values
            }).unwrap();
            toast.success("Actualizat cu succes!");
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Eroare la actualizare");
        }
    };

    // PRINT/PDF GENERATION FUNCTION - FIXED VERSION
    const handlePrint = async () => {
        const values = getValuesWithoutValidation();
        if (!values) {
            toast.error("Formular invalid");
            return;
        }

        try {
            const formData = new FormData();

            // Add form data as JSON
            formData.append("data", JSON.stringify({
                projectName: values.projectName || "",
                reportType: values.reportType || "",
                projectOwner: values.projectOwner || "",
                deadline: values.deadline || "",
                priority: values.priority || "",
                briefObjective: values.briefObjective || "",
                keyQuestions: values.keyQuestions || "",
                targets: values.targets || "",
                locations: values.locations || "",
                restrictions: values.restrictions || "",
                managerFeedback: values.managerFeedback || "",
                clarifications: clarifications || [],
            }));

            // Get files from form
            const files = formRef.current.getFiles ? formRef.current.getFiles() : [];

            // Add newly uploaded files (File objects)
            const newFiles = files.filter(file => file instanceof File);
            console.log("New files to upload:", newFiles.length);

            newFiles.forEach(file => {
                formData.append("files", file); // Important: same field name
            });

            // Add existing attachments from database
            const existingAttachments = humint?.attachments || [];
            console.log("Existing attachments:", existingAttachments.length);

            if (existingAttachments.length > 0) {
                formData.append("existingAttachments", JSON.stringify(existingAttachments));
            }

            // Log FormData contents for debugging
            console.log("FormData entries:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, value.name, value.size, value.type);
                } else {
                    console.log(`${key}:`, value);
                }
            }

            // Send request


            const res = await fetch("http://localhost:4000/api/v1/pdf/generate", {
                method: "POST",
                body: formData,
                // Note: Do NOT set Content-Type header for FormData
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server error:", errorText);
                throw new Error(`PDF generation failed: ${res.status} ${res.statusText}`);
            }

            // Get PDF as blob
            const blob = await res.blob();

            if (blob.size === 0) {
                throw new Error("PDF este gol");
            }

            // Open PDF in new tab
            const url = window.URL.createObjectURL(blob);
            const newWindow = window.open(url, "_blank");

            if (!newWindow) {
                // If popup blocked, download instead
                const link = document.createElement("a");
                link.href = url;
                link.download = "humint-brief.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            toast.success("PDF generat cu succes!");

        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error(`Eroare la generarea PDF-ului: ${err.message}`);
        }
    };

    return (
        <>
            <RequestDetailForm
                ref={formRef}
                humint={enrichedHumint}
                analysts={analysts}
                disabled={submitting}
            />

            {/* Clarification history */}
            <ClarificationHistoryCard
                messages={clarifications}
                currentUserId={currentUserId}
            />

            {/* Action buttons or clarification form */}
            {isClarifyMode ? (
                <ClarificationSectiom
                    onSubmit={handleClarifySubmit}
                    onCancel={() => setIsClarifyMode(false)}
                    disabled={submitting}
                />
            ) : (
                <ActionButtons
                    data={enrichedHumint}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClarify={handleShowClarifyBox}
                    onPrint={handlePrint}
                    onUpdate={handleUpdate}
                    disabled={submitting}
                />
            )}
        </>
    );
};

export default Index;
// HumintRequestDetail.js

import React, { useRef, useState, useEffect } from "react";
import Header from "./Header";
import RequestDetailForm from "./RequestDetailForm";
import ActionButtons from "./Button";
import ClarificationSectiom from "./ClarificationSectiom";
import clarificationStyles from "./Clarification.module.css";
import { useParams } from "react-router-dom";

import {
    useGetHumintByIdQuery,
    useApproveHumintMutation,
    useRejectHumintMutation,
    useClarificationHumintMutation,
    useUpdateHumintMutation,
    useGetClarificationsByHumintQuery,
    useCreateClarificationMutation,
} from "../../../services/humintApi";

import { useGetAnalystsQuery } from "../../../services/userApi";
import { toast } from "react-toastify";


// 🔹 SEPARATE CARD: shows messages only (if any)
const ClarificationHistoryCard = ({ messages, currentUserId }) => {
    const chatEndRef = useRef(null);



    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        return null; // koi message nahi -> card hi nahi dikhega
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
                        const isOwn =
                            user._id === currentUserId ||
                            msg.userId === currentUserId;

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
    const { id } = useParams(); // HUMINT id
    const [submitting, setSubmitting] = useState(false);

    // HUMINT detail

    const humint = data?.data;

    // analysts

    const analysts = analystData?.data || [];

    const formRef = useRef(null);

    // UI: actions vs clarify form
    const [isClarifyMode, setIsClarifyMode] = useState(false);

    // current user id (simple) - apne project ke mutabiq adjust kar sakte ho
    let currentUserId = "";
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            currentUserId = parsed._id || parsed.id || "";
        }
    } catch (e) {
        // ignore
    }

    // CLARIFICATIONS LIST (messages for chat card)


    const clarifications = clarificationData?.data || [];

    // MUTATIONS
    const [approveHumint] = useApproveHumintMutation();
    const [rejectHumint] = useRejectHumintMutation();
    const [clarificationHumint] = useClarificationHumintMutation();
    const [updateHumint] = useUpdateHumintMutation();
    const [createClarification] = useCreateClarificationMutation();

    // auto scroll jab clarify mode on ho (page bottom)
    useEffect(() => {
        if (isClarifyMode) {
            const timer = setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isClarifyMode]);

    // analyst resolve
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
        responsibleName: resolveAnalystName(humint.responsible),
    };

    const validateAndGetValues = () => {
        if (!formRef.current) return null;
        if (!formRef.current.submitForm()) return null;
        return formRef.current.getValues();
    };

    // Approve
    const handleApprove = async () => {
        if (submitting) return;

        const values = validateAndGetValues();
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
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    // Reject
    const handleReject = async () => {
        if (submitting) return;

        const values = validateAndGetValues();
        if (!values) return;

        setSubmitting(true);

        const actionPromise = rejectHumint({
            id,
            feedback: values.managerFeedback,
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
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // "Solicită clarificări" → form validate + clarify form open
    const handleShowClarifyBox = () => {
        const values = validateAndGetValues();
        if (!values) return;
        setIsClarifyMode(true);
    };

    // "Clarifică" → status + message save + refetch messages
    const handleClarifySubmit = async (message) => {
        if (submitting) return;

        const values = validateAndGetValues();
        if (!values) return;

        setSubmitting(true);

        const actionPromise = (async () => {
            await clarificationHumint({ id, feedback: message }).unwrap();
            await createClarification({ humintId: id, clarificationText: message }).unwrap();
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

            // optional: clarify box close after success
            // setIsClarifyMode(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    const handleUpdate = async () => {
        const values = validateAndGetValues();
        if (!values) return;

        try {
            await updateHumint({ id, data: values }).unwrap();
            toast("Actualizat!");
        } catch (err) {
            console.error(err);
            toast.error("Eroare la actualizare");
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

            {/* messages card */}
            <ClarificationHistoryCard
                messages={clarifications}
                currentUserId={currentUserId}
            />

            {/* actions vs clarify */}
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
                    onPrint={() => console.log("Print soon")}
                    disabled={submitting}
                />
            )}
        </>
    );
};

export default Index;

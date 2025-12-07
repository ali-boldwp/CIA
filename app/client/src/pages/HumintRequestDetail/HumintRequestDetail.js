// HumintRequestDetail.js

import React, { useRef, useState, useEffect } from "react";
import Header from "./Header";
import RequestDetailForm from "./RequestDetailForm";
import ActionButtons from "./Button";
import ClarificationSectiom from "./ClarificationSectiom";
import { useParams } from "react-router-dom";

import {
    useGetHumintByIdQuery,
    useApproveHumintMutation,
    useRejectHumintMutation,
    useClarificationHumintMutation,
    useUpdateHumintMutation,
    useGetClarificationsByHumintQuery,
    useCreateClarificationMutation,
} from "../../services/humintApi";

import { useGetAnalystsQuery } from "../../services/userApi";
import { toast } from "react-toastify";

const HumintRequestDetail = () => {
    const { id } = useParams(); // HUMINT id

    // HUMINT detail
    const { data, isLoading } = useGetHumintByIdQuery(id);
    const humint = data?.data;

    // analysts
    const { data: analystData } = useGetAnalystsQuery();
    const analysts = analystData?.data || [];

    const formRef = useRef(null);

    // UI: actions vs clarify chat
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

    // CLARIFICATIONS LIST (yehi fetch karega WhatsApp chat ke messages)
    const {
        data: clarificationData,
        refetch: refetchClarifications,
        isLoading: isClarificationsLoading,
    } = useGetClarificationsByHumintQuery(id);

    const clarifications = clarificationData?.data || [];

    // MUTATIONS
    const [approveHumint] = useApproveHumintMutation();
    const [rejectHumint] = useRejectHumintMutation();
    const [clarificationHumint] = useClarificationHumintMutation();
    const [updateHumint] = useUpdateHumintMutation();
    const [createClarification] = useCreateClarificationMutation();

    // auto scroll jab clarify mode on ho
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

    if (isLoading || !humint) {
        return <h2 style={{ padding: 20 }}>Loading HUMINT…</h2>;
    }

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
        const values = validateAndGetValues();
        if (!values) return;

        try {
            await approveHumint(id).unwrap();
            toast("Aprobat!");
        } catch (err) {
            console.error(err);
            toast("Eroare la aprobare");
        }
    };

    // Reject
    const handleReject = async () => {
        const values = validateAndGetValues();
        if (!values) return;

        try {
            await rejectHumint({
                id,
                feedback: values.managerFeedback,
            }).unwrap();

            toast("Respins!");
        } catch (err) {
            console.error(err);
            toast.error("Eroare la respingere");
        }
    };

    // "Solicită clarificări" → form validate + chat open
    const handleShowClarifyBox = () => {
        const values = validateAndGetValues();
        if (!values) return;
        setIsClarifyMode(true);
    };

    // "Clarifică" → status + message save + refetch messages
    const handleClarifySubmit = async (message) => {
        const values = validateAndGetValues();
        if (!values) return;

        try {
            // 1) HUMINT status ko "Clarification" + feedback update
            await clarificationHumint({
                id,
                feedback: message,
            }).unwrap();

            // 2) Clarification collection me chat message save
            await createClarification({
                humintId: id,
                clarificationText: message,
            }).unwrap();

            // 3) latest list fetch
            await refetchClarifications();

            toast("Solicitare trimisă!");
        } catch (err) {
            console.error(err);
            toast.error("Eroare la clarificări");
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
            <Header />

            <RequestDetailForm
                ref={formRef}
                humint={enrichedHumint}
                analysts={analysts}
            />

            {isClarifyMode ? (
                <ClarificationSectiom
                    onSubmit={handleClarifySubmit}
                    onCancel={() => setIsClarifyMode(false)}
                    messages={clarifications}
                    currentUserId={currentUserId}
                />
            ) : (
                <ActionButtons
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClarify={handleShowClarifyBox}
                    onPrint={() => console.log("Print soon")}
                />
            )}
        </>
    );
};

export default HumintRequestDetail;

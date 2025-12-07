// HumintRequestDetail.js

import React, { useRef, useState , useEffect } from "react";
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
    useUpdateHumintMutation
} from "../../services/humintApi";

import { useGetAnalystsQuery } from "../../services/userApi";
import { toast } from "react-toastify";

const HumintRequestDetail = () => {
    const { id } = useParams();

    const { data, isLoading } = useGetHumintByIdQuery(id);
    const humint = data?.data;

    const { data: analystData } = useGetAnalystsQuery();
    const analysts = analystData?.data || [];

    const formRef = useRef(null);

    // 🔹 UI state: show action buttons or clarification box
    const [isClarifyMode, setIsClarifyMode] = useState(false);

    // API MUTATIONS
    const [approveHumint] = useApproveHumintMutation();
    const [rejectHumint] = useRejectHumintMutation();
    const [clarificationHumint] = useClarificationHumintMutation();
    const [updateHumint] = useUpdateHumintMutation();

    useEffect(() => {
        if (isClarifyMode) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [isClarifyMode]);

    // Analyst resolver (works with object or ID)
    const resolveAnalystName = (responsible) => {
        if (!responsible) return "";

        if (typeof responsible === "object" && responsible._id) {
            return responsible.name;
        }

        const found = analysts.find(a => a._id === responsible);
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
                feedback: values.managerFeedback
            }).unwrap();

            toast("Respins!");
        } catch (err) {
            console.error(err);
            toast.error("Eroare la respingere");
        }
    };

    // 🔹 Step 1: user ne "Solicită clarificări" dabaya → box show karo
    const handleShowClarifyBox = () => {
        const values = validateAndGetValues();
        if (!values) return;
        setIsClarifyMode(true);
    };

    // 🔹 Step 2: Clarificare submit hui → API call
    const handleClarifySubmit = async (message) => {
        // optional: form dobara validate karna hai to:
        const values = validateAndGetValues();
        if (!values) return;

        try {
            await clarificationHumint({
                id,
                feedback: message || values.managerFeedback || ""
            }).unwrap();

            toast("Solicitare trimisă!");
            setIsClarifyMode(false);
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

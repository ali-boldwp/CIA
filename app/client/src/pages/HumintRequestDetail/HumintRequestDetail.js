// HumintRequestDetail.js

import React, { useRef } from "react";
import Header from "./Header";
import RequestDetailForm from "./RequestDetailForm";
import ActionButtons from "./Button";
import { useParams } from "react-router-dom";

import {
    useGetHumintByIdQuery,
    useApproveHumintMutation,
    useRejectHumintMutation,
    useClarificationHumintMutation,
    useUpdateHumintMutation
} from "../../services/humintApi";

import { useGetAnalystsQuery } from "../../services/userApi";
import {toast} from "react-toastify";

const HumintRequestDetail = () => {
    const { id } = useParams();

    const { data, isLoading } = useGetHumintByIdQuery(id);
    const humint = data?.data;

    const { data: analystData } = useGetAnalystsQuery();
    const analysts = analystData?.data || [];

    const formRef = useRef(null);

    // API MUTATIONS
    const [approveHumint] = useApproveHumintMutation();
    const [rejectHumint] = useRejectHumintMutation();
    const [clarificationHumint] = useClarificationHumintMutation();
    const [updateHumint] = useUpdateHumintMutation();

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

    // Clarification
    const handleClarify = async () => {
        const values = validateAndGetValues();
        if (!values) return;

        try {
            await clarificationHumint({
                id,
                feedback: values.managerFeedback
            }).unwrap();

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

            <ActionButtons
                onApprove={handleApprove}
                onReject={handleReject}
                onClarify={handleClarify}
                onPrint={() => console.log("Print soon")}
            />
        </>
    );
};

export default HumintRequestDetail;

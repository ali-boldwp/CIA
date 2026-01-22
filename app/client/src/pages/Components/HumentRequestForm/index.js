import React, { useRef, useState } from "react";
import Header from "./Header";
import RequestForm from "./RequestForm";
import { useGetCreateProjectByIdQuery } from "../../../services/projectApi";
import { useCreateHumintMutation } from "../../../services/humintApi";
import Button from "./Button";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAnalystsQuery } from "../../../services/userApi";

const Index = () => {
    const { id } = useParams();
    const location = useLocation();
    const state = location.state || {};

    const isIndependent = state?.humintType === "independent";
    const independentData = state?.data || null;

    const formRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);

    const [createHumint] = useCreateHumintMutation();

    const { data: analystData } = useGetAnalystsQuery();
    const analysts = analystData?.data || [];

    // PROJECT-BASED FETCH
    const { data: projectData } = useGetCreateProjectByIdQuery(id, {
        skip: isIndependent || !id,
    });

    const projects = projectData?.data || {};

    // helper: build FormData with payload + files
    const buildFormData = (payload, files = []) => {
        const formData = new FormData();

        // send JSON payload as string
        formData.append("data", JSON.stringify(payload));

        // send files
        files.forEach((file) => {
            formData.append("attachments", file); // key name: attachments
        });

        return formData;
    };

    // ========================================================================
    // HANDLE APPROVE
    // ========================================================================
    const handleApprove = async () => {
        if (submitting) return;

        const ok = formRef.current?.submitForm();
        if (!ok) return;

        const formValues = formRef.current.getValues();
        const files = formRef.current.getFiles?.() || [];
        const userId = localStorage.getItem("userId");

        let payload = {};

        if (isIndependent) {
            payload = {
                ...independentData,
                ...formValues,
                createdBy: userId,
                status: "Requested",
                isLinkedToProject: false,
            };
        } else {
            payload = {
                projectId: id,
                ...formValues,
                createdBy: userId,
                status: "Requested",
                responsible: projects?.responsibleAnalyst?._id,
                isLinkedToProject: true,
            };
        }

        setSubmitting(true);

        const formData = buildFormData(payload, files);
        const actionPromise = createHumint(formData).unwrap();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: "Se trimite cererea HUMINT...",
                    success: "Cererea HUMINT trimisă!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la trimiterea cererii!";
                        },
                    },
                },
                { autoClose: 3000 }
            );

            // ✅ CLEAR FORM AFTER SUCCESSFUL SUBMISSION
            formRef.current?.clearForm();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    // ========================================================================
    // HANDLE SAVE DRAFT
    // ========================================================================
    const handleSaveDraft = async () => {
        if (submitting) return;

        const ok = formRef.current?.submitForm();
        if (!ok) return;

        const values = formRef.current.getValues();
        const files = formRef.current.getFiles?.() || [];
        const userId = localStorage.getItem("userId");

        const payload = {
            projectId: id,
            ...values,
            createdBy: userId,
            responsible: projects?.responsibleAnalyst?._id,
            status: "Draft",
        };

        setSubmitting(true);

        const formData = buildFormData(payload, files);
        const actionPromise = createHumint(formData).unwrap();

        try {
            await toast.promise(
                actionPromise,
                {
                    pending: "Se salvează draft-ul...",
                    success: "Draft salvat cu succes!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la salvarea draftului!";
                        },
                    },
                },
                { autoClose: 3000 }
            );

            // ✅ CLEAR FORM AFTER SUCCESSFUL DRAFT SAVE (optional)
            // formRef.current?.clearForm(); // Uncomment if you want to clear after draft save too
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <RequestForm
                ref={formRef}
                projects={isIndependent ? null : projects}
                independent={isIndependent}
                independentData={independentData}
                analysts={analysts}
                disabled={submitting}
            />

            {/*<Button*/}
            {/*    onApprove={handleApprove}*/}
            {/*    onSaveDraft={handleSaveDraft}*/}
            {/*    onGenerateBrief={() => console.log("Generate brief")}*/}
            {/*    disabled={submitting}*/}
            {/*/>*/}
        </>
    );
};

export default Index;
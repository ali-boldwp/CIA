import React, { useRef } from "react";
import Header from "./Header";
import RequestForm from "./RequestForm";
import { useGetCreateProjectByIdQuery } from "../../services/projectApi";
import { useCreateHumintMutation } from "../../services/humintApi";
import Button from "./Button";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {useGetAnalystsQuery} from "../../services/userApi";

const HumintRequestForm = () => {

    const { id } = useParams();
    const location = useLocation();
    const state = location.state || {};

    const isIndependent = state?.humintType === "independent";
    const independentData = state?.data || null;

    const formRef = useRef(null);

    const [createHumint] = useCreateHumintMutation();

    const { data: analystData } = useGetAnalystsQuery();
    const analysts = analystData?.data || [];


    // PROJECT-BASED FETCH
    const { data: projectData } = useGetCreateProjectByIdQuery(id, {
        skip: isIndependent || !id,
    });

    const projects = projectData?.data || {};

    // ========================================================================
    // HANDLE APPROVE
    // ========================================================================
    const handleApprove = async () => {
        const ok = formRef.current?.submitForm();
        if (!ok) return;

        const formValues = formRef.current.getValues();
        const userId = localStorage.getItem("userId");

        let payload = {};

        if (isIndependent) {
            // 🔥 Independent HUMINT Payload
            payload = {
                ...independentData,
                ...formValues,
                createdBy: userId,
                status: "Pending",
                isLinkedToProject: false
            };
        }
        else {
            // 🔥 Project-Based HUMINT Payload
            payload = {
                projectId: id,
                ...formValues,
                createdBy: userId,
                responsible: projects?.responsibleAnalyst?._id,
                isLinkedToProject: true
            };
        }

        try {
            await createHumint(payload).unwrap();
            toast.success("Cererea HUMINT trimisă!");
        } catch (error) {
            console.error(error);
            toast.error("Eroare la trimiterea cererii!");
        }
    };

    // ========================================================================
    // HANDLE SAVE DRAFT
    // ========================================================================
    const handleSaveDraft = async () => {
        const values = formRef.current.getValues();
        const userId = localStorage.getItem("userId");

        const payload = {
            projectId: id,
            ...values,
            createdBy: userId,
            responsible: projects.responsibleAnalyst?._id,
            status: "Draft"
        };

        try {
            await createHumint(payload).unwrap();
            toast.success("Draft salvat cu succes!");
        } catch (error) {
            console.error(error);
            toast.error("Eroare la salvarea draftului!");
        }
    };

    return (
        <>
            <Header />

            <RequestForm
                ref={formRef}
                projects={isIndependent ? null : projects}
                independent={isIndependent}
                independentData={independentData}
                analysts={analysts}
            />

            <Button
                onApprove={handleApprove}
                onSaveDraft={handleSaveDraft}
                onGenerateBrief={() => console.log("Generate brief")}
            />
        </>
    );
};

export default HumintRequestForm;

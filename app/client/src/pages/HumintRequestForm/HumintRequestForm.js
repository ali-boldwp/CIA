import React, { useRef } from "react";
import Header from "./Header";
import RequestForm from "./RequestForm";
import { useGetCreateProjectByIdQuery } from "../../services/projectApi";
import { useCreateHumintMutation } from "../../services/humintApi";
import Button from "./Button";
import { useParams } from "react-router-dom";
import {toast} from "react-toastify";

const HumintRequestForm = () => {
    const {id}=useParams();
    const [createHumint,isLoading]=useCreateHumintMutation();
    const { data:projectData}=useGetCreateProjectByIdQuery(id, {
        skip: !id,
    })
    const projects=projectData?.data || { };
    const formRef = useRef(null);



    const handleApprove = async () => {

        const ok = formRef.current?.submitForm();
        if (!ok) return;

        const values = formRef.current.getValues();
        const userId = localStorage.getItem("userId");

        const mapPriority = {
            "Normal": "Normal",
            "Ridicată": "High",
            "Urgentă": "Urgent",
            "Confidențial": "Confidential"
        };


        try {
            const response = await createHumint({
                projectId: id,

                // raw values first
                ...values,

                // overwrite with backend-required fields
                createdBy: userId,
                responsible: projects.responsibleAnalyst?._id,
                priority: mapPriority[values.priority],
            }).unwrap();

            toast.success("Cererea HUMINT a fost trimisă spre aprobare!");
        } catch (error) {
            console.error("HUMINT error:", error);
            toast.error("A apărut o eroare la trimiterea cererii!");
        }
    };




    const handleSaveDraft = async () => {
        const values = formRef.current.getValues();
        const userId = localStorage.getItem("userId");

        try {
            const response = await createHumint({
                projectId: id,
                ...values,
                createdBy: userId,
                responsible: projects.responsibleAnalyst?._id,
                status: "Draft",
                isDraft: true, // optional but useful
            }).unwrap();

            toast.success("Draft salvat cu succes!");
        } catch (error) {
            console.error("Draft error:", error);
            toast.error("A apărut o eroare la salvarea draftului!");
        }
    };


    const handleGenerateBrief = () => {
        // printable brief generate karne ka logic yahan
        console.log("Generează brief printabil clicked");
    };

    return (
        <>
            <Header />
            <RequestForm projects={projects} ref={formRef} />
            <Button
                onApprove={handleApprove}
                onSaveDraft={handleSaveDraft}
                onGenerateBrief={handleGenerateBrief}
            />
        </>
    );
};

export default HumintRequestForm;

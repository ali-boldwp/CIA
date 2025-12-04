import React, { useRef } from "react";
import Header from "./Header";
import RequestForm from "./RequestForm";
import Button from "./Button";

const HumintRequestForm = () => {
    const formRef = useRef(null);

    const handleApprove = () => {
        // RequestForm ke exposed method ko call kar rahe hain
        const ok = formRef.current?.submitForm();
        if (ok) {
            // yahan actual "Trimite spre aprobare" ka API / navigation logic
            console.log("Trimite spre aprobare: form valid, send to backend...");
        }
    };

    const handleSaveDraft = () => {
        // baad mein draft logic add kar sakte ho
        console.log("Salvează draft clicked");
    };

    const handleGenerateBrief = () => {
        // printable brief generate karne ka logic yahan
        console.log("Generează brief printabil clicked");
    };

    return (
        <>
            <Header />
            <RequestForm ref={formRef} />
            <Button
                onApprove={handleApprove}
                onSaveDraft={handleSaveDraft}
                onGenerateBrief={handleGenerateBrief}
            />
        </>
    );
};

export default HumintRequestForm;

// /home/ubaid/workspace/app/client/src/pages/HumintRequestDetail/HumintRequestDetail.js

import React, { useRef } from "react";
import Header from "./Header";
import RequestDetailForm from "./RequestDetailForm";
import ActionButtons from "./Button";

const HumintRequestDetail = () => {
    const formRef = useRef(null);

    const validateAndGetValues = () => {
        if (!formRef.current) return null;
        const ok = formRef.current.submitForm();
        if (!ok) return null;
        return formRef.current.getValues();
    };

    const handleApprove = () => {
        const values = validateAndGetValues();
        if (!values) return;
        console.log("APPROBA:", values);
        // TODO: yahan approve API call lagao
    };

    const handleReject = () => {
        const values = validateAndGetValues();
        if (!values) return;
        console.log("RESPINGE:", values);
        // TODO: yahan reject API call lagao
    };

    const handleClarify = () => {
        const values = validateAndGetValues();
        if (!values) return;
        console.log("SOLICITĂ CLARIFICĂRI:", values);
        // TODO: yahan clarificari request API call lagao
    };

    const handlePrintBrief = () => {
        const values = validateAndGetValues();
        if (!values) return;
        console.log("GENEREAZĂ BRIEF PRINTABIL:", values);
        // TODO: yahan printable brief generate / open karna hai
    };

    return (
        <>
            <Header />
            <RequestDetailForm ref={formRef} />

            <ActionButtons
                onApprove={handleApprove}
                onReject={handleReject}
                onClarify={handleClarify}
                onPrint={handlePrintBrief}
            />
        </>
    );
};

export default HumintRequestDetail;

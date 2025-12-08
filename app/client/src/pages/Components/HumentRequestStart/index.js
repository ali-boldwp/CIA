// /home/ubaid/workspace/app/client/src/pages/Humint/Humint.js

import React, { useState } from "react";
import Header from "./Header";
import CheckboxSection from "./CheckboxSection";

import ProjectBasePopUp from "./ProjectBasePopUp";
import CustumPopUp from "./CustumPopUp";

const HumentRequestForm = () => {

    const [selectedType, setSelectedType] = useState("existing");

    return (
        <>
            {/* HEADER */}
            <Header />

            {/* CHECKBOX SECTION */}
            <CheckboxSection
                value={selectedType}
                onChange={(val) => setSelectedType(val)}
            />

            {/* SECTION 3 — CONDITIONAL RENDER */}
            {selectedType === "existing" ? (
                <ProjectBasePopUp />
            ) : (
                <CustumPopUp />
            )}
        </>
    );
};

export default HumentRequestForm;

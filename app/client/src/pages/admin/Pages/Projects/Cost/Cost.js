import "./style.css";
import { useState } from "react";
import AddEmployeeCostPopup from "./PopUp/AddEmployeeCostPopup/AddEmployeeCostPopup";
import AddHumintCostPopup from "./PopUp/AddHumintCostPopup/AddHumintCostPopup";
import SummarySection from "./Component/SummarySection/SummaaySection";
import CostBar from "./Component/CostBar/CostBar";
import EmployeeCostTable from "./Component/EmployeeCostTable/EmployeeCostTable";
import HumintCostTable from "./Component/HumintCostTable/HumintCostTable";
import ButtonSection from "./Component/FooterButton/ButtonSection";

const ProjectCost = ({ data }) => {
    // State for popups visibility
    const [showEmployeePopup, setShowEmployeePopup] = useState(false);
    const [showHumintPopup, setShowHumintPopup] = useState(false);

    // Function to handle saving employee cost
    const handleSaveEmployeeCost = (data) => {
        console.log("Employee cost data saved:", data);
        // Add your save logic here
    };

    // Function to handle saving HUMINT cost
    const handleSaveHumintCost = (data) => {
        console.log("HUMINT cost data saved:", data);
        // Add your save logic here
    };

    // Function to handle save all changes
    const handleSaveAll = () => {
        console.log("Saving all changes...");
        // Add your save all logic here
        // Example: Save employee changes, HUMINT changes, etc.
    };

    // Function to handle back to project page
    const handleBackToProject = () => {
        console.log("Navigating back to project page...");
        // Add navigation logic here
        // Example: window.location.href = "/project-page";
    };

    return (
        <div className="page-wrapper">
            <div className="page-container">
                {/* REMOVED HEADER SECTION */}

                {/* TOP ROW: PROJECT DETAILS + FINANCIAL SUMMARY */}
                <SummarySection /> {/* Using the SummarySection component */}

                {/* FIXED COSTS + OSINT COSTS BAR */}
                <CostBar /> {/* Using the CostBar component */}

                {/* EMPLOYEE COSTS TABLE */}
                <EmployeeCostTable
                    onAddCost={() => setShowEmployeePopup(true)}
                />

                {/* HUMINT COSTS TABLE */}
                <HumintCostTable
                    onAddCost={() => setShowHumintPopup(true)}
                />

                {/* PAGE FOOTER BUTTONS - Using ButtonSection component */}
                <ButtonSection
                    onSave={handleSaveAll}
                    onBack={handleBackToProject}
                    saveButtonText="Salvează modificări"
                    backButtonText="Înapoi la Pagina Proiect"
                    saveButtonColor="#10B981"
                    showSaveButton={true}
                    showBackButton={true}
                />
            </div>

            {/* EMPLOYEE COST POPUP */}
            <AddEmployeeCostPopup
                isOpen={showEmployeePopup}
                onClose={() => setShowEmployeePopup(false)}
                onSave={handleSaveEmployeeCost}
            />

            {/* HUMINT COST POPUP */}
            <AddHumintCostPopup
                isOpen={showHumintPopup}
                onClose={() => setShowHumintPopup(false)}
                onSave={handleSaveHumintCost}
            />
        </div>
    )
}

export default ProjectCost;
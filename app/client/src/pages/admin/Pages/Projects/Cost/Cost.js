import "./style.css";
import { useState, useEffect } from "react";
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

    // State for employee total cost
    const [employeeTotalCost, setEmployeeTotalCost] = useState(0);

    // Extract projectId from data prop
    const projectId = data?.data?._id || data?._id || "693c081dc1bd09040f202cda";

    console.log("Cost.js - Project ID:", projectId);
    console.log("Employee Total Cost:", employeeTotalCost);

    // Function to handle saving employee cost
    const handleSaveEmployeeCost = (data) => {
        console.log("Employee cost data saved:", data);
    };

    // Function to handle saving HUMINT cost
    const handleSaveHumintCost = (data) => {
        console.log("HUMINT cost data saved:", data);
    };

    // Function to handle save all changes
    const handleSaveAll = () => {
        console.log("Saving all changes...");
    };

    // Function to handle back to project page
    const handleBackToProject = () => {
        console.log("Navigating back to project page...");
    };

    // Function to update employee total cost
    const handleEmployeeTotalCostUpdate = (cost) => {
        setEmployeeTotalCost(cost);
    };

    return (
        <div className="page-wrapper">
            <div className="page-container">
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px 15px',
                    marginBottom: '15px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#333' }}>
                                {data?.data?.projectName || "Project Cost Management"}
                            </h3>
                            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                Project ID: <strong>{projectId}</strong>
                                {data?.data?.projectName && ` | ${data.data.projectName}`}
                            </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#28a745', backgroundColor: '#d4edda', padding: '3px 8px', borderRadius: '4px' }}>
                            Status: {data?.data?.status || 'Active'}
                        </div>
                    </div>
                </div>

                <SummarySection
                    projectId={projectId}
                    projectData={data?.data}
                    employeeTotalCost={employeeTotalCost}
                />

                <CostBar projectId={projectId} />

                <EmployeeCostTable
                    projectId={projectId}
                    onAddCost={() => setShowEmployeePopup(true)}
                    projectData={data?.data}
                    onTotalCostUpdate={handleEmployeeTotalCostUpdate}
                />

                <HumintCostTable
                    projectId={projectId}
                    onAddCost={() => setShowHumintPopup(true)}
                />

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

            <AddEmployeeCostPopup
                isOpen={showEmployeePopup}
                onClose={() => setShowEmployeePopup(false)}
                onSave={handleSaveEmployeeCost}
                projectId={projectId}
            />

            <AddHumintCostPopup
                isOpen={showHumintPopup}
                onClose={() => setShowHumintPopup(false)}
                onSave={handleSaveHumintCost}
                projectId={projectId}
            />
        </div>
    )
}

export default ProjectCost;
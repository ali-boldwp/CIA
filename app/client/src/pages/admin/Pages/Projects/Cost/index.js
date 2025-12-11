import "./style.css";
import { useState } from "react";
import AddEmployeeCostPopup from "./PopUp/AddEmployeeCostPopup/AddEmployeeCostPopup";
import AddHumintCostPopup from "./PopUp/AddHumintCostPopup/AddHumintCostPopup";
import SummarySection from "./SummarySection/SummaaySection";
import CostBar from "./CostBar/CostBar";

import EmployeeCostTable from "./EmployeeCostTable/EmployeeCostTable"; // Import the new component

import { useGetHumintExpensesQuery, useGetHumintTotalsQuery }
    from "../../../../../services/humintExpanseApi";



const ProjectCost = () => {

    const { data: humintExpenses, isLoading: loadingHumint } = useGetHumintExpensesQuery();
    const { data: humintTotals } = useGetHumintTotalsQuery();

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

    return (
        <div className="page-wrapper">
            <div className="page-container">
                {/* REMOVED HEADER SECTION */}

                {/* TOP ROW: PROJECT DETAILS + FINANCIAL SUMMARY */}
                <SummarySection /> {/* Using the new component */}

                {/* FIXED COSTS + OSINT COSTS BAR */}
                <CostBar /> {/* Using the new CostBar component */}

                {/* EMPLOYEE COSTS TABLE - Now dynamic */}
                <EmployeeCostTable
                    onAddCost={() => setShowEmployeePopup(true)}
                />

                {/* HUMINT COSTS */}
                {/* HUMINT COSTS */}
                <div className="form-card">
                    <h2 className="form-title">Cheltuieli HUMINT</h2>

                    <table className="cost-table">
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descriere</th>
                            <th>Utilitate</th>
                            <th>Cash</th>
                            <th>Taxe</th>
                            <th>Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        {loadingHumint ? (
                            <tr><td colSpan="6">Loading...</td></tr>
                        ) : humintExpenses?.data?.length > 0 ? (
                            humintExpenses.data.map(exp => (
                                <tr key={exp._id}>
                                    <td>{exp.date?.slice(0,10)}</td>
                                    <td>{exp.description}</td>
                                    <td>{exp.utility}/5</td>
                                    <td>{exp.cost} {exp.currency}</td>
                                    <td>{exp.taxIncludedCost - exp.cost} {exp.currency}</td>
                                    <td>{exp.total} {exp.currency}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6">Nicio cheltuială HUMINT încă</td></tr>
                        )}
                        </tbody>
                    </table>

                    {/* TOTAL HUMINT COST */}
                    <div className="total-box">
                        Total HUMINT:
                        {humintTotals?.totals?.EUR
                            ? ` ${humintTotals.totals.EUR.toFixed(2)} EUR`
                            : ""}
                    </div>


                    {/* ADD HUMINT COST BUTTON */}
                    <button className="btn-green" onClick={() => setShowHumintPopup(true)}>
                        Adaugă cheltuiala
                    </button>
                </div>


                {/* PAGE FOOTER BUTTONS */}
                <div className="button-row footer-row">
                    <button className="btn-secondary" style={{"background":"#10B981"}}>Salvează modificări</button>
                    <button className="btn-primary">Înapoi la Pagina Proiect</button>
                </div>
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
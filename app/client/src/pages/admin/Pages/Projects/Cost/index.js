import "./style.css";
import { useState } from "react";
import AddEmployeeCostPopup from "./PopUp/AddEmployeeCostPopup/AddEmployeeCostPopup";
import AddHumintCostPopup from "./PopUp/AddHumintCostPopup/AddHumintCostPopup";

const ProjectCost = () => {
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
                <div className="top-row">
                    {/* LEFT: PROJECT DETAILS */}
                    <div className="form-card project-card">
                        <h2 className="form-title">Detalii proiect</h2>

                        <div className="project-block">
                            <ul>
                                <li>
                                    <b>Denumire proiect</b>
                                    <span>Due Diligence: Societatea ABC</span>
                                </li>
                                <li>
                                    <b>Tip raport</b>
                                    <span>Enhanced Due Diligence</span>
                                </li>
                                <li>
                                    <b>Tip entitate / caz</b>
                                    <span>Societate</span>
                                </li>
                                <li>
                                    <b>Nume client</b>
                                    <span>ZZZ SRL</span>
                                </li>
                                <li>
                                    <b>Responsabil proiect</b>
                                    <span>Analist C</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT: FINANCIAL SUMMARY */}
                    <div className="form-card finance-card">
                        <div className="finance-header">
                            <h2 className="form-title">Rezumat financiar</h2>
                            <button className="currency-update-btn">
                                Curs EURO (BNR) actualizat
                            </button>
                        </div>

                        <div className="financial-grid">
                            {/* Row 1 - First 4 boxes */}
                            <div className="summary-box box-gray">
                                <span className="s-label">Cheltuieli angajați Supraveghere</span>
                                <span className="s-value">1050 EUR</span>
                            </div>

                            <div className="summary-box box-tfsa">
                                <span className="s-label">Cheltuieli TFSA</span>
                                <span className="s-value">1050 EUR</span>
                            </div>

                            <div className="summary-box box-cyan">
                                <span className="s-label">Cheltuieli OSINT Tehnică</span>
                                <span className="s-value">150 EUR</span>
                            </div>

                            <div className="summary-box box-yellow">
                                <span className="s-label">Cheltuieli HUMINT (cu taxe)</span>
                                <span className="s-value">554.4 EUR</span>
                            </div>

                            {/* Row 2 - Next 4 boxes */}
                            <div className="summary-box box-blue">
                                <span className="s-label">Cheltuieli fixe</span>
                                <span className="s-value">300 EUR</span>
                            </div>

                            <div className="summary-box box-other">
                                <span className="s-label">Alte cheltuieli</span>
                                <span className="s-value">300 EUR</span>
                            </div>

                            <div className="summary-box box-purple">
                                <span className="s-label">Preț proiect</span>
                                <span className="s-value">3500 EUR</span>
                            </div>

                            <div className="summary-box box-lightgray">
                                <span className="s-label">Total cheltuieli</span>
                                <span className="s-value">2054.4 EUR</span>
                            </div>

                            {/* Row 3 - Last 2 boxes (each spanning 2 columns) */}
                            <div className="summary-box box-profit">
                                <div className="profit-left">
                                    <span className="s-label-green">Profit</span>
                                    <span className="profit-right">41.3%</span>
                                </div>
                                <div className="s-value">1445.6 EUR</div>
                            </div>

                            <div className="summary-box box-duration">
                                <span className="s-label-duration">Durata proiect (zile lucrătoare)</span>
                                <span className="s-value-duration">25 zile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FIXED COSTS + OSINT COSTS BAR */}
                <div className="form-card costs-bar">
                    <div className="cost-block">
                        <h2 className="cost-title">Cheltuieli fixe</h2>

                        <div className="cost-row">
                            <div className="form-field">
                                <label>Cheltuieli totale (editabil)</label>
                                <input className="input-box" defaultValue="180 EUR" />
                            </div>

                            <div className="form-field small-field">
                                <label>Monedă</label>
                                <input className="input-box" defaultValue="EUR ▾" />
                            </div>
                        </div>
                    </div>

                    <div className="cost-block">
                        <h2 className="cost-title">Cheltuieli OSINT</h2>

                        <div className="cost-row">
                            <div className="form-field">
                                <label>Cheltuieli totale (editabil)</label>
                                <input className="input-box" defaultValue="180 EUR" />
                            </div>

                            <div className="form-field small-field">
                                <label>Monedă</label>
                                <input className="input-box" defaultValue="EUR ▾" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* EMPLOYEE COSTS TABLE */}
                <div className="form-card">
                    <h2 className="form-title">Cheltuieli cu angajații (timp & cost)</h2>

                    <table className="cost-table">
                        <thead>
                        <tr>
                            <th>Analist</th>
                            <th>Rol</th>
                            <th>Zile</th>
                            <th>Ore</th>
                            <th>Cost/ora</th>
                            <th>Cost/zi</th>
                            <th>Total</th>
                            <th>Editare</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Analist A</td>
                            <td>Lead OSINT</td>
                            <td>2.5</td>
                            <td>20</td>
                            <td>30 EUR</td>
                            <td>240 EUR</td>
                            <td>600 EUR</td>
                            <td className="edit-cell">📎 Modifică</td>
                        </tr>

                        <tr>
                            <td>Analist C</td>
                            <td>OSINT</td>
                            <td>Automat / 8</td>
                            <td>
                                <input className="input-cell" defaultValue="8" />
                            </td>
                            <td>35 EUR</td>
                            <td>280 EUR</td>
                            <td>280 EUR</td>
                            <td className="edit-cell">✔ Salvează × Anulează</td>
                        </tr>

                        <tr>
                            <td>Analist E</td>
                            <td>OSINT</td>
                            <td>0.5</td>
                            <td>4</td>
                            <td>25 EUR</td>
                            <td>200 EUR</td>
                            <td>100 EUR</td>
                            <td className="edit-cell">📎 Modifică</td>
                        </tr>
                        </tbody>
                    </table>

                    {/* Blank strip under table */}
                    <div className="table-empty-strip" />

                    {/* ADD EMPLOYEE COST BUTTON - Opens popup */}
                    <button
                        className="btn-green"
                        onClick={() => setShowEmployeePopup(true)}
                    >
                        Adaugă cheltuiala
                    </button>
                </div>

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
                            <th>Alte</th>
                            <th>Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>2025-11-18</td>
                            <td>Interviu sursa</td>
                            <td>4/5</td>
                            <td>200 EUR</td>
                            <td>60 EUR</td>
                            <td>260 EUR</td>
                        </tr>

                        <tr>
                            <td>2025-11-20</td>
                            <td>Verificare locatie</td>
                            <td>3/5</td>
                            <td>120 EUR</td>
                            <td>45 EUR</td>
                            <td>165 EUR</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="total-box">Total HUMINT: 425 EUR</div>

                    {/* ADD HUMINT COST BUTTON - Opens popup */}
                    <button
                        className="btn-green"
                        onClick={() => setShowHumintPopup(true)}
                    >
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
import React from "react";
import "./TaskPage.css";

const TaskPage = () => {
    return (
        <div className="task-container">
            <div className="task-header" >

<div className="flex-center" >


    <button className="back-btn">← Înapoi la Dashboard</button>
    <div className="header-row">
        <h2>Task Individual — Societatea ABC</h2>
        <div className="analysis-info">Analist: X | Deadline: 12.11.2025 | Status: În derulare</div>
    </div>
</div>

                {/* Progress Bar */}
                <div className="progress-wrapper">
                    <div className="progress-label">Progres general</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "68%" }}></div>
                    </div>
                    <div className="progress-value">68%</div>
                </div>
            </div>

            <div className="task-info">

                {/* =========== LEFT SIDEBAR =========== */}

                <div className="sidebar">

                    <div className="sidebar-box">
                        <h3>Detalii Task</h3>

                        <div className="detail-item"><strong>Tip task:</strong> Societate</div>
                        <div className="detail-item"><strong>Responsabil:</strong> Analist A</div>
                        <div className="detail-item"><strong>Status:</strong> În derulare</div>
                        <div className="detail-item"><strong>Deadline:</strong> 12.11.2025</div>
                        <div className="detail-item"><strong>Ultima actualizare:</strong> 30.10.2025</div>
                        <div className="detail-item"><strong>Total puncte:</strong> 24</div>
                        <div className="detail-item"><strong>Puncte completate:</strong> 17/24 (68%)</div>
                    </div>

                    <button className="red-btn">⏱ Start proiect</button>
                    <button className="black-btn">⏸ Pauza proiect</button>
                    <button className="green-btn">💾 Salveaza progres</button>
                    <button className="yellow-btn">🔍 Cauta in Notes App</button>
                    <button className="pink-btn">📩 Solicita HUMINT</button>
                </div>

                {/* =========== MAIN AREA =========== */}
                <div className="main-area">


                    {/* Sections List */}
                    <div className="task-box">
                        <h3>I. SOCIETATEA ABC</h3>

                        <ul className="checklist">
                            <li><input type="checkbox" checked readOnly/> Informatii generale</li>
                            <li><input type="checkbox" checked readOnly/> Istoric societate</li>
                            <li><input type="checkbox" checked readOnly/> Date financiare</li>
                            <li><input type="checkbox" checked readOnly/> Parteneri contractuali</li>
                            <li><input type="checkbox" checked readOnly/> Datorii si inscrieri mobiliare</li>
                            <li><input type="checkbox" /> Achizitii SEAP</li>
                            <li><input type="checkbox" /> Proprietate intelectuala / Marci OSIM</li>
                            <li><input type="checkbox" /> Litigii societate</li>
                            <li><input type="checkbox" /> Participatii in alte societati</li>
                            <li><input type="checkbox" /> Controverse si aspecte de interes public</li>
                            <li><input type="checkbox" /> Informatii din HUMINT</li>
                            <li><input type="checkbox" /> Informatii suplimentare (editabil)</li>
                        </ul>

                        <button className="add-btn">+ Adauga punct nou</button>

                        <div className="editable-box">
                            Informatii suplimentare (titlu editabil)
                        </div>

                        <button className="green-btn bottom-save">💾 Salveaza progres</button>
                    </div>
                </div>

            </div>
           </div>
    );
};

export default TaskPage;

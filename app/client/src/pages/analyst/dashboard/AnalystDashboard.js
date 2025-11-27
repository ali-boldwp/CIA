import React from 'react';
import "./style.css"
import Header from "../../../layouts/Component/Header";

const AnalystDashboard = () => {

    const humintData = [
        { project: "KSTE RO", status: "In analiza", statusClass: "yellow", deadline: "13.11.2025" },
        { project: "KLM", status: "Aprobat", statusClass: "green", deadline: "18.11.2025" },
        { project: "QRS", status: "Finalizat", statusClass: "gray", deadline: "—" }
    ];

    return (
        <div className="dashboard">

            <Header/>

            {/* TOP SUMMARY CARDS */}
            <div className="top-summary">
                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">📄</span>
                        <span>Proiecte asignate</span>
                    </div>
                    <div className="summary-value">2</div>
                </div>

                <div className="summary-card">
                    <div className="summary-title">
                        🕵️ HUMINT in lucru
                    </div>
                    <div className="summary-value">1</div>
                </div>

                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">➕</span>
                        <span>Adauga solicitare noua de HUMINT</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">⏳</span>
                        <span>HUMINT in asteptare aprobare</span>
                    </div>
                    <div className="summary-sub">2 solicitari</div>
                </div>
            </div>

            {/* PROJECTS */}
            <h2 className="section-title">Proiectele mele</h2>

            <div className="projects-row">
                {/* PROJECT 1 */}
                <div className="project-card">
                    <div className="project-header">
                        <div className="project-name">Due Diligence: Societatea ABC</div>
                        <div className="project-deadline-wrapper">
                            <span className="deadline-pill">Deadline: 12.11.2025</span>
                            <div className="status-dot-wrapper">
                                <span className="dot green" />
                                <span className="status-text">on track</span>
                            </div>
                        </div>
                    </div>

                    <div className="project-info">
                        <div>Responsabil proiect: Ioana Alina</div>
                        <div>Echipa: Ioana Alina, Mihai I.</div>
                    </div>

                    <div className="progress-block">
                        <div className="progress-header">
                            <span>Progress (my tasks): 78%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill blue" style={{ width: "78%" }} />
                        </div>
                        <div className="progress-footer">10/15 taskuri efectuate</div>
                    </div>

                    <div className="project-actions">
                        <button className="btn pill blue">Deschide</button>
                        <button className="btn pill green">Mesaj</button>
                        <button className="btn pill red">Verifica HUMINT</button>
                    </div>
                </div>

                {/* PROJECT 2 */}
                <div className="project-card">
                    <div className="project-header">
                        <div className="project-name">Fraud investigation: KSTE RO</div>
                        <div className="project-deadline-wrapper">
                            <span className="deadline-pill">Deadline: 14.11.2025</span>
                            <div className="status-dot-wrapper">
                                <span className="dot orange" />
                                <span className="status-text">at risk</span>
                            </div>
                        </div>
                    </div>

                    <div className="project-info">
                        <div>Responsabil proiect: Ioana Alina</div>
                        <div>Echipa: Ioona Alina, Elena P.</div>
                    </div>

                    <div className="progress-block">
                        <div className="progress-header">
                            <span>Progress (my tasks): 65%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill purple" style={{ width: "65%" }} />
                        </div>
                        <div className="progress-footer">8/15 taskuri efectuate</div>
                    </div>

                    <div className="project-actions">
                        <button className="btn pill blue">Deschide</button>
                        <button className="btn pill green">Mesaj</button>
                        <button className="btn pill violet">HUMINT incoming</button>
                    </div>
                </div>
            </div>

            {/* HUMINT REQUESTS TABLE */}
            <h2 className="section-title">Solicitarile mele de HUMINT</h2>

            <div className="humint-card">
                <table className="humint-table">
                    <thead>
                    <tr>
                        <th>Proiect</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Actiuni</th>
                    </tr>
                    </thead>

                    <tbody>
                    {humintData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.project}</td>

                            <td>
                    <span className={`status-badge ${item.statusClass}`}>
                        {item.status}
                    </span>
                            </td>

                            <td>{item.deadline}</td>

                            <td>
                                <button className="btn pill blue small">
                                    Deschide solicitarea
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* BOTTOM ROW: CALENDAR + MESSENGER */}
            <div className="bottom-row">

                <h2 className="section-title no-margin">Calendar Deadlines</h2>
                <div className="calendar-card">


                    <ul className="calendar-list">
                        <li>

                            <span>🔴 12.11.2025 — Societatea ABC (78%)</span>
                        </li>
                        <li>

                            <span>🟠 14.11.2025 — KSTE RO (65%)</span>
                        </li>
                        <li>

                            <span>🟢 [Data] — [Proiect]  </span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AnalystDashboard;
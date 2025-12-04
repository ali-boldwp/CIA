import React from 'react';
import "../../analyst/dashboard/style.css"
import Header from "../../../layouts/Component/Header";
import { Link } from "react-router-dom";
import { useGetProjectRequestsQuery } from "../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../services/userApi";


const SalesDashboard = () => {
    const { data,isLoading}=useGetProjectRequestsQuery();
    const { data: analystsData } = useGetAnalystsQuery();

    const analysts = analystsData?.data || [];

    const getAnalystName = (id) => {
        if (!id) return "—";
        const found = analysts.find(a => a._id === id);
        return found ? found.name : "—";
    };

    const getAnalystNames = (ids) => {
        if (!ids || ids.length === 0) return "—";
        return ids
            .map((id) => getAnalystName(id))
            .join(", ");
    };



    const approvedProject=data?.data || [];

    const formatDate = (date) => {
        if (!date) return "—";

        const d = new Date(date);
        if (isNaN(d)) return "—";

        return d.toISOString().split("T")[0];
    };




    return (
        <div className="dashboard">

            <Header />
            {/* TOP SUMMARY CARDS */}
            <div className="top-summary">
                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">📄</span>
                        <span>Proiecte in lucru</span>
                    </div>
                    <div className="summary-value">{approvedProject.length}</div>
                </div>
                <Link to="/projectRequest">
                <div className="summary-card">
                    <div className="summary-title">
                        🕵️‍♀️ Adauga solicitare noua de proiect ➕
                    </div>
                    <div className="summary-value">1</div>
                </div>
                </Link>
                <Link to="#">
                    <div className="message-card">
                        <div className="message-label">
                            💬 Mesaje necitite
                        </div>

                        <div className="message-footer">
                            <div className="message-count">5</div>
                            <button className="message-button">Deschide messenger</button>
                        </div>
                    </div>
                </Link>
            </div>

            {/* PROJECTS */}
            <h2 className="sales-section-title">Proiectele</h2>

            <div className="projects-row">

                {approvedProject.length === 0 && (
                    <div>No approved projects found.</div>
                )}

                {approvedProject.map((p) => (
                    <div key={p._id} className="project-card">
                        <div className="project-header">

                            <div className="project-name">{p.projectName}</div>

                            <div className="project-deadline-wrapper">
                    <span className="deadline-pill">
                        Deadline: {formatDate(p.deadline)}
                    </span>

                                <div className="status-dot-wrapper">
                                    <span className="status-sales-text">{p.status}</span>
                                    <span className="dot green" />
                                </div>
                            </div>
                        </div>

                        <div className="project-info">
                            <div>Responsabil proiect: {getAnalystName(p.responsibleAnalyst)}</div>


                            <div>
                                Echipa: {getAnalystNames(p.assignedAnalysts)}

                            </div>
                        </div>

                        <div className="progress-block">
                            <div className="progress-header">
                                <span>Progress: 0%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill blue" style={{ width: "0%" }} />
                            </div>
                            <div className="progress-footer">0 taskuri efectuate</div>
                        </div>

                        <div className="project-actions">
                            <Link
                                to={`/projectDetail/${p._id}`}
                                className="sales-btn pill blue"
                            >
                                Deschide
                            </Link>

                            <button className="sales-btn pill green">Mesaj</button>
                            {/*<button className="sales-btn pill violet">HUMINT incoming</button>*/}
                        </div>

                    </div>
                ))}

            </div>


            {/* BOTTOM ROW: CALENDAR + MESSENGER */}
            <div className="bottom-row">

                <h2 className="section-sales-title no-margin">Calendar Deadlines </h2>

                <div className="calendar-card">
                    <ul className="calendar-list">

                        {approvedProject.map((p) => (
                            <li key={p._id}>
                <span>
                    🟢 {formatDate(p.deadline)} — (56%)
                </span>
                            </li>
                        ))}

                        {approvedProject.length === 0 && (
                            <li><span>Nu exista deadline-uri.</span></li>
                        )}
                    </ul>
                </div>


            </div>
        </div>
    );
};

export default SalesDashboard;
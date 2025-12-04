import React from 'react';
import "../../analyst/dashboard/style.css"
import Header from "../../../layouts/Component/Header";
import { Link } from "react-router-dom";
import {  useGetProjectsQuery } from "../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../services/userApi";


const SalesDashboard = () => {
    const { data,isLoading}=useGetProjectsQuery();
    const { data: analystsData } = useGetAnalystsQuery();

    const analysts = analystsData?.data || [];

    const resolveAnalystName = (value) => {
        if (!value) return "—";

        // If backend returned full object
        if (typeof value === "object" && value.name) {
            return value.name;
        }

        // If it's an ID, find in analysts list
        const found = analysts.find(a => a._id === value);
        return found ? found.name : "—";
    };

// Helper: return multiple analyst names
    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";

        return arr
            .map((item) => resolveAnalystName(item))
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
                        ➕ Adauga solicitare noua de proiect
                    </div>

                    <div className="summary-value">1</div>
                </div>
                </Link>
            </div>

            {/* PROJECTS */}
            <h2 className="section-title">Proiectele mele</h2>

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
                                    <span className="dot green" />
                                    <span className="status-text">{p.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="project-info">
                            <div>Responsabil proiect: {resolveAnalystName(p.responsibleAnalyst)}</div>


                            <div>
                                Echipa: {resolveAnalystNames(p.assignedAnalysts)}

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
                                className="btn pill blue"
                            >
                                Deschide
                            </Link>

                            <button className="btn pill green">Mesaj</button>
                            <button className="btn pill violet">HUMINT incoming</button>
                        </div>

                    </div>
                ))}

            </div>


            {/* BOTTOM ROW: CALENDAR + MESSENGER */}
            <div className="bottom-row">

                <h2 className="section-title no-margin">Calendar Deadlines</h2>

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
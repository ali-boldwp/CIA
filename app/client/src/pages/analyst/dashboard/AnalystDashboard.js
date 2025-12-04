import React from 'react';
import "./style.css"
import Header from "../../../layouts/Component/Header";
import { useGetProjectsQuery} from "../../../services/projectApi";
import {useGetAnalystsQuery} from "../../../services/userApi";
import {Link} from "react-router-dom";

const AnalystDashboard = () => {
    const { data:analyst}=useGetAnalystsQuery();
    const analysts=analyst?.data || [];
    const { data: projectData, isLoading, isError } = useGetProjectsQuery();
    const projects=projectData?.data || [];


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Eroare la preluarea proiectelor.</p>;

    // Helper: return analyst name whether ID or object
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

    // Status color mapping for badge/dot
    const statusColors = {
        requested: "orange",
        approved: "green",
        in_progress: "blue",
        completed: "gray"
    };

    return (
        <div className="dashboard">
            <Header />

            {/* TOP SUMMARY CARDS (dynamic counts) */}
            <div className="top-summary">
                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">📄</span>
                        <span>Proiecte asignate</span>
                    </div>
                    <div className="summary-value">{projects?.length}</div>
                </div>

                <div className="summary-card">
                    <div className="summary-title">🕵️ HUMINT in lucru</div>
                    <div className="summary-value">
                        {projects?.filter(p => p.status === "in_progress").length}
                    </div>
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
                    <div className="summary-sub">
                        {projects?.filter(p => p.status === "requested").length} solicitari
                    </div>
                </div>
            </div>

            {/* PROJECTS SECTION */}
            <h2 className="section-title">Proiectele mele</h2>

            <div className="projects-row">
                {projects?.map((project) => (
                    <div className="project-card" key={project._id}>

                        <div className="project-header">
                            <div className="project-name">{project.projectName}</div>

                            <div className="project-deadline-wrapper">
                                <span className="deadline-pill">
                                    Deadline:
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString("ro-RO")
                                        : "—"}
                                </span>

                                <div className="status-dot-wrapper">
                                    <span className={`dot ${statusColors[project.status] || "gray"}`} />
                                    <span className="status-text">{project.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="project-info">
                            <div>Responsabil proiect: {resolveAnalystName(project.responsibleAnalyst)}</div>
                            <div>Echipa: {resolveAnalystNames(project.assignedAnalysts)}</div>
                            <div>Progress (my tasks): 65%</div>
                        </div>

                        <div className="project-actions">
                            <Link to={`/projectDetail/${project._id}`} className=" pill blue">Deschide</Link>
                            <button className=" pill green">Mesaj</button>
                            <button className=" pill red">HUMINT</button>
                        </div>
                    </div>
                ))}
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
                    {projects?.map((item) => (
                        <tr key={item._id}>
                            <td>{item.projectName}</td>

                            <td>
                                    <span className={`status-badge ${statusColors[item.status] || "gray"}`}>
                                        {item.status}
                                    </span>
                            </td>

                            <td>
                                {item.deadline
                                    ? new Date(item.deadline).toLocaleDateString("ro-RO")
                                    : "—"}
                            </td>

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

            {/* CALENDAR DEADLINES */}
            <div className="bottom-row">
                <h2 className="section-title no-margin">Calendar Deadlines</h2>

                <div className="calendar-card">
                    <ul className="calendar-list">
                        {projects?.map((p) => (
                            <li key={p._id}>
                                <span>
                                    {statusColors[p.status] === "green" ? "🟢" :
                                        statusColors[p.status] === "orange" ? "🟠" :
                                            statusColors[p.status] === "blue" ? "🔵" : "⚪"}

                                    {" "}
                                    {p.deadline
                                        ? new Date(p.deadline).toLocaleDateString("ro-RO")
                                        : "—"}
                                    {" — "}
                                    {p.projectName}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default AnalystDashboard;

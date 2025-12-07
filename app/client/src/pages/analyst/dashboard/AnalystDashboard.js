import React, { useState, useMemo } from 'react';
import "./style.css"
import Header from "../../../layouts/Component/Header";
import { useGetProjectsQuery } from "../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../services/userApi";
import { Link } from "react-router-dom";

const AnalystDashboard = () => {

    const { data: analyst } = useGetAnalystsQuery();
    const analysts = analyst?.data || [];

    const { data: projectData, isLoading, isError } = useGetProjectsQuery();
    const projects = projectData?.data || [];

    /** === 1. PAGINATION HUMINT === */
    const [humintPage, setHumintPage] = useState(1);
    const humintLimit = 10;

    const humintTotalPages = Math.ceil(projects.length / humintLimit);

    const paginatedHumint = useMemo(() => {
        return projects.slice((humintPage - 1) * humintLimit, humintPage * humintLimit);
    }, [humintPage, projects]);


    /** === 2. PAGINATION CALENDAR === */
    const [calPage, setCalPage] = useState(1);
    const calLimit = 10;

    const calTotalPages = Math.ceil(projects.length / calLimit);

    const paginatedCalendar = useMemo(() => {
        return projects.slice((calPage - 1) * calLimit, calPage * calLimit);
    }, [calPage, projects]);


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Eroare la preluarea proiectelor.</p>;


    /** === NAME RESOLVERS === */
    const resolveAnalystName = (value) => {
        if (!value) return "—";
        if (typeof value === "object" && value.name) return value.name;
        const found = analysts.find(a => a._id === value);
        return found ? found.name : "—";
    };

    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";
        return arr.map(resolveAnalystName).join(", ");
    };


    /** === STATUS COLORS === */
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
                    <div className="summary-value"> {projects?.filter(p => p.status === "in_progress").length} </div>
                </div>
                <div className="summary-card">
                    <div className="summary-title">
                        <Link to="/humintRequest-Page">🕵️‍♀️ Adauga solicitare noua de HUMINT ➕</Link>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-title">
                        <span>⏳ HUMINT in asteptare aprobare</span>
                    </div>
                    <div className="summary-sub"> {projects?.filter(p => p.status === "requested").length} solicitari </div>
                </div>
                <Link to="#">
                    <div className="message-card">
                        <div className="message-label"> 💬 Mesaje necitite </div>
                        <div className="message-footer">
                            <div className="message-count">5</div>
                            <button className="message-button">Deschide messenger</button>
                        </div>
                    </div>
                </Link>
            </div>


            {/* PROJECT CARDS */}
            <h2 className="analyst-title">Proiectele mele</h2>

            <div className="projects-row">
                {projects.map((project) => (
                    <div className="project-card-analyst" key={project._id}>
                        <div className="project-header">
                            <div className="project-name">{project.projectName}</div>

                            <div className="project-deadline-wrapper">
                                <span className="deadline-pill">
                                    Deadline:
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString("ro-RO")
                                        : "—"}
                                </span>

                                <div className="status-dot-wrapper-analyst">
                                    <span className={`dot ${statusColors[project.status] || "gray"}`} />
                                    <span className="status-text-analyst">{project.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="project-info">
                            <div>Responsabil proiect: {resolveAnalystName(project.responsibleAnalyst)}</div>
                            <div>Echipa: {resolveAnalystNames(project.assignedAnalysts)}</div>
                            <div>Progress (my tasks): 65%</div>
                        </div>

                        <div className="project-actions">
                            <Link to={`/projectDetail/${project._id}`} className="pill-analyst blue">Deschide</Link>
                            <button className="pill-analyst green">Mesaj</button>
                            <button className="pill-analyst red">HUMINT Primit</button>
                        </div>
                    </div>
                ))}
            </div>


            {/* HUMINT REQUEST TABLE */}
            <h2 className="analyst-title">Solicitarile mele de HUMINT</h2>

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
                    {paginatedHumint.map((item) => (
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
                                <button className="pill-analyst blue">Deschide solicitarea</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* HUMINT PAGINATION */}
                <div className="pagination" style={{ marginTop: "15px" }}>
                    <button disabled={humintPage === 1} onClick={() => setHumintPage(prev => prev - 1)}>
                        ← Precedent
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Pagina <strong>{humintPage}</strong> din <strong>{humintTotalPages}</strong>
                    </span>

                    <button disabled={humintPage === humintTotalPages} onClick={() => setHumintPage(prev => prev + 1)}>
                        Următor →
                    </button>
                </div>
            </div>


            {/* CALENDAR DEADLINES */}
            <h2 className="analyst-title no-margin-analyst">Calendar Deadlines</h2>

            <div className="calendar-card">
                <ul className="calendar-list">
                    {paginatedCalendar.map((p) => (
                        <li key={p._id}>
                            <span>
                                {statusColors[p.status] === "green" ? "🟢"
                                    : statusColors[p.status] === "orange" ? "🟠"
                                        : statusColors[p.status] === "blue" ? "🔵"
                                            : "⚪"}
                                {" "}
                                {p.deadline ? new Date(p.deadline).toLocaleDateString("ro-RO") : "—"}
                                {" — "}
                                {p.projectName}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CALENDAR PAGINATION */}
                <div className="pagination" style={{ marginTop: "15px" }}>
                    <button disabled={calPage === 1} onClick={() => setCalPage(prev => prev - 1)}>
                        ← Precedent
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Pagina <strong>{calPage}</strong> din <strong>{calTotalPages}</strong>
                    </span>

                    <button disabled={calPage === calTotalPages} onClick={() => setCalPage(prev => prev + 1)}>
                        Următor →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalystDashboard;

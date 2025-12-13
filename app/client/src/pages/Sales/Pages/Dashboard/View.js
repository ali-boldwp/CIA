import {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Calender from "./Components/Calender";
import "./style.css";

const Dashboard = ({ approve, analystsData, requested  }) => {

    const statusBackendToUi = {
        approved: "in lucru",
        requested: "Solicitat",
        draft: "Draft",
        completed: "Finalizat",
        cancelled: "Anulat",
        revision: "Revizie",
        observation: "Observație",
    };
    const statusColorMap = {
        Approved: "green",
        Requested: "blue",
        Draft: "gray",
        Completed: "purple",
        Cancelled: "red",
        Revision: "orange",
        Observation: "yellow",
    };
    const normalizeStatus = (status) => {
        if (!status) return "";
        return status.toLowerCase();
    };

    const capitalizeStatus = (status) => {
        if (!status) return "";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };


    const resolveStatusLabel = (status) => {
        if (!status) return "—";
        return statusBackendToUi[normalizeStatus(status)] || status;
    };


    const resolveStatusDotColor = (status) => {
        return statusColorMap[capitalizeStatus(status)] || "gray";
    };

    const approvedProject=approve?.data || [];
    const analysts = analystsData?.data || [];
    const requestedProject=requested?.data||[];



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

    const formatDate = (date) => {
        if (!date) return "—";

        const d = new Date(date);
        if (isNaN(d)) return "—";

        return d.toISOString().split("T")[0];
    };

    const [page, setPage] = useState(1);
    const limit = 10; // câte deadline-uri pe pagină vrei

    const totalPages = Math.ceil(approvedProject.length / limit);

    const paginatedDeadlines = useMemo(() => {
        return approvedProject.slice((page - 1) * limit, page * limit);
    }, [page, approvedProject]);







    return (
        <>
            {/* TOP SUMMARY CARDS */}
            <div className="top-summary">
                <div className="summary-card">
                    <div className="summary-title">
                        <span className="summary-icon">📄</span>
                        <span>Proiecte in lucru</span>
                    </div>
                    <div className="summary-value">{approvedProject.length}</div>
                </div>
                <Link to="/project">
                    <div className="summary-card">
                        <div className="summary-title">
                            🕵️‍♀️ solicitare noua de proiect
                        </div>
                        <div className="requestedCount">
                            <div>{requestedProject.length}</div>
                        <button className="add-button">Adauga</button>
                        </div>
                    </div>
                </Link>
                <Link to="/messenger">
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

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h2 className="sales-section-title">Proiecte solicitate</h2>

                <div className="projects-row">

                    {requestedProject.length === 0 && (
                        <div>No approved projects found.</div>
                    )}

                    {requestedProject.map((p) => (
                        <div key={p._id} className="project-card">
                            <div className="project-header">

                                <div className="project-name">{p.projectName}</div>

                                <div className="project-deadline-wrapper">
                        <span className="deadline-pill">
                            Deadline: {formatDate(p.deadline)}
                        </span>

                                    <div className="status-dot-wrapper">
                                        <span className="status-sales-text">{resolveStatusLabel(p.status)}</span>
                                        <span className={`dot ${resolveStatusDotColor(p.status)}`} />

                                    </div>
                                </div>
                            </div>


                                <div className="project-info">
                                    <div>
                                        Responsabil proiect: {resolveAnalystName(p.responsibleAnalyst)}
                                    </div>

                                    <div>
                                        Echipa: {resolveAnalystNames(p.assignedAnalysts)}
                                    </div>
                                </div>

                        </div>
                    ))}

                </div>
            </div>

            {/* PROJECTS */}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                                    <span className="status-sales-text">{resolveStatusLabel(p.status)}</span>
                                    <span className={`dot ${resolveStatusDotColor(p.status)}`} />

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
                                <span>Progress: {p.progress || 0}%</span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="progress-fill blue"
                                    style={{ width: `${p.progress || 0}%` }}
                                />
                            </div>

                            <div className="progress-footer">
                                {p.completedTasks || 0} / {p.totalTasks || 0} taskuri efectuate
                            </div>
                        </div>



                        <div className="project-actions">
                            <Link
                                to={`/project/view/${p._id}`}
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
            </div>

             <Calender/>

        </>
    )

}

export default Dashboard;
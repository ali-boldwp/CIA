import React, { useMemo, useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import Calender from "../../Components/Calender";

const Dashboard = ({ analyst, projectData, humintData, analystProgressBar }) => {
    useEffect(() => {
        console.log("projectData:", projectData);
        console.log("analyst:", analyst);
    }, [projectData]);

    useEffect(() => {
        console.log("ANALYST PROGRESS BAR:", analystProgressBar);
    }, [analystProgressBar]);

    useEffect(() => {
        console.log("PrjectData2:", projectData);
    }, [projectData]);

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
        Observation: "gray",
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

    const resolveStatusBgColor = (status) => {
        return statusColorMap[capitalizeStatus(status)] || "gray";
    };

    const resolveStatusDotColor = (status) => {
        return statusColorMap[capitalizeStatus(status)] || "gray";
    };


    const getStatusUI = (status) => {
        return {
            label: resolveStatusLabel(status),
            style: {
                backgroundColor: resolveStatusBgColor(status),
                color: "white",
            },
        };
    };

    const analysts = analyst?.data || [];
    const projects = projectData?.data || [];
    const humint = humintData?.data || [];

    /** === 1. PAGINATION HUMINT === */
    const [humintPage, setHumintPage] = useState(1);
    const humintLimit = 10;

    const humintTotalPages = Math.ceil(humint.length / humintLimit);

    const paginatedHumint = useMemo(() => {
        return humint.slice((humintPage - 1) * humintLimit, humintPage * humintLimit);
    }, [humintPage, humint]);

    /** === NAME RESOLVERS === */
    const resolveAnalystName = (value) => {
        if (!value) return "—";
        if (typeof value === "object" && value.name) return value.name;
        const found = analysts.find((a) => a._id === value);
        return found ? found.name : "—";
    };

    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";
        return arr.map(resolveAnalystName).join(", ");
    };

    const getProjectProgress = (projectId) => {
        return analystProgressBar?.data?.find((p) => String(p.projectId) === String(projectId));
    };


    const getHumintButtonUI = (humintLike) => {
        // null/undefined
        if (!humintLike) {
            return {
                label: "Nu s-a solicitat HUMINT",
                style: {
                    color: "#334155",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #CBD5E1",
                },
            };
        }

        const status = (humintLike.status || "").toLowerCase();

        if (status === "approved") {
            return {
                label: "Primit HUMINT",
                style: {
                    color: "#166534",
                    backgroundColor: "#ECFDF5",
                    border: "1px solid #22C55E",
                },
            };
        }

        if (status === "requested") {
            return {
                label: "S-a solicitat HUMINT",
                style: {
                    color: "#92400E",
                    backgroundColor: "#FFFBEB",
                    border: "1px solid #F59E0B",
                },
            };
        }

        if (status === "completed") {
            return {
                label: "Predat HUMINT",
                style: {
                    color: "#075985",
                    backgroundColor: "#E0F2FE",
                    border: "1px solid #0EA5E9",
                },
            };
        }

        if (status === "rejected") {
            return {
                label: "HUMINT respins",
                style: {
                    color: "#991B1B",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #EF4444",
                },
            };
        }

        // fallback
        return {
            label: "Status HUMINT necunoscut",
            style: {
                color: "#334155",
                backgroundColor: "#F8FAFC",
                border: "1px solid #CBD5E1",
            },
        };
    };

    return (
        <>
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
                        {" "}
                        {projects?.filter((p) => p.status === "in_progress").length}{" "}
                    </div>
                    <Link to="/humint" className="gradient-btn">
                        HUMINT-ul tău
                    </Link>
                </div>

                <div className="summary-card">
                    <div className="summary-title">
                        <Link to="/humint/new">🕵️‍♀️ Adauga solicitare noua de HUMINT ➕</Link>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-title">
                        <span>⏳ HUMINT in asteptare aprobare</span>
                    </div>
                    <div className="summary-sub">
                        {" "}
                        {projects?.filter((p) => p.status === "requested").length} solicitari{" "}
                    </div>
                </div>

                <Link to="#">
                    <div className="message-card">
                        <div className="message-label"> 💬 Mesaje necitite </div>
                        <div className="message-footer">
                            <div className="message-count">5</div>
                            <Link to={"/messenger"} className="message-button">
                                Deschide messenger
                            </Link>
                        </div>
                    </div>
                </Link>
            </div>

            {/* PROJECT CARDS */}
            {projects && projects.length > 0 && (
                <>
                    <h2 className="analyst-title">Proiectele mele</h2>

                    <div className="projects-row">
                        {projects.map((project) => {
                            const chatId = project.groupChatId;

                            return (
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
                                                <span className={`dot ${resolveStatusDotColor(project.status)}`} />
                                                <span className="status-sales-text">
                    {resolveStatusLabel(project.status)}
                  </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="project-info">
                                        <div>Responsabil proiect: {resolveAnalystName(project.responsibleAnalyst)}</div>
                                        <div>Echipa: {resolveAnalystNames(project.assignedAnalysts)}</div>
                                    </div>

                                    {(() => {
                                        const p = getProjectProgress(project._id);

                                        return (
                                            <div className="progress-block">
                                                <div className="progress-header">
                                                    <span>Progress: {p?.progress || 0}%</span>
                                                </div>

                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill blue"
                                                        style={{ width: `${p?.progress || 0}%` }}
                                                    />
                                                </div>

                                                <div className="progress-footer">
                                                    {p?.completedTasks || 0} / {p?.totalTasks || 0} taskuri
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <div className="project-actions">
                                        <Link
                                            to={`/project/view/${project._id}`}
                                            className="pill-analyst blue"
                                        >
                                            Deschide
                                        </Link>

                                        <Link
                                            to={chatId ? `/messenger/${chatId}` : "#"}
                                            onClick={(e) => {
                                                if (!chatId) {
                                                    e.preventDefault();
                                                    alert("Is project ke liye groupChatId set nahi hai.");
                                                }
                                            }}
                                            className="pill-analyst green"
                                        >
                                            Mesaj
                                        </Link>

                                        {(() => {
                                            const humintUI = getHumintButtonUI(project.humintId);

                                            return (
                                                <button
                                                    className="pill-analyst"
                                                    style={humintUI.style}
                                                    type="button"
                                                >
                                                    {humintUI.label}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}


            {/* HUMINT REQUEST TABLE */}
            {paginatedHumint && paginatedHumint.length > 0 && (
                <>
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
                            {paginatedHumint.map((item) => {
                                return (
                                    <tr key={item._id}>
                                        <td>{item.projectName}</td>

                                        <td>
                                            {(() => {
                                                const humintUI = getHumintButtonUI(item);

                                                return (
                                                    <span
                                                        className="status-badge"
                                                        style={humintUI.style}
                                                    >
                        {humintUI.label}
                      </span>
                                                );
                                            })()}
                                        </td>

                                        <td>
                                            {item.deadline
                                                ? new Date(item.deadline).toLocaleDateString("ro-RO")
                                                : "—"}
                                        </td>

                                        <td>
                                            <Link
                                                to={`/humint/request/${item._id}`}
                                                className="pill-analyst blue"
                                            >
                                                Deschide solicitarea
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {/* HUMINT PAGINATION */}
                        <div className="pagination" style={{ marginTop: "15px" }}>
                            <button
                                disabled={humintPage === 1}
                                onClick={() => setHumintPage((prev) => prev - 1)}
                            >
                                ← Precedent
                            </button>

                            <span style={{ margin: "0 10px" }}>
          Pagina <strong>{humintPage}</strong> din{" "}
                                <strong>{humintTotalPages}</strong>
        </span>

                            <button
                                disabled={humintPage === humintTotalPages}
                                onClick={() => setHumintPage((prev) => prev + 1)}
                            >
                                Următor →
                            </button>
                        </div>
                    </div>
                </>
            )}


            <Calender />
        </>
    );
};

export default Dashboard;

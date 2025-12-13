import React from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

const Details = (
    {
        isFinalizedLocal,
        setShowReviewPopup,
        handleFinalize,
        isObservation,
        setShowEditingPopup,
        progress,
        completedTasks,
        totalTasks,
        editMode,
        handleToggleEdit,
        responsible,
        getInitials,
        assigned,
        legendColors,
        projectId,
        formatTime,
        totalWorkedSeconds,
        analystTimes,
        project
    }
) => {

    const { user } = useSelector((state) => state.auth);
    const hasHumint = !!project?.humintId;




    return(
        <div className="task-container">

            <div className="top-wrapper">

                {/* LEFT SIDE */}
                <div className="left-side">

                    <div className="control-box">
                        <p className="label">CONTROL PROJECT</p>
                        <p className="status-text">
                            Status proiect: <strong>În derulare</strong>
                        </p>
                        <div className="buttons-row">
                            {(user?.role === "admin" || user?.role === "manager" || user?.role === "analyst") && (
                                <>
                                    {user?.role === "admin" || user?.role === "manager" ? (
                                        // ADMIN & MANAGER BUTTON
                                        <button
                                            className="btn finalize"
                                            onClick={
                                                isFinalizedLocal
                                                    ? () => setShowReviewPopup(true)
                                                    : () => handleFinalize("revision")
                                            }
                                        >
                                            {isFinalizedLocal ? "Revision" : "✔ Finalizează"}
                                        </button>
                                    ) : (
                                        // ANALYST BUTTON
                                        <>
                                            {isObservation ? (
                                                <button
                                                    className="btn finalize"
                                                    onClick={() => setShowEditingPopup(true)}
                                                >
                                                    👁 View Observation
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn finalize"
                                                    onClick={() => handleFinalize("revision")}
                                                    disabled={isFinalizedLocal}
                                                >
                                                    {isFinalizedLocal ? "⏳ Așteptați" : "✔ Finalizează"}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    <div className="overview-box">
                        <p className="label">OVERVIEW PROJECT</p>
                        <p className="progress-title">Progres general</p>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="progress-info">
                            {completedTasks} / {totalTasks} taskuri finalizate ({progress}%)
                        </p>
                    </div>

                </div>

                {/* RIGHT SIDE – TIME BOX */}
                <div className="right-side">
                    { user?.role === "manager" && (
                        <div className="edit-row">
                            <span className="edit-label">Mod editare:</span>
                            <label className="ios-switch">
                                <input
                                    type="checkbox"
                                    checked={editMode}
                                    onChange={handleToggleEdit}
                                />
                                <span className="slider"></span>
                            </label>

                        </div>
                    )}


                    <div className="time-box">
                        <p className="time-title">REZUMAT TIMP LUCRU</p>

                        <p className="time-info">
                            Timp total lucrat:
                            <strong> {formatTime(totalWorkedSeconds)} </strong>
                            · Estimare ramas:
                            <strong> 00h 00m</strong>
                        </p>

                        <p className="analyst-times">
                            {analystTimes.length ? analystTimes.join(" | ") : "-"}
                        </p>


                    </div>
                </div>


            </div>

            <div className="legend-actions-wrapper">

                {/* LEFT SIDE — LEGEND */}
                <div className="legend-box">
                    <p className="legend-title">LEGEND ANALISTI</p>

                    <div className="legend-grid">

                        {/* Responsible Analyst First */}
                        <div className="firstButton">
                            {responsible && (
                                <div className="legend-item">
                                    <span className="doted blue"></span>
                                    <span className="legend-text">
                        {getInitials(responsible.name)} - {responsible.name}
                                        (Responsabil)
                    </span>
                                </div>
                            )}
                        </div>

                        {/* Assigned Analysts */}

                        {assigned.length > 0 ? (
                            assigned.map((a, i) => (
                                <div className="legend-item" key={a._id}>
                                    <span className={`doted ${legendColors[i + 1] || "green"}`}></span>

                                    <span className="legend-text">
                            {getInitials(a.name)} - {a.name}

                        </span>
                                </div>
                            ))
                        ) : (
                            <p className="fs-12 text-gray">Niciun analist asignat</p>
                        )}


                    </div>
                </div>


                {/* RIGHT SIDE — ACTION BUTTONS */}
                <div className="actions-box">

                    <button
                        className="project-btn save">
                        Salveaza progres
                    </button>


                    <button className="project-btn">
                        Cauta in Notes App
                    </button>


                    <div className="humint-wrapper">
                        <span className="approval-badge">necesită aprobare</span>

                        <Link to={`/humint/new/${projectId}`} className="project-btn">
                            {hasHumint ? "S-a solicitat HUMINT" : "Solicita HUMINT"}
                        </Link>
                    </div>


                    <div className="export-dropdown">
                        <button className="project-btn">Exporta raport ▾</button>

                        <div className="dropdown-menu">
                            <button className="dropdown-item">Export Word</button>
                            <button className="dropdown-item">Export PDF</button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default  Details;
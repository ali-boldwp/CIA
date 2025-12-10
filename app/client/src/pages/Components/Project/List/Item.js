import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const HUMINT_OPTIONS = [
    { value: "requested", label: "S-a solicitat HUMINT" },
    { value: "received",  label: "Primit HUMINT" },
    { value: "delivered", label: "Predat HUMINT" },
];

const Item = ({ data }) => {
    const [open, setOpen] = useState(false);

    // 👉 default status based on humintId
    const [humintStatus, setHumintStatus] = useState(
        data?.humintId ? "requested" : "none"
    );

    const dropdownRef = useRef(null);
    const chatId = data.groupChatId;

    // Sync if data changes
    useEffect(() => {
        if (data?.humintId) {
            setHumintStatus("requested");
        } else {
            setHumintStatus("none");
        }
    }, [data?.humintId]);

    // Click outside closes dropdown
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getInitials = (idOrObj) => {
        const fullName = idOrObj.name;
        if (!fullName || typeof fullName !== "string") return "_";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase() + "_";
        return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    };

    const formatDeadline = (deadline) => {
        if (!deadline)
            return {
                className: "deadline-badge none",
                date: "Fără deadline",
                status: "",
            };

        const today = new Date();
        const due = new Date(deadline);
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diff = (due - today) / (1000 * 60 * 60 * 24);
        const dateText = due.toISOString().split("T")[0];

        if (diff < 0) {
            return {
                className: "deadline-badge overdue",
                date: dateText,
                status: "depășit",
            };
        }

        return {
            className: "deadline-badge upcoming",
            date: dateText,
            status: `${Math.floor(diff)} zile`,
        };
    };

    // ✅ HUMINT dropdown selection handler (still keeps internal state, but button text hard-coded)
    const handleSelectHumint = (value) => {
        setHumintStatus(value);
        setOpen(false);
    };

    // ✅ check directly from Mongo data (humintId) for Status column
    const hasHumint = !!data?.humintId;

    return (
        <div className="project-row">

            {/* Project Info */}
            <div className="col project-infoDash">
                <h4>{data.projectName || data.name}</h4>

                <p>Responsabil: <b>{data?.responsibleAnalyst?.name}</b></p>

                <p>
                    Echipa asignată:{" "}
                    {data.assignedAnalysts?.length > 0 ? (
                        data.assignedAnalysts.map((member, i) => (
                            <span key={i} className="team-badge-approved">
                                {getInitials(member)}
                            </span>
                        ))
                    ) : (
                        <span className="team-empty">Nicio persoană asignată</span>
                    )}
                </p>
            </div>

            {/* Deadline */}
            <div className="col deadline">
                {(() => {
                    const { className, date, status } = formatDeadline(data.deadline);
                    return (
                        <span className={className}>
                            <span className="deadline-date">{date}</span>
                            {status && <span className="deadline-status">• {status}</span>}
                        </span>
                    );
                })()}
            </div>

            {/* Progress */}
            <div className="colProgress progress" style={{ gap: "10px" }}>
                <div style={{ display: "flex", flexGrow: 1, gap: "15px" }}>
                    <div className="progress-bar1">
                        <div
                            className="progress-fill1"
                            style={{ width: `${data.progress}%` }}
                        ></div>
                    </div>
                    <span>{data.progress}%</span>
                </div>
                {data.completedTasks}/{data.totalTasks} taskuri
            </div>

            {/* ✅ Status HUMINT column (based on humintId) */}
            <div className="col status">
    <span
        className={`status-badge-approved ${
            hasHumint ? "orange" : "gray"
        }`}
    >
        {hasHumint ? "S-a solicitat HUMINT" : "Nu s-a solicitat HUMINT"}
    </span>
            </div>

            {/* ACTIONS + HUMINT DROPDOWN */}
            <div
                className="col actions"
                ref={dropdownRef}
                style={{ display: "flex", justifyContent: "end", gap: "5px" }}
            >
                {/* Open Project */}
                <Link to={`/project/view/${data._id}`} className="action-btn">
                    Deschide
                </Link>

                {/* Messenger (group chat) */}
                <Link
                    to={chatId ? `/messenger/${chatId}` : "#"}
                    className="action-btn"
                    onClick={(e) => {
                        if (!chatId) {
                            e.preventDefault();
                            alert("Is project ke liye groupChatId set nahi hai.");
                        }
                    }}
                >
                    Mesaj 🔒
                </Link>

                {/* KPI */}
                <button className="action-btn">Costuri & KPI</button>

                {
                    hasHumint ? (
                        <button className="dropdown-btn action-btn" onClick={() => setOpen(!open)}>
                            HUMINT ▾
                        </button>
                    ):(
                        <Link  to={`/humint/new/${data?._id}`} className="action-btn">Solicitare HUMINT</Link>
                    )
                }


                {/* HUMINT Dropdown */}
                {open && (

                    <div className="humint-dropdown">
                        {HUMINT_OPTIONS.map((opt) => (
                            <div
                                key={opt.value}
                                className={`dropdown-item ${
                                    humintStatus === opt.value ? "selected" : ""
                                }`}
                                onClick={() => handleSelectHumint(opt.value)}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;

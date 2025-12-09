import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const HUMINT_OPTIONS = [
    { value: "title",     label: "HUMINT" },
    { value: "none",      label: "Nu s-a solicitat HUMINT" },
    { value: "requested", label: "S-a solicitat HUMINT" },
    { value: "received",  label: "Primit HUMINT" },
    { value: "delivered", label: "Predat HUMINT" },
];

const Item = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [humintStatus, setHumintStatus] = useState("title");

    const dropdownRef = useRef(null);

    // 👉 Your REAL chat ID
    const chatId = data.groupChatId;

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
            return { className: "deadline-badge none", date: "Fără deadline", status: "" };

        const today = new Date();
        const due = new Date(deadline);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diff = (due - today) / (1000 * 60 * 60 * 24);
        const dateText = due.toISOString().split("T")[0];

        if (diff < 0) {
            return { className: "deadline-badge overdue", date: dateText, status: "depășit" };
        }

        return {
            className: "deadline-badge upcoming",
            date: dateText,
            status: `${Math.floor(diff)} zile`,
        };
    };

    const selectedHumintLabel =
        HUMINT_OPTIONS.find((o) => o.value === humintStatus)?.label || "HUMINT";

    const handleSelectHumint = (value) => {
        setHumintStatus(value);
        setOpen(false);
    };

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

            {/* Status */}
            <div className="col status">
                <span className="status-badge-approved orange">HUMINT Status</span>
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

                {/* Messenger – using groupChatId */}
                <Link
                    to={chatId ? `/messenger/${chatId}` : "#"}
                    className="action-btn"
                    onClick={(e) => {
                        console.log("Clicked Chat ID:", chatId); // 👈 NOW CONSOLE SHOWS ID

                        if (!chatId) {
                            e.preventDefault();
                            alert("Is project ke liye groupChatId set nahi hai.");
                        }
                    }}
                >
                    Mesaj 🔒
                </Link>

                {/* Other Button */}
                <button className="action-btn">Costuri & KPI</button>

                {/* HUMINT Dropdown Button */}
                <button className="dropdown-btn" onClick={() => setOpen(!open)}>
                    {selectedHumintLabel} ▾
                </button>

                {/* HUMINT Dropdown */}
                {open && (
                    <div className="humint-dropdown">
                        <div
                            className={`dropdown-item ${humintStatus === "title" ? "selected" : ""}`}
                            onClick={() => handleSelectHumint("title")}
                        >
                            HUMINT
                        </div>

                        <hr style={{ margin: "4px 0", borderColor: "#eee" }} />

                        {HUMINT_OPTIONS.slice(1).map((opt) => (
                            <div
                                key={opt.value}
                                className={`dropdown-item ${humintStatus === opt.value ? "selected" : ""}`}
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

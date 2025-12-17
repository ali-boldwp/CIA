import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const HUMINT_OPTIONS = [
    { value: "requested", label: "S-a solicitat HUMINT" },
    { value: "received",  label: "Primit HUMINT" },
    { value: "delivered", label: "Predat HUMINT" },
];

// ✅ HUMINT status UI mapping
const HUMINT_STATUS_UI = {
    Requested: {
        text: "S-a solicitat HUMINT",
        style: {
            color: "#92400E",
            backgroundColor: "#FFFBEB",
            border: "1px solid #F59E0B",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "12px",
        },
    },
    Clarification: {
        text: "Predat HUMINT",
        style: {
            color: "#075985",
            backgroundColor: "#E0F2FE",
            border: "1px solid #0EA5E9",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "12px",
        },
    },
    Approved: {
        text: "Primit HUMINT",
        style: {
            color: "#166534",
            backgroundColor: "#ECFDF5",
            border: "1px solid #22C55E",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "12px",
        },
    },
};

const HUMINT_DEFAULT_UI = {
    text: "Nu s-a solicitat HUMINT",
    style: {
        color: "#334155",
        backgroundColor: "#F8FAFC",
        border: "1px solid #CBD5E1",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: "12px",
    },
};


const Item = ({ data }) => {
    const [open, setOpen] = useState(false);

    // 👉 default status based on humintId
    const [humintStatus, setHumintStatus] = useState(
        data?.humintId ? "requested" : "none"
    );

    const dropdownRef = useRef(null);
    // Mongo se humint status
    const mongoHumintStatus = data?.humintId?.status;

// UI select
    const humintUI = mongoHumintStatus
        ? (HUMINT_STATUS_UI[mongoHumintStatus] || HUMINT_DEFAULT_UI)
        : HUMINT_DEFAULT_UI;

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



    // ✅ HUMINT dropdown selection handler (still keeps internal state, but button text hard-coded)
    const handleSelectHumint = (value) => {
        setHumintStatus(value);
        setOpen(false);
    };
    const formatDeadline = (deadline) => {
        if (!deadline) {
            return {
                className: "deadline-empty",
                date: "—",
                daysText: null,
                isExpired: false,
            };
        }

        // 🔒 Always work in UTC
        const today = new Date();
        const todayUTC = new Date(
            Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate()
            )
        );

        const d = new Date(deadline);
        const deadlineUTC = new Date(
            Date.UTC(
                d.getUTCFullYear(),
                d.getUTCMonth(),
                d.getUTCDate()
            )
        );

        // 🔢 Difference in days (UTC safe)
        const diffTime = deadlineUTC - todayUTC;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 📅 Format date (UTC)
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();

        return {
            className: "deadline-date-simple",
            date: `${day}-${month}-${year}`,
            daysText: diffDays < 0 ? null : `${diffDays} zile`,
            isExpired: diffDays < 0,
        };
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
                    const { className, date, daysText, isExpired } =
                        formatDeadline(data.deadline);
                        const zile=isExpired ?"depășit":daysText;
                    return (
                        <div className={className}>
                            <span className={isExpired ? `expired` : `deadline-date`}>{date}.{zile}</span>
                        </div>
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
            {/* ✅ Status HUMINT (dynamic from Mongo) */}
            <div className="col status">
  <span
      className="status-badge-approved"
      style={{
          ...humintUI.style,
          padding: "4px 10px",
          borderRadius: "999px",
          display: "inline-block",
      }}
  >
    {humintUI.text}
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

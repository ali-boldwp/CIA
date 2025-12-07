import {useState, useRef, useEffect} from "react";
import {useGetAllUsersQuery} from "../../../../services/userApi";
import {Link} from "react-router-dom";

const ProjectRow = ({project, responsible, responsibles}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const {data: usersData} = useGetAllUsersQuery();
    const users = usersData?.data || [];

    const responsibleUser = users.find(
        (u) => u._id === project.responsibleAnalyst
    );

    // Close when clicking outside
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
        const fullName = responsible(idOrObj);

        if (!fullName || typeof fullName !== "string") return "_";

        const parts = fullName.trim().split(" ");

        if (parts.length === 1) {
            const first = parts[0].charAt(0).toUpperCase();
            return first + "_";
        }

        const first = parts[0].charAt(0).toUpperCase();
        const last = parts[parts.length - 1].charAt(0).toUpperCase();

        return first + last;
    };

    const formatDeadline = (deadline) => {
        if (!deadline)
            return {
                text: "Fără deadline",
                className: "deadline-badge none",
                date: "Fără deadline",
                status: "",
                displayText: "Fără deadline"
            };

        const today = new Date();
        const due = new Date(deadline);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diff = (due - today) / (1000 * 60 * 60 * 24);
        const dateText = due.toISOString().split("T")[0];

        if (diff < 0) {
            return {
                text: `${dateText} • depășit`,
                className: "deadline-badge overdue",
                date: dateText,
                status: "depășit",
                displayText: `${dateText} • depășit`
            };
        }

        const daysLeft = Math.floor(diff);
        return {
            text: `${dateText} • ${daysLeft} zile`,
            className: "deadline-badge upcoming",
            date: dateText,
            status: `${daysLeft} zile`,
            displayText: `${dateText} • ${daysLeft} zile`
        };
    };

    return (
        <div className="project-row">
            {/* INFO SECTION -------------------- */}
            <div className="col project-infoDash">
                <h4 style={{marginBottom: "5px"}}>
                    {project.projectName || project.name}
                </h4>
                <p>
                    Responsabil: <b>{responsible(project?.responsibleAnalyst)}</b>
                </p>
                <p>
                    Echipa asignată:{" "}
                    {project.assignedAnalysts?.length > 0 ? (
                        project.assignedAnalysts.map((member, i) => (
                            <span key={i} className="team-badge-approved">
                                {getInitials(member)}
                            </span>
                        ))
                    ) : (
                        <span className="team-empty">Nicio persoană asignată</span>
                    )}
                </p>
            </div>

            {/* DEADLINE ------------------------ */}
            <div className="col deadline">
                {(() => {
                    const {text, className, date, status} = formatDeadline(project.deadline);
                    return (
                        <span
                            className={className}
                            data-date={date}
                            data-status={status}
                        >
                            <span className="deadline-date">{date}</span>
                            {status && <span className="deadline-status">• {status}</span>}
                        </span>
                    );
                })()}
            </div>

            {/* PROGRESS ------------------------ */}
            <div className="colProgress progress" style={{ gap: "10px" }}>

                <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, width: "90%", gap: "15px" }}>
                    <div className="progress-bar1" style={{ display: "flex", flexGrow: 1 }}>
                        <div
                            className="progress-fill1"
                            style={{width: `${project.progress}%`}}
                        ></div>
                    </div>
                    <span style={{display: "block"}}>100%</span>
                </div>

                <div>8/10 taskuri</div>
                <div>
                </div>
            </div>

            {/* STATUS -------------------------- */}
            <div className="col status">
                <span className={`status-badge-approved orange ${project.statusColor}`}>
                    S-a solicitat HUMINT
                </span>
            </div>

            {/* ACTIONS + DROPDOWN -------------- */}
            <div className="col actions" ref={dropdownRef}>
                <Link to={`/projectDetail/${project._id}`} className="action-btn">
                    Deschide
                </Link>
                <button className="action-btn">Mesaj 🔒</button>
                <button className="action-btn">Costuri & KPI</button>
                <button className="dropdown-btn" onClick={() => setOpen((prev) => !prev)}>
                    HUMINT ▾
                </button>


                {open && (
                    <div className="humint-dropdown">
                        <label className="dropdown-item">
                            <input type="checkbox"/> Nu s-a solicitat HUMINT
                        </label>

                        <label className="dropdown-item selected">
                            <input type="checkbox" defaultChecked/> S-a solicitat HUMINT
                        </label>

                        <label className="dropdown-item">
                            <input type="checkbox"/> Primit HUMINT
                        </label>

                        <label className="dropdown-item">
                            <input type="checkbox"/> Predat HUMINT
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectRow;
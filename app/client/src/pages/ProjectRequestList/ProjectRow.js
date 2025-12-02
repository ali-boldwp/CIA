import { useState, useRef, useEffect } from "react";
import {Link} from "react-router-dom";
import {useGetAllUsersQuery} from "../../services/userApi";

const ProjectRow = ({ data }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const { data: usersData } = useGetAllUsersQuery();
    const users = usersData?.data || [];

    const responsibleUser = users.find(
        (u) => u._id === data.responsibleAnalyst
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

    return (
        <div className="project-row1">

            {/* INFO SECTION -------------------- */}
            <div className="col project-info">
                <h4 style={{ marginBottom: "5px" }}>
                    {data.name || data.projectName || "Fără nume proiect"}
                </h4>

                <p>
                    Responsabil:{" "}
                    <b>
                        {responsibleUser?.name || "Nespecificat"}
                    </b>
                </p>

                <p>
                    Echipa asignată:{" "}
                    {(data.assignedAnalysts || []).length > 0 ? (
                        (data.assignedAnalysts || []).map((a, i) => (
                            <span key={i} className="team-badge">
                                {a?.initials || a?.name || "AN"}
                            </span>
                        ))
                    ) : (
                        <span className="team-empty">Nicio persoană asignată</span>
                    )}
                </p>
            </div>

            {/* DEADLINE ------------------------ */}
            <div className="col deadline">
                <span
                    className={`deadline-date ${
                        data.deadline && new Date(data.deadline) < new Date()
                            ? "expired"
                            : ""
                    }`}
                >
                    {data.deadline
                        ? new Date(data.deadline).toLocaleDateString("ro-RO")
                        : "Fără termen"}
                </span>
            </div>

            {/* ACTIONS ------------------------- */}
            <div className="col actions" ref={dropdownRef}>
                <Link to={`/project/${data._id}`} className="action-btn-request">
                    + Creează proiect nou
                </Link>
            </div>
        </div>
    );
};

export default ProjectRow;

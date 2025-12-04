import { useState, useRef, useEffect } from "react";
import { useGetAllUsersQuery } from "../../../../services/userApi";
import {Link} from "react-router-dom";


const ProjectRow = ({ project, responsible,responsibles }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();



    const { data: usersData } = useGetAllUsersQuery();
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
        const fullName = responsible(idOrObj); // uses parent resolver

        if (!fullName || typeof fullName !== "string") return "-";

        const parts = fullName.trim().split(" ");

        // 🟡 If name has only one word → return FirstLetter + "-"
        if (parts.length === 1) {
            const first = parts[0].charAt(0).toUpperCase();
            return first + "-";
        }

        // 🟢 Multi-word name → First letter of first + first letter of last
        const first = parts[0].charAt(0).toUpperCase();
        const last = parts[parts.length - 1].charAt(0).toUpperCase();

        return first + last;
    };


    return (
    <div className="project-row">

      {/* INFO SECTION -------------------- */}
      <div className="col project-infoDash">
        <h4 style={{ marginBottom: "5px" }}>{project.projectName || project.name }</h4>
        <p>Responsabil: <b>{responsible(project?.responsibleAnalyst) }</b></p>
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
        <span className="deadline-date">
          {project.deadline
              ? new Date(project.deadline).toLocaleDateString("ro-RO")
              : "Fără deadline"}
        </span>
        </div>


        {/* PROGRESS ------------------------ */}
      <div className="col progress">
        <div className="progress-bar1">
          <div className="progress-fill1" style={{ width: `${project.progress}%` }}></div>
        </div>
        <span className="progress-text">{project.progressText}</span>
      </div>

      {/* STATUS -------------------------- */}
      <div className="col status">
        <span className={`status-badge-approved orange ${project.statusColor}`}>
          S-a solicitat HUMINT
        </span>
      </div>

      {/* ACTIONS + DROPDOWN -------------- */}
      <div className="col actions" ref={dropdownRef}>
        <Link to={`/projectDetail/${project._id}`} className="action-btn">Deschide</Link>
        <button className="action-btn">Mesaj 🔒</button>
        <button className="action-btn">Costuri & KPI</button>

        <button
          className="dropdown-btn"
          onClick={() => setOpen((prev) => !prev)}
        >
          HUMINT ▾
        </button>

        {/* DROPDOWN MENU */}
        {open && (
          <div className="humint-dropdown">
            <label className="dropdown-item">
              <input type="checkbox" /> Nu s-a solicitat HUMINT
            </label>

            <label className="dropdown-item selected">
              <input type="checkbox" defaultChecked /> S-a solicitat HUMINT
            </label>

            <label className="dropdown-item">
              <input type="checkbox" /> Primit HUMINT
            </label>

            <label className="dropdown-item">
              <input type="checkbox" /> Predat HUMINT
            </label>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectRow;

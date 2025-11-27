import { useState, useRef, useEffect } from "react";

const ProjectRow = ({ data }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

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
    <div className="project-row">

      {/* INFO SECTION -------------------- */}
      <div className="col project-info">
        <h4 style={{ marginBottom: "5px" }}>{data.name}</h4>
        <p>Responsabil: <b>{data.responsible}</b></p>
        <p>
          Echipa asignata:{" "}
          {data.team.map((t, i) => (
            <span key={i} className="team-badge">{t}</span>
          ))}
        </p>
      </div>

      {/* DEADLINE ------------------------ */}
      <div className="col deadline">
        <span className={`deadline-date ${data.expired ? "expired" : ""}`}>
          {data.deadline} • {data.deadlineBadge}
        </span>
      </div>

      {/* PROGRESS ------------------------ */}
      <div className="col progress">
        <div className="progress-bar1">
          <div className="progress-fill1" style={{ width: `${data.progress}%` }}></div>
        </div>
        <span className="progress-text">{data.progressText}</span>
      </div>

      {/* STATUS -------------------------- */}
      <div className="col status">
        <span className={`status-badge ${data.statusColor}`}>
          {data.status}
        </span>
      </div>

      {/* ACTIONS + DROPDOWN -------------- */}
      <div className="col actions" ref={dropdownRef}>
        <button className="action-btn">Deschide</button>
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

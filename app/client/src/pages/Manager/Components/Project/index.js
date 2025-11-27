import "./Project.css";
import ProjectRow from "./ProjectRow";

const Projects = () => {
  const projects = [
    {
      name: "Due Diligence: Societatea ABC",
      responsible: "Alexandru Marinescu",
      team: ["AP", "CV", "VG"],
      deadline: "2025-12-05",
      deadlineBadge: "23 zile",
      progressText: "10/15 taskuri",
      progress: 66,
      status: "Primit HUMINT",
      statusColor: "green",
    },
    {
      name: "Fraud investigation: KSTE RO",
      responsible: "Elena Tudor",
      team: ["AE", "VG"],
      deadline: "2025-12-10",
      deadlineBadge: "28 zile",
      progressText: "12/25 taskuri",
      progress: 48,
      status: "S-a solicitat HUMINT",
      statusColor: "orange",
    },
    {
      name: "Background check: Persoana A.B.",
      responsible: "Andrei Pop",
      team: ["AP", "VG"],
      deadline: "2025-11-20",
      deadlineBadge: "depașit",
      expired: true,
      progressText: "8/10 taskuri",
      progress: 80,
      status: "Nu s-a solicitat HUMINT",
      statusColor: "gray",
    },
    {
      name: "Raport de informare: Societatea KLM",
      responsible: "Carmen Vasilescu",
      team: ["CV", "IE"],
      deadline: "2025-11-30",
      deadlineBadge: "18 zile",
      progressText: "7/20 taskuri",
      progress: 35,
      status: "Predat HUMINT",
      statusColor: "blue",
    },
    {
      name: "Preliminary Due Diligence: Societatea QRS",
      responsible: "Vlad Georgescu",
      team: ["VG", "IE"],
      deadline: "2025-12-15",
      deadlineBadge: "33 zile",
      progressText: "3/14 taskuri",
      progress: 22,
      status: "S-a solicitat HUMINT",
      statusColor: "orange",
    },
    {
      name: "Background check: Persoana C.D.",
      responsible: "Roxana Petrescu",
      team: ["AP", "IE"],
      deadline: "2025-11-25",
      deadlineBadge: "13 zile",
      progressText: "7/12 taskuri",
      progress: 58,
      status: "S-a solicitat HUMINT",
      statusColor: "orange",
    },
  ];

  return (
    <div className="main">
      <div className="projects-header">
        <h3>Proiecte active în derulare</h3>
        <span className="count">6 proiecte</span>
      </div>
    <div className="projects-wrapper">

      <div className="projects-table-header">
        <span>Nume proiect / Responsabili & echipă</span>
        <span>Deadline</span>
        <span>Progres</span>
        <span>Status HUMINT</span>
        <span>Acțiuni</span>
      </div>

      <div className="projects-list">
        {projects.map((item, index) => (
          <ProjectRow key={index} data={item} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Projects;

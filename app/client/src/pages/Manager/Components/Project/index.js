import "./Project.css";
import ProjectRow from "./ProjectRow";
import {useGetProjectCreateQuery} from "../../../../services/projectApi";

const Projects = () => {

    const { data,isLoading } = useGetProjectCreateQuery();
    const approvedProjects=data?.data || [];


    if (isLoading) return <p>Loading...</p>;


  return (
    <div className="main">
      <div className="projects-header">
        <h3>Proiecte active în derulare</h3>
        <span className="count">{ approvedProjects.length} proiecte</span>
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
        {approvedProjects.map((project, index) => (
          <ProjectRow key={index} project={project} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Projects;

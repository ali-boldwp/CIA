import "./style.css"
import ProjectRow from "./ProjectRow";
import {  useGetProjectRequestsQuery} from "../../services/projectApi";


const ProjectRequestList = () => {

    const { data, isLoading, error } = useGetProjectRequestsQuery();

    const projects = data?.data || [];

    if (isLoading) return <div className="loading">Se încarcă proiectele...</div>;
    if (error) return <div className="error">Eroare la încărcarea proiectelor</div>;

    return (
        <div className="page-wrapper">

            <div className="RequestContainer">
                <div className="project-header-box">
                    <span className="project-header-back">
                        <a href="/manager/dashboard">← Înapoi la solicitare</a>
                    </span>
                    <h1 className="project-header-title">Listă solicitări de proiecte</h1>
                </div>
            </div>

            <div className="main">
                <div className="projects-header">
                    <h3>Proiecte active în derulare</h3>
                    <span className="count">{projects.length} proiecte</span>
                </div>

                <div className="projects-wrapper-request">

                    <div className="projects-table-header1">
                        <span>Nume proiect / Responsabili & echipă</span>
                        <span>Deadline</span>
                        <span>Acțiuni</span>
                    </div>

                    <div className="projects-list">
                        {projects.map((item, index) => (
                            <ProjectRow key={index} data={item} />
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProjectRequestList;

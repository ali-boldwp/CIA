import "./Project.css";
import ProjectRow from "./ProjectRow";
import { useGetProjectCreateQuery } from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/userApi";

const Projects = () => {
    const { data, isLoading } = useGetProjectCreateQuery();
    const { data: analystsData } = useGetAnalystsQuery();
    const analysts = analystsData?.data || [];
    const approvedProjects = data?.data || [];

    const approvedProject = data?.data || [];
    const approvedProjects=approvedProject.filter((p)=>p.status=== "approved")
    const resolveAnalystName = (value) => {
        if (!value) return "—";

        // If backend returned full object
        if (typeof value === "object" && value.name) {
            return value.name;
        }

        // If it's an ID, find in analysts list
        const found = analysts.find((a) => a._id === value);
        return found ? found.name : "—";
    };

    // Helper: return multiple analyst names
    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";

        return arr.map((item) => resolveAnalystName(item)).join(", ");
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="main">
            <div className="projects-header">
                <h3>Proiecte active în derulare</h3>
                <span className="count">{approvedProjects.length} proiecte</span>
            </div>

            {/* ADD THIS WRAPPER DIV FOR RESPONSIVE TABLE */}
            <div className="responsive-table-wrapper">
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
                            <ProjectRow
                                key={index}
                                project={project}
                                responsible={resolveAnalystName}
                                responsibles={resolveAnalystNames}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;
import "./Project.css";
import ProjectRow from "./ProjectRow";
import { useGetProjectCreateQuery } from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/userApi";
import { useState, useMemo } from "react";

const Projects = () => {
    const { data, isLoading } = useGetProjectCreateQuery();
    const { data: analystsData } = useGetAnalystsQuery();
    const analysts = analystsData?.data || [];

    const approvedAll = data?.data || [];
    const approvedProjects = approvedAll.filter((p) => p.status === "approved");

    const resolveAnalystName = (value) => {
        if (!value) return "—";

        if (typeof value === "object" && value.name) {
            return value.name;
        }

        const found = analysts.find((a) => a._id === value);
        return found ? found.name : "—";
    };

    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";
        return arr.map((item) => resolveAnalystName(item)).join(", ");
    };

    /** === PAGINATION LOGIC === */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.ceil(approvedProjects.length / limit);

    const paginatedProjects = useMemo(() => {
        return approvedProjects.slice((page - 1) * limit, page * limit);
    }, [page, limit, approvedProjects]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="main">
            <div className="projects-header">
                <h3>Proiecte active în derulare</h3>
                <span className="count">{approvedProjects.length} proiecte</span>
            </div>

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
                        {paginatedProjects.map((project, index) => (
                            <ProjectRow
                                key={index}
                                project={project}
                                responsible={resolveAnalystName}
                                responsibles={resolveAnalystNames}
                            />
                        ))}
                    </div>
                    <div className="pagination" style={{ marginTop: "20px" }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            ← Precedent
                        </button>

                        <span style={{ margin: "0 10px" }}>
                    Pagina <strong>{page}</strong> din{" "}
                            <strong>{totalPages}</strong>
                </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Următor →
                        </button>
                    </div>
                </div>
            </div>

            {/* === PAGINATION CONTROLS === */}

        </div>
    );
};

export default Projects;

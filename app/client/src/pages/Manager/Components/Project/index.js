import "./Project.css";
import ProjectRow from "./ProjectRow";
import { useGetProjectCreateQuery } from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/userApi";
import { useState, useMemo } from "react";

const Projects = () => {

    const { data, isLoading } = useGetProjectCreateQuery();
    const { data: analystsData } = useGetAnalystsQuery();
    const analysts = analystsData?.data || [];

    const approvedProject = data?.data || [];
    const approvedProjects=approvedProject.filter((p)=>p.status=== "approved")
    const resolveAnalystName = (value) => {
        if (!value) return "—";
        if (typeof value === "object" && value.name) return value.name;
        const found = analysts.find((a) => a._id === value);
        return found ? found.name : "—";
    };

    const resolveAnalystNames = (arr) => {
        if (!arr || arr.length === 0) return "—";
        return arr.map(resolveAnalystName).join(", ");
    };

    /** 🔍 OPTIONAL: SEARCH */
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return approvedProjects;

        const q = search.toLowerCase();

        return approvedProjects.filter((p) =>
            (p.projectName || "").toLowerCase().includes(q) ||
            resolveAnalystName(p.responsibleAnalyst).toLowerCase().includes(q)
        );
    }, [search, approvedProjects]);

    /** 📄 PAGINATION */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.ceil(filtered.length / limit);

    const paginated = filtered.slice((page - 1) * limit, page * limit);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="main">

            {/* HEADER */}
            <div className="projects-header">
                <h3>Proiecte active în derulare</h3>
                <span className="count">{approvedProjects.length} proiecte</span>
            </div>

            {/* SEARCH */}


            {/* TABLE HEADER */}
            <div className="projects-wrapper">
                <div className="projects-table-header">
                    <span>Nume proiect / Responsabili & echipă</span>
                    <span>Deadline</span>
                    <span>Progres</span>
                    <span>Status HUMINT</span>
                    <span>Acțiuni</span>
                </div>

                {/* PAGINATED LIST */}
                <div className="projects-list">
                    {paginated.map((project, index) => (
                        <ProjectRow
                            key={index}
                            project={project}
                            responsible={resolveAnalystName}
                            responsibles={resolveAnalystNames}
                        />
                    ))}

                    {paginated.length === 0 && (
                        <p className="empty-state">Nu s-au găsit proiecte...</p>
                    )}
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        ← Precedent
                    </button>

                    <span>
                        Pagina <strong>{page}</strong> din{" "}
                        <strong>{totalPages}</strong>
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Următor →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Projects;

import "./style.css";
import ProjectRow from "./ProjectRow";
import { useGetProjectRequestsQuery } from "../../services/projectApi";
import { useState } from "react";

const ProjectRequestList = () => {
    const { data, isLoading, error } = useGetProjectRequestsQuery();
    const [search, setSearch] = useState("");

    const projects = data?.data || [];

    // --- SAFE FILTER (Does NOT modify your data structure) ---
    const filteredProjects = projects.filter((project) => {
        const projectName = project.name || "";               // safe fallback
        return projectName.toLowerCase().includes(search.toLowerCase());
    });
    // ----------------------------------------------------------

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

                {/* 🔍 SEARCH BAR */}
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Caută proiect după nume..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="projects-header">
                    <h3>Proiecte active în derulare</h3>
                    <span className="count">{filteredProjects.length} proiecte</span>
                </div>

                <div className="projects-wrapper-request">

                    <div className="projects-table-header1">
                        <span>Nume proiect / Responsabili & echipă</span>
                        <span>Deadline</span>
                        <span>Acțiuni</span>
                    </div>

                    <div className="projects-list">
                        {filteredProjects.map((project, index) => (
                            <ProjectRow key={index} data={project} />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectRequestList;

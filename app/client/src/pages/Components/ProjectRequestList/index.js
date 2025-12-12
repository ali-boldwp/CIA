import "./style.css";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProjectRow from "./ProjectRow";
import { useGetProjectRequestsQuery} from "../../../services/projectApi";

const ProjectRequestList = () => {
    const { data, isLoading } = useGetProjectRequestsQuery();
    const Request = data?.data || [];
    const projectRequest = Request.filter((p)=>p.status === "requested")
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("deadline");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("all");

    /** === FILTRARE === */
    const filtered = projectRequest
        .filter((p) => {
            const searchText = search.toLowerCase();
            return (
                p.projectName?.toLowerCase().includes(searchText) ||
                p.projectSubject?.toLowerCase().includes(searchText) ||
                p.clientContactPerson?.toLowerCase().includes(searchText)
            );
        })
        .filter((p) => {
            if (priorityFilter === "all") return true;
            return p.priority?.toLowerCase() === priorityFilter.toLowerCase();
        })
        .filter((p) => {
            if (languageFilter === "all") return true;
            return p.deliverableLanguage?.toLowerCase() === languageFilter.toLowerCase();
        })
        .sort((a, b) => {
            if (sortBy === "deadline") {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            if (sortBy === "name") {
                return a.projectName.localeCompare(b.projectName);
            }
            return 0;
        });

    const safeDate = (date) => {
        if (!date) return "Fără termen";
        const d = new Date(date);
        if (isNaN(d)) return "Fără termen";
        return d.toISOString().split("T")[0];
    };

    const isFiltering =
        search.trim() !== "" ||
        priorityFilter !== "all" ||
        languageFilter !== "all" ||
        sortBy !== "deadline";

    const finalData = isFiltering ? filtered : projectRequest;

    /** === PAGINATION === */
    const [page, setPage] = useState(1);
    const limit = 10;

    const totalPages = Math.ceil(finalData.length / limit);

    const paginatedData = useMemo(() => {
        return finalData.slice((page - 1) * limit, page * limit);
    }, [page, finalData]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="RequestList">
            <div className="top-header-box">
                <Link to="/" className="back-gradient-btn">
                    ← Înapoi la Dashboard
                </Link>

                <h2 className="header-title">
                    Solicitări proiect — <span>De revizuit</span>
                </h2>
            </div>

            <div className="filter-header-box">
                <div className="search-box1">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Caută: persoană / tip / subiect"
                        className="search-input1"
                        value={search}
                        onChange={(e) => {
                            setPage(1); // reset to page 1 on search
                            setSearch(e.target.value);
                        }
                        }
                    />
                </div>

                <div className="filters">
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => {
                            setPage(1);
                            setSortBy(e.target.value);
                        }}
                    >
                        <option value="deadline">După deadline</option>
                        <option value="name">După nume</option>
                    </select>

                    <select
                        className="filter-select"
                        value={priorityFilter}
                        onChange={(e) => {
                            setPage(1);
                            setPriorityFilter(e.target.value);
                        }}
                    >
                        <option value="all">Toate prioritățile</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Normal">Normal</option>
                        <option value="Confidențial">Confidențial</option>
                    </select>

                    <select
                        className="filter-select"
                        value={languageFilter}
                        onChange={(e) => {
                            setPage(1);
                            setLanguageFilter(e.target.value);
                        }}
                    >
                        <option value="all">Toate limbile</option>
                        <option value="RO">Română</option>
                        <option value="EN">Engleză</option>
                    </select>
                </div>
            </div>

            {/* LISTA PAGINATĂ */}
            <ProjectRow projects={paginatedData} safe={safeDate} />
            {/* PAGINATION CONTROLS */}
            <div className="pagination paginationProjectList" style={{ marginTop: "20px" }}>
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
    );
};

export default ProjectRequestList;

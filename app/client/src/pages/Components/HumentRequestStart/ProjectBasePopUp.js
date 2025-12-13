import React, { useState, useMemo  } from "react";
import styles from "./ProjectBasePopUp.module.css";
import { useGetProjectsQuery } from "../../../services/projectApi";
import { Link ,useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const ProjectBasePopUp = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useGetProjectsQuery({
        onlyWithoutHumint: true
    });
    const projects = data?.data || [];

    const [selectedProject, setSelectedProject] = useState(null);

    /** 🔍 SEARCH */
    const [search, setSearch] = useState("");

    /** 📄 PAGINATION */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /** 🔍 FILTERED LIST */
    const filtered = useMemo(() => {
        if (!search.trim()) return projects;

        const q = search.toLowerCase();

        return projects.filter((p) =>
            (p.projectName || "").toLowerCase().includes(q) ||
            (p.reportType || "").toLowerCase().includes(q) ||
            (p.responsibleAnalyst?.name || "").toLowerCase().includes(q)
        );
    }, [search, projects]);

    /** 📄 PAGINATION */
    const totalPages = Math.ceil(filtered.length / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const handleSelect = (project) => {
        setSelectedProject(project);
    };

    /** ❗Now it is safe to conditionally return */
    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>

                <h3 className={styles.title}>Alege proiectul (în lucru)</h3>

                {/* SEARCH */}
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Caută proiect, tip raport, responsabil..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* TABLE */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Selectează</th>
                            <th>Proiect</th>
                            <th>Tip raport</th>
                            <th>Responsabil</th>
                            <th>Deadline</th>
                            <th>Progres</th>
                            <th>Stare HUMINT</th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginated.map((p) => (
                            <tr
                                key={p._id}
                                className={styles.row}
                                onClick={() => handleSelect(p)}
                            >
                                <td className={styles.radioCell}>
                                    <input
                                        type="radio"
                                        checked={selectedProject?._id === p._id}
                                        onChange={() => handleSelect(p)}
                                    />
                                </td>

                                <td>{p.projectName}</td>
                                <td>{p.reportType}</td>
                                <td>{p.responsibleAnalyst?.name}</td>
                                <td>{p.deadline?.slice(0, 10)}</td>
                                <td>{p.progress || "—"}</td>
                                <td>
                                        <span className={styles.statusPill}>
                                            {p.humintStatus || "Nu s-a solicitat"}
                                        </span>
                                </td>
                            </tr>
                        ))}

                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan="7" className={styles.emptyState}>
                                    Niciun rezultat găsit.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className={styles.footer}>


                    <div className={styles.footerRight}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={styles.pageBtn}
                        >
                            ← Precedent
                        </button>

                        <span>
                            Pagina <strong>{page}</strong> din <strong>{totalPages}</strong>
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={styles.pageBtn}
                        >
                            Următor →
                        </button>
                    </div>
                </div>

                {/* CONTEXT */}
                <div className={styles.contextWrapper}>
                    <p className={styles.contextTitle}>Context (auto din proiect)</p>
                    <div className={styles.contextRow}>
                        <span className={styles.contextTag}>
                            Denumire: <span className={styles.contextValue}>{selectedProject?.projectName || "—"}</span>
                        </span>
                        <span className={styles.contextTag}>
                            Tip: <span className={styles.contextValue}>{selectedProject?.reportType || "—"}</span>
                        </span>
                        <span className={styles.contextTag}>
                            Responsabil: <span className={styles.contextValue}>{selectedProject?.responsibleAnalyst?.name || "—"}</span>
                        </span>
                        <span className={styles.contextTag}>
                            Deadline: <span className={styles.contextValue}>{selectedProject?.deadline?.slice(0, 10) || "—"}</span>
                        </span>
                    </div>
                </div>

                {/* BUTTON */}
                <div className={styles.buttonRow}>
                    <button
                        className={styles.continueBtn}
                        onClick={() => {
                            if (!selectedProject?._id) {
                                toast("Te rog selectează un proiect mai întâi");
                                return;
                            }

                            navigate(`/humint/new/${selectedProject._id}`);
                        }}
                    >
                        Continuă
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ProjectBasePopUp;

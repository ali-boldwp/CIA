import React, { useState } from "react";
import styles from "./ProjectBasePopUp.module.css";
import { useGetProjectsQuery } from "../../services/projectApi";
import {Link, useNavigate} from "react-router-dom";

const ProjectBasePopUp = () => {
    const navigate = useNavigate();

    // Fetch projects from backend
    const { data, isLoading } = useGetProjectsQuery();

    const projects = data?.data || [];


    // Store selected project
    const [selectedProject, setSelectedProject] = useState(null);

    if (isLoading) return <p>Loading projects...</p>;

    const handleSelect = (project) => {
        setSelectedProject(project);
    };




    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>

                <h3 className={styles.title}>Alege proiectul (în lucru)</h3>

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
                        {projects.map((p) => (
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
                        </tbody>
                    </table>
                </div>

                {/* CONTEXT — AUTO FROM SELECTED PROJECT */}
                <div className={styles.contextWrapper}>
                    <p className={styles.contextTitle}>
                        Context (auto din proiect)
                    </p>

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
                            Deadline: <span className={styles.contextValue}>
                                {selectedProject?.deadline?.slice(0, 10) || "—"}
                            </span>
                        </span>
                    </div>
                </div>

                {/* BUTTON */}
                <div className={styles.buttonRow}>
                    <Link to={`/humintRequest-Page/${selectedProject?._id}`} className={styles.continueBtn}>
                        Continuă
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectBasePopUp;

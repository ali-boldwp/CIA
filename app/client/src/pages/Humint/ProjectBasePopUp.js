// /home/ubaid/workspace/app/client/src/pages/Humint/ProjectBasePopUp.js

import React, { useState } from "react";
import styles from "./ProjectBasePopUp.module.css";

const ProjectBasePopUp = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            id: 1,
            name: "Due Diligence: Societatea ABC",
            type: "Enhanced DD",
            responsible: "Analist C",
            deadline: "2025-12-20",
            progress: "65%",
            humint: "Nu s-a solicitat",
        },
        {
            id: 2,
            name: "Fraud investigation: KSTE RO",
            type: "Fraud Investigation",
            responsible: "Analist A",
            deadline: "2025-12-12",
            progress: "40%",
            humint: "Nu s-a solicitat",
        },
        {
            id: 3,
            name: "Background check: Persoana A.B.",
            type: "Background Check",
            responsible: "Analist B",
            deadline: "2025-12-08",
            progress: "55%",
            humint: "Nu s-a solicitat",
        },
        {
            id: 4,
            name: "Raport de informare: Societatea KLM",
            type: "Raport informare",
            responsible: "Analist E",
            deadline: "2025-12-18",
            progress: "30%",
            humint: "Nu s-a solicitat",
        },
    ];

    const handleSelect = (id) => {
        setSelectedProject(id);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                {/* TITLE */}
                <h3 className={styles.title}>Alege proiectul (în lucru)</h3>

                {/* SEARCH + FILTERS */}
                <div className={styles.topRow}>
                    <div className={styles.searchGroup}>
                        <span className={styles.label}>Caută proiect</span>
                        <div className={styles.searchWrapper}>
                            <input
                                placeholder="🔎 Caută după nume / client / responsabil"
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.label}>Filtre</span>
                        <div className={styles.filterBtns}>
                            <button className={styles.filterBtn}>
                                Doar proiecte în lucru ▾
                            </button>
                            <button className={styles.filterBtn}>
                                Cu Start setat ▾
                            </button>
                        </div>
                    </div>
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
                        {projects.map((p) => (
                            <tr
                                key={p.id}
                                className={styles.row}
                                onClick={() => handleSelect(p.id)}
                            >
                                <td className={styles.radioCell}>
                                    <input
                                        type="radio"
                                        checked={selectedProject === p.id}
                                        onChange={() => handleSelect(p.id)}
                                    />
                                </td>
                                <td className={styles.projectCell}>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{p.responsible}</td>
                                <td>{p.deadline}</td>
                                <td>{p.progress}</td>
                                <td>
                                        <span className={styles.statusPill}>
                                            {p.humint}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* CONTEXT LINE */}
                <div className={styles.contextWrapper}>
                    <p className={styles.contextTitle}>
                        Context (auto din proiect) — se va precompleta în pasul următor
                    </p>

                    <div className={styles.contextRow}>
                        <span className={styles.contextTag}>
                            Denumire: <span className={styles.contextValue}>—</span>
                        </span>
                        <span className={styles.contextTag}>
                            Tip: <span className={styles.contextValue}>—</span>
                        </span>
                        <span className={styles.contextTag}>
                            Responsabil: <span className={styles.contextValue}>—</span>
                        </span>
                        <span className={styles.contextTag}>
                            Deadline: <span className={styles.contextValue}>—</span>
                        </span>
                    </div>
                </div>

                {/* BUTTON */}
                <div className={styles.buttonRow}>
                    <button className={styles.continueBtn}>Continuă</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectBasePopUp;

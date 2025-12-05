import React from "react";
import styles from "./Team.module.css";
import { useGetAnalystsQuery } from "../../../../services/userApi";
import { useGetProjectRequestsQuery } from "../../../../services/projectApi";

const Team = () => {
    // Fetch all analysts
    const { data: analystsData } = useGetAnalystsQuery();
    const analysts = analystsData?.data || [];

    // Fetch all projects
    const { data: projectsData } = useGetProjectRequestsQuery();
    const projects = projectsData?.data || [];

    // Only approved projects
    const approvedProjects = projects.filter(
        (p) => p.status?.toLowerCase() === "approved"
    );

    // Function to check workload
    const getAnalystStatus = (id) => {
        const assigned = approvedProjects.some((proj) =>
            proj.assignedAnalysts?.includes(id)
        );
        return assigned ? "în lucru" : "liber";
    };

    const getAnalystProgress = (id) => {
        const assignedProjects = approvedProjects.filter((proj) =>
            proj.assignedAnalysts?.includes(id)
        );

        if (assignedProjects.length === 0) return 0;

        // OPTIONAL: if you want progress, use your own logic
        return Math.min(100, assignedProjects.length * 20);
    };

    return (
        <div className="main" style={{ marginBottom: "50px" }}>
            <h3 className={styles.teamTitle}>Echipa de analiști</h3>

            <div className={styles.teamWrapper}>
                <div className={styles.teamTable}>
                    <div className={styles.teamHeader}>
                        <span>Nume</span>
                        <span>Scor</span>
                        <span>Stare</span>
                        <span>Progres</span>
                        <span>Acțiuni</span>
                    </div>

                    <div className={styles.teamBody}>
                        {analysts.map((a) => {
                            const status = getAnalystStatus(a._id);
                            const progress = getAnalystProgress(a._id);

                            return (
                                <div className={styles.teamRow} key={a._id}>
                                    <div className={`${styles.col} ${styles.name}`}>
                                        <span
                                            className={
                                                status === "în lucru"
                                                    ? styles.purple
                                                    : styles.initialBadge
                                            }
                                        >
                                            {a.initials || a.name?.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span>{a.name}</span>
                                    </div>

                                    <div className={`${styles.col} ${styles.score}`}>
                                        {a.score || 0}
                                    </div>

                                    <div className={`${styles.col} ${styles.state}`}>
                                        <span
                                            className={`${styles.stateBadge} ${
                                                status === "liber" ? styles.free : styles.work
                                            }`}
                                        >

                                            {status}
                                        </span>
                                    </div>

                                    <div className={`${styles.col} ${styles.progress}`} style={{ display: "flex" } } >
                                        <div className={styles.progresBar}>
                                            <div
                                                className={styles.progresFill}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div>
                                            <span className={styles.progressNumber} style={{ marginLeft: "0.8rem" } } >
                                            {progress}%
                                        </span>
                                        </div>
                                    </div>

                                    <div className={`${styles.col} ${styles.actions}`}>
                                        <button className={styles.openBtn}>Deschide</button>
                                        <button className={styles.deleteBtn}>
                                            🗑 Șterge
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Buttons table ke neeche, wrapper se bahar */}
            <div className={styles.teamFooterActions}>
                <button className={`${styles.pillBtn} ${styles.addBtn}`}>
                    <span className={styles.addIcon}>＋</span>
                    <span>Vezi lista angajați</span>
                </button>

                <button className={`${styles.pillBtn} ${styles.listBtn}`}>
                    + Adaugă analist
                </button>
            </div>
        </div>
    );
};

export default Team;

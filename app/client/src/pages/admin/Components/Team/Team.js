import React, { useState, useMemo } from "react";
import styles from "./Team.module.css";
import { useGetAnalystsProgressQuery } from "../../../../services/projectApi";
import {useNavigate} from "react-router-dom";
import PopUp from "../../Pages/Users/List/AddEmployeeModal"

const Team = () => {


    const navigate = useNavigate();
    // Fetch analysts progress (backend-calculated)
    const { data: analystsData } = useGetAnalystsProgressQuery();
    const analysts = analystsData?.data || [];

    const [openAddModal, setOpenAddModal] = useState(false);


    // Function to show initials (unchanged)
    const getInitials = (fullName) => {
        if (!fullName) return "_";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase() + "_";
        return (
            parts[0][0].toUpperCase() +
            parts[parts.length - 1][0].toUpperCase()
        );
    };

    /** 📄 === PAGINATION LOGIC === */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.ceil(analysts.length / limit);

    const paginated = useMemo(() => {
        return analysts.slice((page - 1) * limit, page * limit);
    }, [page, limit, analysts]);

    return (
        <div className="main">
            <h3 className={styles.teamTitle}>Echipa de analiști</h3>

            <div className={styles.teamWrapper}>
                <div className={styles.teamTable}>
                    <div className={styles.teamHeader}>
                        <span>Nume</span>
                        <span>Scor</span>
                        <span>Stare</span>
                        <span>Progres</span>
                        <span style={{ textAlign: "right" }}>Acțiuni</span>
                    </div>

                    <div className={styles.teamBody}>
                        {paginated.map((a) => (
                            <div className={styles.teamRow} key={a.analystId}>
                                <div className={`${styles.col} ${styles.name}`}>
                                    <span
                                        className={
                                            a.status === "în lucru"
                                                ? styles.purple
                                                : styles.initialBadge
                                        }
                                    >
                                        {getInitials(a.name)}
                                    </span>
                                    <span>{a.name}</span>
                                </div>

                                <div className={`${styles.col} ${styles.score}`}>
                                    {a.score || 0}
                                </div>

                                <div className={`${styles.col} ${styles.state}`}>
                                    <span
                                        className={`${styles.stateBadge} ${
                                            a.status === "liber"
                                                ? styles.free
                                                : styles.work
                                        }`}
                                    >
                                        {a.status}
                                    </span>
                                </div>

                                {/* PROGRESS BAR FROM BACKEND */}
                                <div
                                    className={`${styles.col} ${styles.progress}`}
                                    style={{ display: "flex" }}
                                >
                                    <div className={styles.progresBar}>
                                        <div
                                            className={styles.progresFill}
                                            style={{ width: `${a.progress}%` }}
                                        />
                                    </div>
                                    <span
                                        className={styles.progressNumber}
                                        style={{ marginLeft: "0.8rem" }}
                                    >
                                        {a.progress}%
                                    </span>
                                </div>

                                <div className={`${styles.col} ${styles.actions}`} style={{ textAlign: "right" }}>
                                    <button className={styles.openBtn}>
                                        Deschide
                                    </button>
                                    <button className={styles.deleteBtn}>
                                        🗑 Șterge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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

            <div className={styles.teamFooterActions}>
                <button className={`${styles.pillBtn} ${styles.addBtn}`}
                onClick={()=> navigate("/users")}>
                    <span className={styles.addIcon}>＋</span>
                    <span>Vezi lista angajați</span>
                </button>

                <button className={` ${styles.AddAnalyst} `}
                        onClick={() => setOpenAddModal(true)}>
                    + Adaugă analist
                </button>
            </div>

            {openAddModal && (
                <PopUp
                    isOpen={openAddModal}
                    sectionKey="investigatii"
                    onClose={() => setOpenAddModal(false)}
                />
            )}
        </div>
    );
};

export default Team;

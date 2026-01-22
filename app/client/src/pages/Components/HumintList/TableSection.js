import React, { useMemo, useState } from "react";
import styles from "./TableSection.module.css";
import { Link } from "react-router-dom";

const priorityClass = (priority) => {
    switch (priority) {
        case "Urgent":
            return styles.pillUrgent;
        case "Normal":
            return styles.pillNormal;
        case "Confidențial":
            return styles.pillConfidential;
        default:
            return "";
    }
};

const statusClass = (status) => {
    switch (status) {
        case "De aprobat":
            return styles.statusPending;
        case "Clarificări":
            return styles.statusClarify;
        case "Approved":
            return styles.statusApproved;   // NEW
        default:
            return "";
    }
};


const TableSection = ({
                          requests,
                          selectedIds,
                          onToggleSelect,
                          onToggleSelectAll,
                          totalCount,
                      }) => {
    /** 🔍 SEARCH INPUT */
    const [activeTab, setActiveTab] = useState("ALL");

    /** 📄 PAGINATION */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const filteredRequests = useMemo(() => {
        switch (activeTab) {
            case "APPROVED":
                return requests.filter((r) => r.status === "Approved");

            case "CLARIFICATION":
                return requests.filter((r) => r.status === "Clarification");

            case "REQUESTED":
                return requests.filter((r) => r.status === "Requested");

            default:
                return requests; // ALL
        }
    }, [requests, activeTab]);

    React.useEffect(() => {
        setPage(1);
    }, [activeTab]);

    /** PAGINATION LOGIC */
    const totalPages = Math.ceil(filteredRequests.length / limit);

    const paginated = filteredRequests.slice(
        (page - 1) * limit,
        page * limit
    );



    /** SELECT ALL */
    const visibleIds = paginated.map((r) => r.id);
    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const handleSelectAllChange = (e) => {
        onToggleSelectAll(visibleIds, e.target.checked);
    };




    const pendingCount = requests.filter((r) => r.status === "Requested").length;
    const approvedCount = requests.filter((r) => r.status === "Approved").length;
    const clarCount = requests.filter((r) => r.status === "Clarification").length;

    return (
        <div className={styles.container}>

            {/* SEARCH BAR INSIDE TABLE */}


            {/* TABS */}
            <div className={styles.statsCard}>
                <div className={styles.tabsRow}>
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={`${styles.tab} ${
                            activeTab === "ALL" ? styles.tabActive : styles.tabGhost
                        }`}
                    >
                        Toate: {totalCount}
                    </button>

                    <button
                        onClick={() => setActiveTab("APPROVED")}
                        className={`${styles.tab} ${
                            activeTab === "APPROVED" ? styles.tabActive : styles.tabGhost
                        }`}
                    >
                        De aprobat: {approvedCount}
                    </button>

                    <button
                        onClick={() => setActiveTab("CLARIFICATION")}
                        className={`${styles.tab} ${
                            activeTab === "CLARIFICATION" ? styles.tabActive : styles.tabGhost
                        }`}
                    >
                        Clarificări: {clarCount}
                    </button>

                    <button
                        onClick={() => setActiveTab("REQUESTED")}
                        className={`${styles.tab} ${
                            activeTab === "REQUESTED" ? styles.tabActive : styles.tabGhost
                        }`}
                    >
                        Solicitat: {pendingCount}
                    </button>
                </div>
            </div>


            {/* TABLE */}
            <div className={styles.tableCard}>
                <h3 className={styles.title}>Solicitări în așteptare</h3>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={styles.thCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th>Proiect / Subiect</th>
                            <th>Tip</th>
                            <th>Responsabil</th>
                            <th>Prioritate</th>
                            <th>Deadline</th>
                            <th>Creat de</th>
                            <th>Stare</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginated.map((item) => {
                            const isSelected = selectedIds.includes(item.id);

                            return (
                                <tr key={item.id} className={isSelected ? styles.rowSelected : ""}>
                                    <td className={styles.tdCheckbox}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.projectCell}>
                                            <span className={styles.projectTitle}>{item.projectName}</span>
                                            <span className={styles.projectSubtitle}>{item.projectSubject}</span>
                                        </div>
                                    </td>
                                    <td>{item.reportType}</td>
                                    <td>{ item.responsible?.name }</td>

                                    <td>
                                            <span className={`${styles.pill} ${priorityClass(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                    </td>
                                    <td>{item.deadline}</td>
                                    <td>{item.createdBy}</td>
                                    <td>
                                            <span className={`${styles.statusPill} ${statusClass(item.status)}`}>
    {item.status === "Approved" ? "Aprobat" : item.status}
</span>

                                    </td>
                                    <td>
                                    <Link
                                        to={`/humint/request/${item.id}`}
                                        className={styles.linkButton}
                                    >
                                        Deschide →
                                    </Link>
                                    </td>

                                </tr>
                            );
                        })}

                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan={10} className={styles.emptyState}>
                                    Nu există rezultate pentru această căutare.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION FOOTER */}
            <div className={styles.footerCard}>

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
        </div>
    );
};

export default TableSection;

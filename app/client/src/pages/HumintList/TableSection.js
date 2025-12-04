import React from "react";
import styles from "./TableSection.module.css";

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
        default:
            return "";
    }
};

const TableSection = ({
                          requests,
                          selectedIds,
                          onToggleSelect,
                          onToggleSelectAll,
                          totalCount
                      }) => {
    const visibleIds = requests.map((r) => r.id);
    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const handleSelectAllChange = (e) => {
        onToggleSelectAll(visibleIds, e.target.checked);
    };

    const pendingCount = requests.filter((r) => r.status === "De aprobat").length;
    const clarCount = requests.filter((r) => r.status === "Clarificări").length;

    return (
        <div className={styles.container}>
            {/* ✅ CARD 1: TABS / COUNTERS */}
            <div className={styles.statsCard}>
                <div className={styles.tabsRow}>
                    <button className={`${styles.tab} ${styles.tabGhost}`}>
                        Toate: {totalCount}
                    </button>
                    <button className={`${styles.tab} ${styles.tabActive}`}>
                        De aprobat: {pendingCount}
                    </button>
                    <button className={`${styles.tab} ${styles.tabGhost}`}>
                        Clarificări: {clarCount}
                    </button>
                    <button className={`${styles.tab} ${styles.tabGhost}`}>
                        Aprobate: 0
                    </button>
                    <button className={`${styles.tab} ${styles.tabGhost}`}>
                        Respins: 0
                    </button>
                </div>
            </div>

            {/* ✅ CARD 2: TABLE */}
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
                            <th>Data</th>
                            <th>Stare</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <tr
                                    key={item.id}
                                    className={isSelected ? styles.rowSelected : ""}
                                >
                                    <td className={styles.tdCheckbox}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.projectCell}>
                                                <span className={styles.projectTitle}>
                                                    {item.project}
                                                </span>
                                            <span className={styles.projectSubtitle}>
                                                    {item.description}
                                                </span>
                                        </div>
                                    </td>
                                    <td>{item.type}</td>
                                    <td>{item.responsible}</td>
                                    <td>
                                            <span
                                                className={`${styles.pill} ${priorityClass(
                                                    item.priority
                                                )}`}
                                            >
                                                {item.priority}
                                            </span>
                                    </td>
                                    <td>{item.deadline}</td>
                                    <td>{item.createdBy}</td>
                                    <td>{item.createdAt}</td>
                                    <td>
                                            <span
                                                className={`${styles.statusPill} ${statusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                    </td>
                                    <td>
                                        <button className={styles.linkButton}>
                                            Deschide →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={10} className={styles.emptyState}>
                                    Nu există solicitări pentru filtrul selectat.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ CARD 3: FOOTER / PAGINATION */}
            <div className={styles.footerCard}>
                <div className={styles.footerLeft}>
                    <span>Afișează</span>
                    <select className={styles.footerSelect} defaultValue="10">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span>/ pagină</span>
                </div>
                <div className={styles.footerRight}>
                    Pagina <strong>1</strong> din <strong>1</strong>
                </div>
            </div>
        </div>
    );
};

export default TableSection;

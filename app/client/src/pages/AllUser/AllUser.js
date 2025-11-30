import React, { useMemo, useState } from "react";
import styles from "./AllUser.module.css";

const AllUser = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // TODO: yahan baad me API se real users la sakte ho
    const users = [
        { id: 1, name: "Ana Pop", email: "ana.pop@example.com", role: "Admin" },
        { id: 2, name: "Mihai Ionescu", email: "mihai.ionescu@example.com", role: "Investigator" },
        { id: 3, name: "Carmen Vasilescu", email: "carmen.v@example.com", role: "Analyst" },
        { id: 4, name: "Andrei Georgescu", email: "andrei.g@example.com", role: "Viewer" },
    ];

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const q = searchTerm.toLowerCase();
        return users.filter((u) =>
            `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q)
        );
    }, [searchTerm, users]);

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0).toUpperCase() +
            parts[parts.length - 1].charAt(0).toUpperCase()
        );
    };

    const handleEdit = (user) => {
        // TODO: yahan future me edit modal / page open kar sakte ho
        console.log("Edit user:", user);
    };

    const handleDelete = (user) => {
        // TODO: yahan delete confirm / API call add kar sakte ho
        console.log("Delete user:", user);
    };

    return (
        <div className={styles.page}>
            {/* Top Header */}
            <div className={styles.headerBar}>

                <button className={styles.backBtn} onClick={() => window.history.back()}>
                    ← Înapoi la Dashboard
                </button>

                <h2 className={styles.title}>Lista tuturor utilizatorilor</h2>

            </div>

            {/* Search row (sirf search bar) */}
            <div className={styles.filtersRow}>
                <div className={styles.serMain}>
                    <span className={styles.serIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Caută utilizator după nume sau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table section */}
            <div className={styles.table}>
                {/* Header row */}
                <div className={styles.tableHeader}>
                    <span>Nume</span>
                    <span>E-mail</span>
                    <span>Rol</span>
                    <span>Acțiuni</span>
                </div>

                {/* Data rows */}
                {filteredUsers.map((user) => (
                    <div className={styles.row} key={user.id}>
                        {/* NAME cell */}
                        <div className={styles.userCell}>
                            <div className={styles.avatar}>
                                {getInitials(user.name)}
                            </div>
                            <div className={styles.nameBlock}>
                                <div className={styles.userName}>{user.name}</div>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className={styles.cell}>{user.email}</div>

                        {/* ROLE */}
                        <div className={styles.cell}>{user.role}</div>

                        {/* ACTIONS */}
                        <div className={styles.actions}>
                            <button type="button" className={styles.icon} onClick={() => handleEdit(user)}>
                                {/* EDIT SVG */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#1e293b"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </button>

                            <button type="button" className={styles.iconDelete} onClick={() => handleDelete(user)}>
                                {/* DELETE SVG */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-2 14H7L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                </svg>
                            </button>
                        </div>

                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className={styles.emptyState}>
                        Niciun utilizator găsit pentru căutarea curentă.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUser;

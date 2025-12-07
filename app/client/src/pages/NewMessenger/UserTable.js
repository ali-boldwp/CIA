import React, { useState, useEffect } from "react";
import styles from "./UserTable.module.css";
import { useGetAllUsersQuery } from "../../services/userApi";

const UserTable = ({ mode = "single" }) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const { data, isLoading, isError, error } = useGetAllUsersQuery();

    const users = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    useEffect(() => {
        setSelectedIds([]);
    }, [mode]);

    const toggleRow = (id) => {
        if (mode !== "group") return;

        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleStartChat = (id) => {
        if (id === "all") {
            console.log("Start chat with users:", selectedIds);
        } else {
            console.log("Start chat with user:", id);
        }
    };

    const isRowSelected = (id) => mode === "group" && selectedIds.includes(id);

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Users</h3>

                {mode === "group" && selectedIds.length > 0 && (
                    <button
                        className={styles.bulkActionBtn}
                        onClick={() => handleStartChat("all")}
                    >
                        Start chat with {selectedIds.length} user
                        {selectedIds.length > 1 ? "s" : ""}
                    </button>
                )}
            </div>

            {isLoading && <div>Loading users...</div>}

            {isError && !isLoading && (
                <div>
                    Failed to load users
                    {process.env.NODE_ENV === "development" &&
                        `: ${JSON.stringify(error)}`}
                </div>
            )}

            {!isLoading && !isError && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.thName}>Name</th>
                        <th className={styles.thEmail}>Email</th>
                        <th className={styles.thRole}>Role</th>

                        {mode === "single" && (
                            <th className={styles.thAction}>Action</th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {users.map((user) => {
                        const id = user._id || user.id;
                        const selected = isRowSelected(id);

                        return (
                            <tr
                                key={id}
                                className={`${styles.tr} ${
                                    selected ? styles.trSelected : ""
                                }`}
                                onClick={(e) => {
                                    const tag =
                                        e.target.tagName.toLowerCase();
                                    if (
                                        tag === "button" ||
                                        tag === "input"
                                    )
                                        return;

                                    if (mode === "group") toggleRow(id);
                                }}
                            >
                                <td className={styles.nameCell}>
                                    {mode === "group" && (
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={selected}
                                            onChange={() => toggleRow(id)}
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        />
                                    )}

                                    <span>{user.name}</span>
                                </td>

                                <td className={styles.emailCell}>
                                    {user.email}
                                </td>
                                <td className={styles.roleCell}>
                                    {user.role}
                                </td>

                                {mode === "single" && (
                                    <td className={styles.actionCell}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleStartChat(id)
                                            }
                                        >
                                            Start Chat
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}

                    {users.length === 0 && (
                        <tr>
                            <td colSpan={mode === "single" ? 4 : 3}>
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserTable;

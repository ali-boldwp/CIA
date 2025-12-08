import React, { useState, useEffect } from "react";
import styles from "./UserTable.module.css";
import { useGetAllUsersQuery } from "../../services/userApi";
import {
    useCreateDirectChatMutation,
    useCreateGroupChatMutation,
} from "../../services/chatApi";
import { useNavigate } from "react-router-dom";

const UserTable = ({ mode = "single" }) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const navigate = useNavigate();

    // backend se users
    const { data, isLoading, isError, error } = useGetAllUsersQuery();

    const users = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    // direct chat hook (single mode)
    const [createDirectChat, { isLoading: isCreatingDirect }] =
        useCreateDirectChatMutation();

    // group chat hook (multi mode)
    const [createGroupChat, { isLoading: isCreatingGroup }] =
        useCreateGroupChatMutation();

    // mode change hote hi selection reset
    useEffect(() => {
        setSelectedIds([]);
    }, [mode]);

    const toggleRow = (id) => {
        if (mode !== "group") return;

        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const isRowSelected = (id) =>
        mode === "group" && selectedIds.includes(id);

    const handleStartChat = async (id) => {
        // 🔵 GROUP MODE → top button "Start chat with X users"
        if (mode === "group" && id === "all") {
            if (!selectedIds.length) return;

            try {
                // simple group name – baad me input se le sakte ho
                const groupName = `Group (${selectedIds.length} users)`;

                const res = await createGroupChat({
                    userIds: selectedIds,
                    groupName,
                }).unwrap();

                const chat = res?.data || res;
                const chatId = chat?._id;

                if (!chatId) {
                    console.error("No chatId from group response", res);
                    return;
                }

                navigate(`/messenger/${chatId}`);
            } catch (err) {
                console.error("Failed to create group chat:", err);
            }

            return; // yahan se nikal jao, neeche single logic na chale
        }

        // 🟢 SINGLE MODE → per-row Start Chat
        if (mode === "single") {
            try {
                const res = await createDirectChat(id).unwrap();

                const chat = res?.data || res;
                const chatId = chat?._id;

                if (!chatId) {
                    console.error("No chatId from direct response", res);
                    return;
                }

                navigate(`/messenger/${chatId}`);
            } catch (err) {
                console.error("Failed to create direct chat:", err);
            }
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Users</h3>

                {/* TOP GROUP BUTTON – sirf group mode me */}
                {mode === "group" && selectedIds.length > 0 && (
                    <button
                        className={styles.bulkActionBtn}
                        onClick={() => handleStartChat("all")}
                        disabled={isCreatingGroup}
                    >
                        {isCreatingGroup
                            ? "Creating group..."
                            : `Start chat with ${selectedIds.length} user${
                                selectedIds.length > 1 ? "s" : ""
                            }`}
                    </button>
                )}
            </div>

            {/* loading / error states */}
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

                        {/* Action column only in SINGLE mode */}
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

                                {/* Action buttons only in SINGLE mode */}
                                {mode === "single" && (
                                    <td className={styles.actionCell}>
                                        <button
                                            className={styles.actionBtn}
                                            disabled={isCreatingDirect}
                                            onClick={() =>
                                                handleStartChat(id)
                                            }
                                        >
                                            {isCreatingDirect
                                                ? "Starting..."
                                                : "Start Chat"}
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

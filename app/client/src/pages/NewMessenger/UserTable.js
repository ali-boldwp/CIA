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
    const [showPopup, setShowPopup] = useState(false);
    const [groupName, setGroupName] = useState("");

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

    const startSingleChat = async (id, name) => {
        try {
            const res = await createDirectChat(id).unwrap();
            const chat = res?.data || res;

            if (chat?._id) {
                // ✅ save chatId -> name mapping
                const prev = JSON.parse(localStorage.getItem("dmNames") || "{}");
                prev[chat._id] = name;
                localStorage.setItem("dmNames", JSON.stringify(prev));

                navigate(`/messenger/${chat._id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };



    // 🔵 CONFIRM GROUP CREATE
    const confirmCreateGroup = async () => {
        if (!groupName.trim()) return;

        try {
            const res = await createGroupChat({
                userIds: selectedIds,
                groupName: groupName.trim(),
            }).unwrap();

            const chat = res?.data || res;
            if (chat?._id) {
                setShowPopup(false);
                setGroupName("");
                setSelectedIds([]);
                navigate(`/messenger/${chat._id}`);
            }
        } catch (err) {
            console.error(err);
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
                        onClick={() => setShowPopup(true)}
                    >
                        Start chat with {selectedIds.length} user
                        {selectedIds.length > 1 ? "s" : ""}
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
                                onClick={() =>
                                    mode === "group" && toggleRow(id)
                                }
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
                                    {user.name}
                                </td>

                                <td>{user.email}</td>
                                <td>{user.role}</td>

                                {mode === "single" && (
                                    <td>
                                        <button
                                            disabled={isCreatingDirect}
                                            onClick={() => startSingleChat(id, user.name)}
                                            className={styles.bulkActionBtn}
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
            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h4>Creează un grup</h4>

                        <input
                            type="text"
                            placeholder="Introdu numele grupului"
                            value={groupName}
                            onChange={(e) =>
                                setGroupName(e.target.value)
                            }
                            className={styles.popupInput}
                            autoFocus
                        />

                        <div className={styles.popupActions}>
                            <button
                                onClick={() => setShowPopup(false)}
                                className={styles.popupCancel}
                            >
                                Anulează
                            </button>

                            <button
                                onClick={confirmCreateGroup}
                                disabled={
                                    !groupName.trim() || isCreatingGroup
                                }
                                className={styles.bulkActionBtn}
                            >
                                {isCreatingGroup ? "Se creează..." : "Creează"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserTable;

import React, {useEffect, useState, useRef} from "react";
import "../MessengerPage.css";
import socket from "../../../socket";
import {useSendMessageMutation, useDownloadFileMutation} from "../../../services/messageApi";
import {useGetAllUsersQuery} from "../../../services/userApi";
import {
    FiSearch,
    FiUserPlus,
    FiTrash2,
    FiVolumeX,
    FiArchive,
    FiPaperclip,
    FiSend,
    FiLogOut,
} from "react-icons/fi";
import {
    useRemoveMemberMutation,
    useLeaveGroupMutation,
    useDeleteGroupMutation,
    useMuteChatMutation,
    usePinChatMutation,
    useAddMembersToGroupMutation,
    useMarkSeenMutation,
}
    from "../../../services/chatApi";
import {FaThumbtack} from "react-icons/fa6";
import {Link, useNavigate, useParams} from "react-router-dom";
import styles from "../../Manager/Components/Team/Team.module.css";
import './popup.css'
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import Sidebar from "./Sidebar";


const MessengerPage = ({
                           chatID,
                           data,
                           chats,
                           refetchChats
                       }) => {

    const {id: ChatID} = useParams();
    const {user, loading} = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [projectFiles, setProjectFiles] = useState([]);
    const [chatFilter, setChatFilter] = useState("all");


    const [addMembersToGroup] = useAddMembersToGroupMutation();

    const messagesRef = useRef(null);
    const messagesEndRef = useRef(null);

    const navigate = useNavigate();
    const {data: allUsers} = useGetAllUsersQuery();
    const [removeMember] = useRemoveMemberMutation();
    const [leaveGroup] = useLeaveGroupMutation();
    const [deleteGroup] = useDeleteGroupMutation();
    const [muteChat] = useMuteChatMutation();
    const [pinChat] = usePinChatMutation();
    const [downloadFile] = useDownloadFileMutation();


    const [chat, setChat] = useState(ChatID || "");

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;


    const [searchTerm, setSearchTerm] = useState("");
    const [oldmessage, setOldMessage] = useState([]);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    const [messageSearch, setMessageSearch] = useState("");

    const [text, setText] = useState("");
    const [sendMessage] = useSendMessageMutation();
    const [markSeen] = useMarkSeenMutation();


    const currentChat = chats?.data?.find(c => c._id === chat) || null;
    const isOpenChat = chat === "open";
    const showGroupActions = isOpenChat || (currentChat?.isGroup && (currentChat?.participants?.length || 0) > 2);

    const getSenderName = (senderId) => {
        const participant = currentChat?.participants?.find(
            (p) => p._id === senderId || p.user === senderId
        );
        if (participant?.name) return participant.name;

        const matchedUser = allUsers?.data?.find((u) => u._id === senderId);
        return matchedUser?.name;
    };

    useEffect(() => {
        const nextChatId = ChatID || "open";
        setChat(nextChatId);
        socket.emit("join_chat", nextChatId);
    }, [ChatID]);

    useEffect(() => {
        if (data) {
            try {

                console.log("API RESPONSE:", data.data);
                setOldMessage(data?.data || []);
                setHasMore(true);
                setProjectFiles(data?.projectFiles || []);
                console.log("Messages:", oldmessage);

            } catch (e) {
                console.log(e)
            }
        }
    }, [data]);

    useEffect(() => {
        if (!chat) return;

        const joinChat = () => {
            socket.emit("join_chat", chat);
        };

        if (socket.connected) {
            joinChat();
        }

        socket.on("connect", joinChat);

        return () => {
            socket.off("connect", joinChat);
        };
    }, [chat]);

    useEffect(() => {

        const handleNewMessage = async (msg) => {
            const resolvedName = typeof msg.sender === "string"
                ? getSenderName(msg.sender)
                : msg.sender?.name;
            const normalizedMessage = {
                ...msg,
                createdAt: msg.createdAt || new Date().toISOString(),
                sender: typeof msg.sender === "string"
                    ? {
                        _id: msg.sender,
                        name: resolvedName,
                    }
                    : msg.sender,
            };

            setOldMessage(prev => [...prev, normalizedMessage]);

            // auto-mark seen if user is viewing that chat
            if (msg.chatId === chat || (!msg.chatId && chat === "open")) {
                try {
                    await markSeen(chat).unwrap();

                    // update UI after marking seen
                    msg.seenBy = [...(msg.seenBy || []), currentUserId];

                } catch (e) {
                }
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };

    }, [chat, currentUserId, markSeen, currentChat, allUsers]);

    const openChat = async (ID) => {

        setOldMessage([]);
        setChat(ID);

        try {
            await markSeen(ID).unwrap();
            refetchChats();
        } catch (e) {
            console.log("Seen error", e);
        }

        navigate(`/messenger/${ID}`);
    };

    const loadOlderMessages = async () => {
        if (!oldmessage.length || loadingOlder || !hasMore) return;

        setLoadingOlder(true);

        try {
            const oldestId = oldmessage[0]._id;

            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/chats/${ChatID}/messages?before=${oldestId}&limit=100`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const result = await res.json();

            if (result.data.length > 0) {
                setOldMessage(prev => [...result.data, ...prev]);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingOlder(false);
        }
    };


    useEffect(() => {
        if (oldmessage.length > 0) {
            messagesEndRef.current?.scrollIntoView({behavior: "auto"});
        }
    }, [oldmessage]);


    useEffect(() => {
        if (oldmessage.length > 0) {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [oldmessage]);


    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            const res = await sendMessage({
                chatId: chat,
                text: text
            }).unwrap();

            setText("");

        } catch (err) {
            console.error("Send Error:", err);
        }
    };

    const getParticipants = () => {
        if (!allUsers?.data || !chats?.data) return [];

        const currentChat = chats.data.find(c => c._id === chat);
        if (!currentChat || !currentChat.isGroup) return [];

        return currentChat.participants.map(p => {
            const user = allUsers.data.find(u => u._id === p.user);
            return user ? {id: user._id, name: user.name} : null;
        }).filter(Boolean);
    };


    const handleRemoveMember = async (userId) => {
        try {
            await removeMember({
                chatId: chat,
                userId: userId
            }).unwrap();

            toast("Membru șters cu succes!");

        } catch (err) {
            console.error("Remove member error:", err);
            toast.error("Ștergerea membrului a eșuat.");
        }
    };


    const handleLeaveGroup = async () => {
        try {
            await leaveGroup(chat).unwrap();

            toast("Ai părăsit grupul."); // Romanian: You left the group

            navigate("/messenger"); // redirect to inbox

        } catch (err) {
            console.error("Leave group error:", err);
            toast.error("Nu ai putut părăsi grupul.");
        }
    };


    const handleDeleteGroup = async () => {
        try {
            await deleteGroup(chat).unwrap();

            toast("Grup șters cu succes!");

            navigate("/messenger"); // redirect user

        } catch (err) {
            console.error("Delete group error:", err);
            toast.error("Ștergerea grupului a eșuat.");
        }
    };


    const handleMute = async () => {
        const currentChatObj = chats?.data?.find(c => c._id === chat);
        if (!currentChatObj) return;

        const participant = currentChatObj.participants.find(
            p => p.user === currentUserId
        );

        const newValue = !participant?.muted;

        try {
            await muteChat({chatId: chat, mute: newValue}).unwrap();
            await refetchChats();

            if (newValue) toast("Conversația a fost mutată!");
            else toast("Conversația a fost demutată!");

        } catch (err) {
            toast.error("Eroare: nu s-a putut modifica starea mute.");
        }
    };


    const handlePin = async () => {
        const currentChat = chats?.data?.find(c => c._id === chat);
        const newValue = !currentChat?.isPinned;

        try {
            await pinChat({chatId: chat, pin: newValue}).unwrap();

            if (newValue) toast("Chat fixat în partea de sus!");
            else toast("Chatul a fost desfăcut din pin!");

        } catch (err) {
            toast.error("Eroare: nu s-a putut modifica pin-ul.");
        }
    };



    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) {
            toast.error("Select at least one member!");
            return;
        }

        try {
            await addMembersToGroup({
                chatId: chat,
                users: selectedMembers
            }).unwrap();

            toast("Membrii au fost adăugați cu succes!");

            setIsModalOpen(false);
            setSelectedMembers([]);

            refetchChats();

        } catch (error) {
            console.error(error);
            toast.error("Adăugarea membrilor a eșuat.");
        }
    };


    const filteredChats = (chats?.data || [])
        .filter((c) => {
            if (chatFilter === "groups") return c.isGroup === true;
            if (chatFilter === "dm") return c.isGroup === false;
            return true; // all
        })
        .filter((c) => {
            if (!searchTerm.trim()) return true;

            const search = searchTerm.toLowerCase();

            if (c.isGroup) {
                return c.groupName?.toLowerCase().includes(search);
            }

            const otherUser = c.participants.find(p => p._id !== user?._id);
            return otherUser?.name?.toLowerCase().includes(search);
        });


    const filterMessages = (msgs) => {
        if (!messageSearch.trim()) return msgs;

        const search = messageSearch.toLowerCase();

        return msgs.filter(m =>
            m.text?.toLowerCase().includes(search)
        );
    };

    const handleDownload = async (file) => {
        try {
            const blob = await downloadFile(file).unwrap();

            // 🔥 AUTO DOWNLOAD
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = file; // filename
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download failed", error);
        }
    };


    return (
        <div className="app-bg">
            <div className="app-shell">

                {/* 3-column body */}
                <div className="body">

                    <Sidebar
                        chatFilter={chatFilter}
                        chat={chat}
                        setChat={setChat}
                        filteredChats={filteredChats}
                        user={user}
                        openChat={openChat}
                        setChatFilter={setChatFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />


                    {/* CENTER: chat */}
                    <main className="chat card">
                        <div className="chat-header">
                            {/* LEFT SIDE: title + tags on the same row */}
                            <div className="chat-header-left">
                                <div className="chat-title">{ currentChat?.groupName}</div>
                                <div className="chat-tags">

                                    {/* PIN BUTTON */}
                                    {isOpenChat ? (
                                        <span className="tag tag-pin" style={{cursor: "default"}}>
                                            <span className="tag-icon">
                                                <FaThumbtack style={{color: "red"}}/>
                                            </span>
                                            Pinned
                                        </span>
                                    ) : (
                                        <span className="tag tag-pin" onClick={handlePin} style={{cursor: "pointer"}}>
                                            <span className="tag-icon">
                                                <FaThumbtack style={{color: currentChat?.isPinned ? "red" : "gray"}}/>
                                            </span>
                                            {currentChat?.isPinned ? "Pinned" : "Pin"}
                                        </span>
                                    )}

                                    {!isOpenChat && (
                                        <>
                                            {/* MUTE BUTTON */}
                                            <span
                                                className="tag tag-mute"
                                                onClick={handleMute}
                                                style={{cursor: "pointer"}}
                                            >
                                                <FiVolumeX
                                                    className="tag-icon"
                                                    style={{color: currentChat?.isMuted ? "orange" : "gray"}}
                                                />
                                                {currentChat?.isMuted ? "Muted" : "Mute"}
                                            </span>

                                            {/* Archive — (if needed later) */}
                                            <span className="tag tag-archive">
                                                <FiArchive className="tag-icon"/>
                                                Archive
                                            </span>
                                        </>
                                    )}
                                </div>

                            </div>

                            {/* RIGHT SIDE: search input */}
                            <div className="input-with-icon chat-search-wrapper">
                                <FiSearch className="input-search-icon"/>
                                <input
                                    className="input chat-search"
                                    placeholder="Caută în conversație..."
                                    value={messageSearch}
                                    onChange={(e) => setMessageSearch(e.target.value)}
                                    style={{paddingLeft: '30px'}}
                                />
                                <div className={'option-dots'}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>

                        </div>


                        {/* messages area */}
                        <div
                            className="chat-messages"
                            ref={messagesRef}
                            onScroll={() => {
                                if (!messagesRef.current) return;
                                
                                if (messagesRef.current.scrollTop === 0) {
                                    loadOlderMessages();
                                }
                            }}
                        >
                            {loadingOlder && (
                                <div className="chat-loading-messages">
                                    <div className="spinner"></div>
                                </div>
                            )}


                            {/* attachments row */}
                            <div className="chat-attachments">
                                {projectFiles.map((file, index) => (
                                    <div
                                        style={{cursor: "pointer"}}
                                        key={index}
                                        className="attachment-card attachment-clickable"
                                        onClick={() => handleDownload(file)}
                                    >
                                        <div className="attachment-name">
                                            <FiPaperclip className="attachment-icon"/>
                                            {file}
                                        </div>
                                        <div className="attachment-sub">Download</div>
                                    </div>
                                ))}
                            </div>

                            {filterMessages(oldmessage).map((msg, i) => {
                                const isMe = msg.sender?._id === currentUserId;
                                const hasSeen = msg.seenBy?.some(uid => uid !== currentUserId);

                                return (
                                    <div key={msg._id || i} className={`chat-bubble ${isMe ? "me" : "other"}`}>
                                        <div className="bubble-text">{msg.text}</div>

                                        <div className="bubble-footer">
                    <span className="bubble-name">
                        {isMe ? "Me" : msg.sender?.name}
                    </span>

                                            <span className="bubble-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>

                                            {isMe && (
                                                <span className="bubble-seen">
                            {hasSeen ? "Seen" : "Sent"}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}


                            {/*{filterMessages(messages).map((msg, i) => {
                                const isMe = msg.sender === currentUserId;
                                const hasSeen = msg.seenBy?.some(uid => uid !== currentUserId);

                                return (
                                    <div key={msg._id || `live-${i}`}
                                         className={`chat-bubble ${isMe ? "me" : "other"}`}>
                                        <div className="bubble-text">{msg.text}</div>

                                        <div className="bubble-footer">
                    <span className="bubble-name">
                        {isMe ? "Me" : msg.senderName}
                    </span>

                                            <span className="bubble-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>

                                            {isMe && (
                                                <span className="bubble-seen">
                            {hasSeen ? "Seen" : "Sent"}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}*/}

                            {/* ✅ bottom anchor */}
                            <div ref={messagesEndRef}/>
                        </div>


                        {/* composer */}
                        <div className="chat-composer">
                            <div className="chat-composer-left">
                                <input
                                    className="input composer-input"
                                    placeholder="Scrie un mesaj…"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                            </div>

                            <button className="btn-primary composer-send" onClick={handleSend}>
                                <FiSend className="btn-icon"/>
                                Trimite
                            </button>
                        </div>

                    </main>

                    {/* RIGHT: details */}
                    <aside className="sidebar-right card" style={{maxWidth: '350px'}}>
                        {showGroupActions && (
                            <div className="sidebar-right-section">
                                <div className="rightCreateGroup">
                                    <div>
                                        <div className="section-title">Detalii conversație</div>
                                        <div className="section-subtitle">Membri
                                            ({chats?.data?.find(c => c._id === chat)?.participants?.length || 0})
                                        </div>
                                    </div>
                                    <button
                                        className="pill"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <FiUserPlus className="pill-icon"/>
                                        Adaugă în grup
                                    </button>

                                </div>
                                <div className="member-list">
                                    {getParticipants().map((member, i) => (
                                        <div className="member-row" key={i}>

                                            <div className={"member-avatar member-avatar-" + (i % 10)}/>

                                            <div className="member-name">{member.name}</div>

                                            <div className="member-controls">
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleRemoveMember(member.id)}
                                                >
                                                    🗑 Șterge
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showGroupActions && (
                            <div className="sidebar-right-section">
                                <div className="section-subtitle">Permisiuni</div>

                                <div
                                    style={{

                                        // display: "flex",
                                        // flexDirection: "column",   // 👈 items ko column banayega
                                        // alignItems: "center",      // 👈 center horizontally (optional)
                                        // justifyContent: "center",  // 👈 vertical center (optional)
                                        // width: "100%",
                                        gap: "10px",
                                    }}
                                >
                                    <button className="pill pill-warning flex-start">
                                        Șterge grup doar Manager
                                    </button>

                                    <button className="pill flex-start">
                                        Adăugare/ștergere membri: Manager
                                    </button>
                                    <button className="pill flex-start">
                                        Pin/Mute/Archive: toți membrii
                                    </button>

                                </div>


                            </div>
                        )}

                        {/*<div className="sidebar-right-section">
                            <div className="section-subtitle">Log audit</div>

                            <ul className="audit-list">
                                {auditLoading && <li>Se încarcă logurile…</li>}

                                {auditError && <li>Eroare la încărcarea logurilor</li>}

                                {!auditLoading &&
                                    !auditError &&
                                    (auditData?.data || []).length === 0 && (
                                        <li>Nicio activitate încă</li>
                                    )}

                                {(auditData?.data || []).map((log) => (
                                    <li key={log._id}>
                                        {new Date(log.timestamp).toLocaleTimeString("ro-RO", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {" — "}
                                        <strong>{log.userId?.name || "Utilizator"}</strong>{" "}
                                        {log.action}
                                    </li>
                                ))}
                            </ul>
                        </div>*/}


                        {showGroupActions && (
                            <div className="sidebar-right-footer">
                                <button
                                    className="btn-outline full-width"
                                    onClick={handleLeaveGroup}
                                >
                                    <FiLogOut className="btn-icon"/>
                                    Ieșire grup
                                </button>

                                <button
                                    className="btn-outline full-width remove"
                                    onClick={handleDeleteGroup}
                                >
                                    <FiTrash2 className="btn-icon"/>
                                    Șterge grup (Mgr)
                                </button>

                            </div>
                        )}
                    </aside>
                    {isModalOpen && (
                        <div className="popup-overlay">
                            <div className="popup-card">

                                {/* HEADER */}
                                <div className="popup-header">
                                    <h3>Membri</h3>
                                    <button className="popup-close" onClick={() => setIsModalOpen(false)}>×</button>
                                </div>

                                <div className="popup-search">
                                    <span className="popup-search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Caută utilizatori..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* LIST */}
                                {/* USER LIST */}
                                <div className="popup-user-list">

                                    {(() => {
                                        const filteredUsers = (allUsers?.data || []).filter(user =>
                                            user.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        );

                                        if (filteredUsers.length === 0) {
                                            return (
                                                <div className="no-users-found">
                                                    Niciun membru găsit
                                                </div>
                                            );
                                        }

                                        return filteredUsers.map((user, i) => {
                                            const isSelected = selectedMembers.includes(user._id);

                                            return (
                                                <div className="popup-user-row" key={user._id}>

                                                    <div className={`popup-avatar avatar-${i % 5}`}>
                                                        {user.name.charAt(0)}
                                                    </div>

                                                    <div className="popup-user-info">
                                                        <div className="popup-user-name">{user.name}</div>
                                                    </div>

                                                    <div className="popup-status">
                                                        {isSelected ? (
                                                            <span className="status-added">Adăugat</span>
                                                        ) : (
                                                            <span className="status-rejected">Selectează</span>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="checkbox"
                                                        className="popup-checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedMembers(prev =>
                                                                prev.includes(user._id)
                                                                    ? prev.filter(id => id !== user._id)
                                                                    : [...prev, user._id]
                                                            );
                                                        }}
                                                    />

                                                </div>
                                            );
                                        });
                                    })()}
                                </div>


                                {/* FOOTER */}
                                <button className="popup-add-btn" onClick={handleAddMembers}>
                                    + Adaugă membri
                                </button>

                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default MessengerPage;

import React, {useEffect, useState} from "react";
import "../MessengerPage.css";
import socket from "../../../socket";
import { useGetMessagesQuery, useSendMessageMutation } from "../../../services/messageApi";
import {useGetAllUsersQuery} from "../../../services/userApi";
import {
    FiDownload,
    FiSettings,
    FiSearch,
    FiHash,
    FiUsers,
    FiMessageCircle,
    FiPlus,
    FiUserPlus,
    FiUserMinus,
    FiTrash2,
    FiAlertTriangle,
    FiVolumeX,
    FiArchive,
    FiPaperclip,
    FiSend,
    FiShield,
    FiLogOut,
} from "react-icons/fi";
import {
    useGetMyChatsQuery,
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
import {Link, useNavigate,useParams} from "react-router-dom";
import styles from "../../Manager/Components/Team/Team.module.css";
import './popup.css'
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

function Header() {
    return (
        <div className="Mheader">
            <h2 className="header-title">💬 Messenger — Toți / Grupuri / DM</h2>
        </div>
    );
}

const MessengerPage = ({chatID}) => {

    const {id:ChatID}=useParams();
    const { user, loading } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [addMembersToGroup] = useAddMembersToGroupMutation();


    const navigate = useNavigate();
    const {data: allUsers} = useGetAllUsersQuery();
    const [removeMember] = useRemoveMemberMutation();
    const [leaveGroup] = useLeaveGroupMutation();
    const [deleteGroup] = useDeleteGroupMutation();
    const [muteChat] = useMuteChatMutation();
    const [pinChat] = usePinChatMutation();



    const [chat, setChat] = useState(ChatID);


    const [searchTerm, setSearchTerm] = useState("");
    const [messages, setMessages] = useState([]);
    const [oldmessage, setOldMessage] = useState([]);

    const [text, setText] = useState("");
    const [sendMessage] = useSendMessageMutation();
    const [markSeen] = useMarkSeenMutation();
    const {data, isLoading} = useGetMessagesQuery(chat, {skip: chat === "open"});
    const {data: chats, isLoading: chatsLoading , refetch: refetchChats} = useGetMyChatsQuery();

    const currentChat = chats?.data?.find(c => c._id === chat) || null;

    useEffect(() => {
        if (ChatID) {
            setChat(ChatID);
            socket.emit("join_chat", ChatID);
        }
    }, [ChatID]);

    useEffect(() => {
        if (data) {
            try {

                console.log("API RESPONSE:", data.data);
                setOldMessage(data?.data);
                console.log("Messages:", oldmessage);

            } catch (e) {
                console.log(e)
            }
        }
    }, [data]);

    useEffect(() => {

        console.log("Joining chat:", chatID);
        socket.emit("join_chat", chatID);

        socket.on("new_message", async (msg) => {

            setMessages(prev => [...prev, msg]);

            // auto-mark seen if user is viewing that chat
            if (msg.chatId === chat) {
                try {
                    await markSeen(chat).unwrap();

                    // update UI after marking seen
                    msg.seenBy = [...(msg.seenBy || []), currentUserId];

                } catch (e) {}
            }
        });


        return () => {
            socket.off("new_message");
        };

    }, []);

    const openChat = async (ID) => {

        setOldMessage([]);
        setMessages([]);

        setChat(ID);

        try {
            await markSeen(ID).unwrap();
            refetchChats();
        } catch (e) {
            console.log("Seen error", e);
        }

        navigate(`/messenger/${ID}`);
    };




    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

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
        const confirmDelete = window.confirm("Sigur dorești să ștergi acest grup? Această acțiune este permanentă.");


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
            await muteChat({ chatId: chat, mute: newValue }).unwrap();
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
            await pinChat({ chatId: chat, pin: newValue }).unwrap();

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




    return (
        <div className="app-bg">
            <div className="app-shell">
                <Header/>

                {/* top toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <div className="input-with-icon">
                            <FiSearch className="input-search-icon"/>
                            <input
                                className="input search-input"
                                placeholder="Caută în mesaje..."
                            />
                        </div>
                    </div>

                    <div className="toolbar-center">
                        <div className="toolbar-pill-group">
                            <button className="pill pill-active pill-unique">
                                Toți
                            </button>
                            <button className="pill pill-unique">Grupuri</button>
                            <button className="pill pill-unique">DM</button>
                            <button className="pill">
                                <FiHash className="pill-icon"/>
                                Serie butoane
                            </button>
                            <Link to={"/messenger/new"} className="pill">
                                <FiPlus className="pill-icon" />
                                Creează grup
                            </Link>
                        </div>
                    </div>

                    <div className="toolbar-right">
                        <button className="pill pill-warning">
                            {/*<FiShield className="pill-icon" />*/}
                            Permisiuni doar Manager
                        </button>
                    </div>
                </div>

                {/* 3-column body */}
                <div className="body">
                    {/* LEFT: conversations */}
                    <aside className="sidebar-left card">
                        <div className="sidebar-left-header">
                            <div>
                                <div className="label-muted">Conversații</div>
                                <div className="label-small">Pinned</div>
                            </div>
                        </div>

                        <div className="conversation-list">
                            <div
                                className={
                                    "conversation-item" +
                                    (chat === 'open' ? " conversation-item-active" : "")
                                }
                                onClick={() => setChat('open')}
                            >
                                <div className="conversation-avatar"/>
                                <div className="conversation-main">
                                    <div className="conversation-name">{'General'}</div>
                                    <div className="conversation-sub">
                                        Toate conversațiile
                                    </div>
                                </div>
                                <div className="conversation-meta">
                                    <span className="dot green"/>
                                    <span className="dot orange"/>
                                    <span className="dot red"/>
                                </div>
                            </div>
                            {
                                (chats?.data || []).map((c) => (
                                    <div
                                        className={
                                            "conversation-item" +
                                            (c._id === chat ? " conversation-item-active" : "")
                                        }
                                        key={c._id}
                                        onClick={() => openChat(c._id)}
                                    >
                                        <div className="conversation-avatar" />

                                        <div className="conversation-main">
                                            <div className="conversation-name">
                                                <span>
                                                {c.isGroup
                                                    ? (c.groupName.length > 10 ? c.groupName.slice(0, 20) + "..." : c.groupName)
                                                    : (
                                                        c.participants.find(p => p._id !== user._id)?.name.length > 20
                                                            ? c.participants.find(p => p._id !== user._id)?.name.slice(0, 20) + "..."
                                                            : c.participants.find(p => p._id !== user._id)?.name
                                                    )
                                                }


                                                { !c.isGroup ? <>
                                                {c.participants[0]._id !== user._id ? c.participants[0].name : "" }
                                                {c.participants[1]._id !== user._id ? c.participants[0].name : "" }
                                                </> : "" }
                                                    </span>
                                                {/* 🔥 PIN ICON HERE */}
                                                {c.isPinned && (
                                                    <FaThumbtack className="sidebar-pin-icon" />
                                                )}
                                            </div>

                                            <div className="conversation-sub">
                                                {c.lastMessage ? c.lastMessage.text.length > 20 ? c.lastMessage.text.slice(0,20)+ "..." :c.lastMessage.text : "No messages yet"}
                                            </div>
                                        </div>
                                        <div className="conversation-meta">
                                            {c.unreadCount > 0 && (
                                                <span className="unread-badge">{c.unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }



                        </div>
                    </aside>

                    {/* CENTER: chat */}
                    <main className="chat card">
                        <div className="chat-header">
                            {/* LEFT SIDE: title + tags on the same row */}
                            <div className="chat-header-left">
                                <div className="chat-title">Grup: DD ABC</div>
                                <div className="chat-tags">

                                    {/* PIN BUTTON */}
                                    <span className="tag tag-pin" onClick={handlePin} style={{ cursor: "pointer" }}>
    <span className="tag-icon">
        <FaThumbtack style={{ color: currentChat?.isPinned ? "red" : "gray" }} />
    </span>
                                        {currentChat?.isPinned ? "Pinned" : "Pin"}
</span>


                                    {/* MUTE BUTTON */}
                                    <span
                                        className="tag tag-mute"
                                        onClick={handleMute}
                                        style={{ cursor: "pointer" }}
                                    >
    <FiVolumeX
        className="tag-icon"
        style={{ color: currentChat?.isMuted ? "orange" : "gray" }}
    />
                                        {currentChat?.isMuted ? "Muted" : "Mute"}
</span>



                                    {/* Archive — (if needed later) */}
                                    <span className="tag tag-archive">
        <FiArchive className="tag-icon" />
        Archive
    </span>
                                </div>

                            </div>

                            {/* RIGHT SIDE: search input */}
                            <div className="input-with-icon chat-search-wrapper">
                                <FiSearch className="input-search-icon"/>
                                <input
                                    className="input chat-search"
                                    placeholder="Caută în conversație..."
                                />
                            </div>
                        </div>


                        {/* messages area */}
                        <div className="chat-messages">


                            {/* attachments row */}
                            <div className="chat-attachments">
                                {["Report_v1.pdf", "Anexa1.xlsx", "Schena.png"].map((file) => (
                                    <div key={file} className="attachment-card">
                                        <div className="attachment-name">
                                            <FiPaperclip className="attachment-icon"/>
                                            {file}
                                        </div>
                                        <div className="attachment-sub">Preview</div>
                                    </div>
                                ))}
                            </div>
                            {oldmessage.map((msg, i) => {
                                const isMe = msg.sender?._id === currentUserId;
                                const hasSeen = msg.seenBy?.some(uid => uid !== currentUserId);


                                return (
                                    <div key={i} className={`chat-bubble ${isMe ? "me" : "other"}`}>
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



                            {messages.map((msg, i) => {
                                const isMe = msg.sender === currentUserId;
                                const hasSeen = msg.seenBy?.some(uid => uid !== currentUserId);


                                return (
                                    <div key={i} className={`chat-bubble ${isMe ? "me" : "other"}`}>
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
                            })}


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
                    <aside className="sidebar-right card">
                        <div className="sidebar-right-section">
                            <div className="rightCreateGroup">
                            <div>
                            <div className="section-title">Detalii conversație</div>
                            <div className="section-subtitle">Membri ({chats?.data?.find(c => c._id === chat)?.participants?.length-1 || 0})</div>
                            </div>
                                <button
                                    className="pill"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <FiUserPlus className="pill-icon" />
                                    Adaugă în grup
                                </button>

                            </div>
                            <div className="member-list">
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
                        </div>

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

                        <div className="sidebar-right-section">
                            <div className="section-subtitle">Log audit</div>
                            <ul className="audit-list">
                                <li>12:12 — Manager a creat grupul „DD ABC”</li>
                                <li>12:21 — Manager a adăugat A. Pop</li>
                                <li>12:25 — Manager a setat permisiuni</li>
                                <li>12:35 — Manager a trimis conversația arhivei</li>
                            </ul>
                        </div>

                        <div className="sidebar-right-footer">
                            <button
                                className="btn-outline full-width"
                                onClick={handleLeaveGroup}
                            >
                                <FiLogOut className="btn-icon"/>
                                Ieșire grup
                            </button>

                            <button
                                className="btn-outline full-width"
                                onClick={handleDeleteGroup}
                            >
                                <FiTrash2 className="btn-icon"/>
                                Șterge grup (Mgr)
                            </button>

                        </div>
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

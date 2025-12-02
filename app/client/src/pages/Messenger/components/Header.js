import React , { useEffect } from "react";
import "../MessengerPage.css";
import socket from "../../../socket";
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

function Header() {
    return (
        <div className="header">
            <h2 className="header-title">💬 Messenger — Toți / Grupuri / DM</h2>

            <div className="header-actions">
                <button className="btn-outline">
                    <FiDownload className="btn-icon" />
                    Export chat
                </button>
                <button className="btn-primary">
                    <FiSettings className="btn-icon" />
                    Setări
                </button>
            </div>
        </div>
    );
}

function MessengerPage() {

    useEffect(() => {
        const CHAT_ID = "692f0cbee1afd5908152efd9";

        console.log("Joining chat:", CHAT_ID);
        socket.emit("join_chat", CHAT_ID);

        socket.on("new_message", (msg) => {
            console.log("📩 New message received:", msg);
            alert("📩 New message: " + msg.text);
        });

        return () => {
            socket.off("new_message");
        };
    }, []);

    return (
        <div className="app-bg">
            <div className="app-shell">
                <Header />

                {/* top toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <div className="input-with-icon">
                            <FiSearch className="input-icon" />
                            <input
                                className="input search-input"
                                placeholder="Caută în mesaje..."
                            />
                        </div>
                    </div>

                    <div className="toolbar-center">
                        {/* all pills inside one centered div */}
                        <div className="toolbar-pill-group">
                            <button className="pill pill-active pill-unique">
                                Toți
                            </button>
                            <button className="pill pill-unique">Grupuri</button>
                            <button className="pill pill-unique">DM</button>
                            <button className="pill">
                                <FiHash className="pill-icon" />
                                Serie butoane
                            </button>
                            <button className="pill">
                                <FiPlus className="pill-icon" />
                                Creează grup
                            </button>
                            <button className="pill">
                                <FiUserPlus className="pill-icon" />
                                 Adaugă în grup
                            </button>
                            <button className="pill">
                                <FiUserMinus className="pill-icon" />
                                 Elimină din grup
                            </button>
                            <button className="pill pill-danger">
                                {/*<FiTrash2 className="pill-icon" />*/}
                                🗑️ Șterge grup
                            </button>
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

                        <div className="conversation-list"  >
                            {[
                                "Grup: DD ABC",
                                "DM: I. Barlu",
                                "Grup: HUNMET Team",
                                "DM: A. Pep",
                                "DM: C. Vasilescu",
                                "Grup: Sales-Ops",
                                "DM: V. Georgescu",
                                "DM: R. Petrescu",
                            ].map((name, idx) => (
                                <div
                                    className={
                                        "conversation-item" +
                                        (idx === 0 ? " conversation-item-active" : "")
                                    }
                                    key={name}
                                >
                                    <div className="conversation-avatar" />
                                    <div className="conversation-main">
                                        <div className="conversation-name">{name}</div>
                                        <div className="conversation-sub">
                                            Toate conversațiile
                                        </div>
                                    </div>
                                    <div className="conversation-meta">
                                        <span className="dot green" />
                                        <span className="dot orange" />
                                        <span className="dot red" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* CENTER: chat */}
                    <main className="chat card">
                        <div className="chat-header">
                            {/* LEFT SIDE: title + tags on the same row */}
                            <div className="chat-header-left">
                                <div className="chat-title">Grup: DD ABC</div>
                                <div className="chat-tags">
                                    <span className="tag tag-pin">
                                        <span className="tag-icon">⭐</span>
                                        Pin
                                    </span>
                                    <span className="tag tag-mute">
                                        <FiVolumeX className="tag-icon" />
                                        Mute
                                    </span>
                                    <span className="tag tag-archive">
                                        <FiArchive className="tag-icon" />
                                        Archive
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT SIDE: search input */}
                            <div className="input-with-icon chat-search-wrapper">
                                <FiSearch className="input-icon" />
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
                                            <FiPaperclip className="attachment-icon" />
                                            {file}
                                        </div>
                                        <div className="attachment-sub">Preview</div>
                                    </div>
                                ))}
                            </div>
                            <div className="message message-out">
                                Mulțumesc, oferiți acum.
                            </div>
                        </div>

                        {/* composer */}
                        <div className="chat-composer">
                            <div className="chat-composer-left">
                                <input
                                    className="input composer-input"
                                    placeholder="Scrie un mesaj… + Atașează + Upload + Caută"
                                />
                            </div>
                            <button className="btn-primary composer-send">
                                <FiSend className="btn-icon" />
                                Trimite
                            </button>
                        </div>
                    </main>

                    {/* RIGHT: details */}
                    <aside className="sidebar-right card">
                        <div className="sidebar-right-section">
                            <div className="section-title">Detalii conversație</div>
                            <div className="section-subtitle">Membri (5)</div>

                            <div className="member-list">
                                {[
                                    "Manager",
                                    "A. Mateiovcu",
                                    "A. Pop",
                                    "C. Vasilescu",
                                    "M. Kotel",
                                ].map((m, i) => (
                                    <div className="member-row" key={m}>
                                        <div className={"member-avatar member-avatar-" + i} />
                                        <div className="member-name">{m}</div>
                                        <div className="member-controls">
                                            <button className="circle-btn">+</button>
                                            <button className="circle-btn">−</button>
                                        </div>
                                    </div>
                                ))}
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
                                    gap: "10px"     , }}
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
                            <button className="btn-outline full-width">
                                <FiLogOut className="btn-icon" />
                                Ieșire grup
                            </button>
                            <button className="btn-outline full-width">
                                <FiTrash2 className="btn-icon" />
                                Șterge grup (Mgr)
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default MessengerPage;

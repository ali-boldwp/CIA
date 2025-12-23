import {FaThumbtack} from "react-icons/fa6";
import {FiSearch} from "react-icons/fi";
import React from "react";

const Sidebar = ({
    chatFilter,
    chat,
    setChat,
    filteredChats,
    user,
    openChat,
    setChatFilter,
    searchTerm,
    setSearchTerm
}) => {

    return (
        <>
            {/* LEFT: conversations */}
            <aside className="sidebar-left card" style={{ width: '320px' }}>

                <div className="toolbar">

                    <div className="toolbar-left">
                        <div className="input-with-icon">
                            <FiSearch className="input-search-icon"/>
                            <input
                                className="input search-input"
                                placeholder="Caută în mesaje..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '30px' }}
                            />
                        </div>
                    </div>

                </div>

                <div className="toolbar-center">
                    <div className="toolbar-pill-group">
                        <button
                            className={`pill pill-unique ${chatFilter === "all" ? "pill-active" : ""}`}
                            onClick={() => setChatFilter("all")}
                        >
                            Toți
                        </button>
                        <button
                            className={`pill pill-unique ${chatFilter === "groups" ? "pill-active" : ""}`}
                            onClick={() => setChatFilter("groups")}
                        >
                            Grupuri
                        </button>
                        <button
                            className={`pill pill-unique ${chatFilter === "dm" ? "pill-active" : ""}`}
                            onClick={() => setChatFilter("dm")}
                        >
                            DM
                        </button>

                        {/*<button onClick={handleDeleteGroup} className="pill pill-danger">
                            <FiTrash2 className="pill-icon" />
                            🗑️ Șterge grup
                        </button>*/}
                    </div>
                </div>
                <div className="sidebar-left-header">
                    <div>
                        <div className="label-muted">Conversații</div>
                        <div className="label-small">Pinned</div>
                    </div>
                </div>

                <div className="conversation-list">
                    {chatFilter === "all" && (
                        <div
                            className={
                                "conversation-item" +
                                (chat === 'open' ? " conversation-item-active" : "")
                            }
                            onClick={() => setChat('open')}
                        >
                            <div className="conversation-avatar"/>
                            <div className="conversation-main">
                                <div className="conversation-name">General</div>
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
                    )}

                    {
                        filteredChats.map((c) => {
                            console.log( "c", c )
                            const otherUser = c.participants?.find(
                                p => p?._id !== user?._id
                            );
                            console.log( "otherUser", otherUser )
                            return(

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
                                            {c.isGroup
                                                ? c.groupName?.length > 17
                                                    ? c.groupName.slice(0, 17) + "..."
                                                    : c.groupName
                                                : otherUser?.name
                                                    ? otherUser.name.length > 15
                                                        ? otherUser.name.slice(0, 15) + "..."
                                                        : otherUser.name
                                                    : "....,"
                                            }

                                            {c.isPinned && (
                                                <FaThumbtack className="sidebar-pin-icon" />
                                            )}
                                        </div>



                                        <div className="conversation-sub">
                                            {c.lastMessage?.text
                                                ? c.lastMessage.text.length > 15
                                                    ? c.lastMessage.text.slice(0, 15) + "..."
                                                    : c.lastMessage.text
                                                : "No messages yet"}
                                        </div>

                                    </div>
                                    <div className="conversation-meta">
                                        {c.unreadCount > 0 && (
                                            <span className="unread-badge">{c.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                            )})
                    }

                    {filteredChats.length === 0 && (
                        <div className="label-small" style={{ padding: "10px 0" }}>
                            Nicio conversație găsită
                        </div>
                    )}

                </div>
            </aside>
        </>
    )

}

export default Sidebar;
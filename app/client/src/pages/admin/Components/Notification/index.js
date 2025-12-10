import React, { useEffect, useState } from "react";
import "./Notification.css";
import {
    useGetNotificationsQuery,
    useMarkAsSeenMutation,
    useGetUnseenCountQuery
} from "../../../../services/notificationApi";

const Notification = ({ onClose }) => {

    const [page, setPage] = useState(1);

    // Load notifications dynamically
    const { data, isLoading } = useGetNotificationsQuery({ page, limit: 10 });
    const notifications = data?.data || [];

    const [markAsSeen] = useMarkAsSeenMutation();

    // Close popup when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest(".notif-box")) onClose();
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    const handleSeen = async (id) => {
        await markAsSeen(id);
    };

    return (
        <div className="notif-container">
            <div className="notif-box animate-popup">

                <div className="notif-header">
                    <h4>Notificări</h4>
                </div>

                <div className="notif-list">

                    {/* Loader */}
                    {isLoading && (
                        <p style={{ textAlign: "center", padding: "10px" }}>
                            Se încarcă...
                        </p>
                    )}

                    {/* Dynamic notifications */}
                    {!isLoading && notifications.length > 0 &&
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={`notif-item ${notif.seen ? "" : "unread"}`}
                                onClick={() => handleSeen(notif._id)}
                            >
                                <span className="notif-dot" />
                                <div>
                                    <p className="notif-text">{notif.text}</p>
                                    <small className="notif-time">
                                        {new Date(notif.createdAt).toLocaleString("ro-RO")}
                                    </small>
                                </div>
                            </div>
                        ))
                    }

                    {/* No notifications */}
                    {!isLoading && notifications.length === 0 && (
                        <p style={{ textAlign: "center", padding: "10px", color: "#999" }}>
                            Nicio notificare
                        </p>
                    )}

                </div>

                {/* Load more button (pagination) */}
                {(data?.total > notifications.length) && (
                    <button className="notif-footer-btn"
                            onClick={() => setPage(prev => prev + 1)}>
                        Încarcă mai mult
                    </button>
                )}

            </div>
        </div>
    );
};

export default Notification;

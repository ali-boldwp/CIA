import React, { useEffect, useState } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import {
    useGetNotificationsQuery,
    useMarkAsSeenMutation,
    useGetUnseenCountQuery
} from "../../../../services/notificationApi";

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
        { label: "an", seconds: 31536000 },
        { label: "lună", seconds: 2592000 },
        { label: "zi", seconds: 86400 },
        { label: "oră", seconds: 3600 },
        { label: "minut", seconds: 60 },
        { label: "secundă", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "e" : ""} în urmă`;
        }
    }

    return "chiar acum";
};


const Notification = ({ onClose }) => {

    const [page, setPage] = useState(1);

    // Load notifications dynamically
    const { data, isLoading } = useGetNotificationsQuery({ page, limit: 10 });
    const notifications = data?.data || [];

    const [markAsSeen] = useMarkAsSeenMutation();

    const navigate=useNavigate();

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
        navigate(id)
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
                                onClick={() => handleSeen(notif.link)}
                            >

                                <div>
                                    <p className="notif-text">{notif.text}</p>
                                    <small className="notif-time">
                                        {timeAgo(notif.createdAt)}
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

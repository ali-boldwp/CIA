import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ onClose }) => {

    // Close when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest(".notif-box")) onClose();
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    return (
        <div className="notif-container">
            <div className="notif-box animate-popup">

                <div className="notif-header">
                    <h4>Notificări</h4>
                </div>

                <div className="notif-list">
                    <div className="notif-item unread">
                        <span className="notif-dot" />
                        <div>
                            <p className="notif-text">Ai un nou proiect asignat.</p>
                            <small className="notif-time">Acum 2 minute</small>
                        </div>
                    </div>

                    <div className="notif-item">
                        <span className="notif-dot blue" />
                        <div>
                            <p className="notif-text">Un mesaj nou în chatul de grup.</p>
                            <small className="notif-time">Acum 1 oră</small>
                        </div>
                    </div>

                    <div className="notif-item">
                        <span className="notif-dot green" />
                        <div>
                            <p className="notif-text">Proiectul "Background Check" a fost finalizat.</p>
                            <small className="notif-time">Ieri</small>
                        </div>
                    </div>
                </div>

                <button className="notif-footer-btn">

                </button>
            </div>
        </div>
    );
};

export default Notification;

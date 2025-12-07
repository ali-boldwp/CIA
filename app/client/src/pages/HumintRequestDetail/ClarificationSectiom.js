import React, { useState, useEffect, useRef } from "react";
import styles from "./Clarification.module.css";

const ClarificationSectiom = ({ onSubmit, onCancel, messages = [], currentUserId }) => {
    const [text, setText] = useState("");
    const chatEndRef = useRef(null);

    // jab bhi messages change hon -> chat bottom pe scroll
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (onSubmit) {
            onSubmit(trimmed); // parent ko sirf message text
        }

        setText("");
    };

    const handleKeyDown = (e) => {
        // WhatsApp style: Enter -> send, Shift+Enter -> new line
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h3 className={styles.title}>Solicită clarificări</h3>
                <p className={styles.subtitle}>
                    Chat de clarificări între tine și analist, pentru această solicitare HUMINT.
                </p>

                {/* CHAT LIST */}
                <div className={styles.chatThread}>
                    {messages.length === 0 && (
                        <p className={styles.emptyState}>
                            Încă nu există mesaje de clarificare.
                        </p>
                    )}

                    {messages.map((msg) => {
                        const id = msg._id;
                        const user = msg.userId || {};
                        const isOwn =
                            user._id === currentUserId ||
                            msg.userId === currentUserId;

                        const name = user.name || (isOwn ? "Tu" : "Utilizator");

                        const rawDate = msg.createdAt;
                        let formattedDate = "";
                        if (rawDate) {
                            try {
                                formattedDate = new Date(rawDate).toLocaleString("ro-RO", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                            } catch {
                                formattedDate = rawDate;
                            }
                        }

                        return (
                            <div
                                key={id}
                                className={`${styles.chatRow} ${
                                    isOwn ? styles.chatRowOwn : styles.chatRowOther
                                }`}
                            >
                                <div className={styles.bubble}>
                                    <div className={styles.bubbleHeader}>
                                        <span className={styles.bubbleName}>{name}</span>
                                        {formattedDate && (
                                            <span className={styles.bubbleTime}>
                                                {formattedDate}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.bubbleMessage}>
                                        {msg.clarificationText}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={chatEndRef} />
                </div>

                {/* WHATSAPP STYLE INPUT BAR */}
                <div className={styles.inputBar}>
                    {onCancel && (
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnSecondary} ${styles.backBtn}`}
                            onClick={onCancel}
                        >
                            Înapoi
                        </button>
                    )}

                    <div className={styles.inputWrapper}>
                        <textarea
                            className={styles.inputArea}
                            placeholder="Scrie clarificarea ta aici..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />

                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.sendBtn}`}
                            onClick={sendMessage}
                            disabled={!text.trim()}
                        >
                            {/* Want icon? You can replace with ➤ or ✉ */}
                            Clarifică
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClarificationSectiom;

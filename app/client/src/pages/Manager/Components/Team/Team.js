import React, { useState } from "react";
import "./Team.css";

// NEW: popup component import
import AddAnalystManager from "./AddAnalystManager";

const Team = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const analysts = [
        { name: "Andrei Pop", initials: "AP", score: 4.9, status: "în lucru", progress: 80 },
        { name: "Carmen Vasilescu", initials: "CV", score: 4.7, status: "în lucru", progress: 35 },
        { name: "Mihai Matei", initials: "MM", score: 4.6, status: "liber", progress: 0 },
        { name: "Iulia Barbu", initials: "IB", score: 4.8, status: "în lucru", progress: 48 },
        { name: "Vlad Georgescu", initials: "VG", score: 4.5, status: "în lucru", progress: 22 },
        { name: "Roxana Petrescu", initials: "RP", score: 4.6, status: "în lucru", progress: 58 },
    ];

    return (
        <div className="main" style={{ marginBottom: "50px" }}>
            <h3 className="team-title">Echipa de analiști</h3>

            <div className="team-wrapper">
                <div className="team-table">
                    <div className="team-header">
                        <span>Nume</span>
                        <span>Scor</span>
                        <span>Stare</span>
                        <span>Progres</span>
                        <span>Acțiuni</span>
                    </div>

                    {analysts.map((a, index) => (
                        <div className="team-row" key={index}>
                            <div className="col name">
                                <span className="initial-badge">{a.initials}</span>
                                <span>{a.name}</span>
                            </div>

                            <div className="col score">{a.score}</div>

                            <div className="col state">
                <span
                    className={`state-badge ${a.status === "liber" ? "free" : "work"}`}
                >
                  {a.status}
                </span>
                            </div>

                            <div className="col progress">
                                <div className="progres-bar">
                                    <div
                                        className="progres-fill"
                                        style={{ width: `${a.progress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-number">{a.progress}%</span>
                            </div>

                            <div className="col actions">
                                <button className="open-btn">Deschide</button>
                                <button className="delete-btn">🗑 Șterge</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* yeh button ab popup open karega */}
            <button
                className="add-btn"
                onClick={() => setShowAddModal(true)}
            >
                + Adaugă analist
            </button>

            {/* NEW: AddAnalystManager popup */}
            <AddAnalystManager
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                // future me agar edit mode chahiye ho to yahan editData pass kar sakte ho
            />
        </div>
    );
};

export default Team;

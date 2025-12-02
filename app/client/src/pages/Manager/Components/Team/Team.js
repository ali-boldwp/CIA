import React from "react";
import "./Team.css";
import { useGetAnalystsQuery } from "../../../../services/userApi";
import { useGetProjectRequestsQuery } from "../../../../services/projectApi";

const Team = () => {

    // Fetch all analysts
    const { data: analystsData } = useGetAnalystsQuery();
    const analysts = analystsData?.data || [];

    // Fetch all projects
    const { data: projectsData } = useGetProjectRequestsQuery();
    const projects = projectsData?.data || [];

    // Only approved projects
    const approvedProjects = projects.filter(
        (p) => p.status?.toLowerCase() === "approved"
    );

    // Function to check workload
    const getAnalystStatus = (id) => {
        const assigned = approvedProjects.some((proj) =>
            proj.assignedAnalysts?.includes(id)
        );
        return assigned ? "în lucru" : "liber";
    };

    const getAnalystProgress = (id) => {
        const assignedProjects = approvedProjects.filter((proj) =>
            proj.assignedAnalysts?.includes(id)
        );

        if (assignedProjects.length === 0) return 0;

        // OPTIONAL: if you want progress, use your own logic
        return Math.min(100, assignedProjects.length * 20);
    };

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
                    <div className="teamBody">
                    {analysts.map((a) => {
                        const status = getAnalystStatus(a._id);
                        const progress = getAnalystProgress(a._id);

                        return (
                            <div className="team-row" key={a._id}>
                                <div className="col name">
                  <span   className={status === "în lucru" ? "purple" : "initial-badge"}>
                    {a.initials || a.name?.slice(0, 2).toUpperCase()}
                  </span>
                                    <span>{a.name}</span>
                                </div>

                                <div className="col score">{a.score || 0}</div>

                                <div className="col state">
                  <span
                      className={`state-badge ${
                          status === "liber" ? "free" : "work"
                      }`}
                  >
                    {status}
                  </span>
                                </div>

                                <div className="col progress">
                                    <div className="progres-bar">
                                        <div
                                            className="progres-fill"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-number">{progress}%</span>
                                </div>

                                <div className="col actions">
                                    <button className="open-btn">Deschide</button>
                                    <button className="delete-btn">🗑 Șterge</button>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;

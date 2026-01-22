
import {Link} from "react-router-dom";


const ProjectRow = ({ projects , safe }) => {

    const safeDate = (date) => {
        if (!date) return "Fără termen";
        const d = new Date(date);
        if (isNaN(d)) return "Fără termen";
        return d.toISOString().split("T")[0];
    };

    return (
        <div className="request-list-wrapper">

            <h3 className="section-title1">Solicitări înregistrate</h3>

            <div className="request-card">
                {projects.map((p) => (
                    <div className="request-row" key={p._id}>

                        {/* LEFT BLOCK */}
                        <div className="left-sideList">
                            <h4 className="project-title">{p.projectName}</h4>
                            <p className="project-subject">{p.projectSubject}</p>
                            <p className="solicitant">Solicitant: {p.clientContactPerson}</p>
                        </div>

                        {/* CENTER GRID */}
                        <div className="middle-grid">

                            <div className="grid-item">
                                <span className="label">Client</span>
                                <span className="value">{p.clientName}</span>
                            </div>

                            <div className="grid-item">
                                <span className="label">Se dorește:</span>

                                <ul className="bullet-list">
                                    {p.servicesRequested.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>


                            <div className="grid-item">
                                <span className="label">Prioritate</span>
                                <span className={`priority-tag ${p.priority.toLowerCase()}`}>
                                    {p.priority}
                                </span>
                            </div>

                            <div className="grid-item">
                                <span className="label">Deadline</span>
                                <span className="deadlineRequest">
                                    {safe(p.deadline)} · 30 zile
                                </span>
                            </div>

                            <div className="grid-item">
                                <span className="label">Livrabil</span>

                                <ul className="bullet-list">
                                    {p.deliverableLanguage?.map((lang, index) => (
                                        <li key={index}>{lang}</li>
                                    ))}
                                </ul>
                            </div>



                        </div>

                        {/* ACTION BUTTON */}
                        <div className="action-col">
                            <Link to={`/project/new/${p._id}`} className="open-btn">
                                Deschide solicitarea
                            </Link>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default ProjectRow;

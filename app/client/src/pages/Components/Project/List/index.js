import Item from "./Item";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "./style.css";

const ProjectList = ({ data, header = false, refetchProjects }) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ sirf /project path par dropdown
    const isProjectPage = location.pathname === "/project";

    // ✅ URL value: Active | Finished
    const uiStatus = searchParams.get("status") || "Active";

    const handleStatusChange = (e) => {
        setSearchParams({ status: e.target.value });
    };

    return (
        <div className="main">
            {/* ✅ Dropdown only on /project */}
            {isProjectPage && (
                <div style={{ marginBottom: "12px", display: "flex", justifyContent: "flex-end" }}>
                    <select
                        value={uiStatus}
                        onChange={handleStatusChange}
                        className="status-select"
                    >
                        <option value="Active">Active</option>
                        <option value="Finished">Finished</option>
                    </select>
                </div>
            )}

            {header && (
                <div className="projects-header" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>
                        Proiecte{" "}
                        <span className="count">{data.length} proiecte</span>
                    </h3>

                    {/* ✅ FIXED LINK */}
                    <Link to="/project/all" style={{ fontSize: "18px" }}>
                        Vezi toate proiectele
                    </Link>
                </div>
            )}

            {/* table */}
            <div className="responsive-table-wrapper">
                <div className="projects-wrapper">
                    <div className="projects-table-header">
                        <span>Nume proiect</span>
                        <span>Deadline</span>
                        <span>Progres</span>
                        <span>Status HUMINT</span>
                        <span style={{ textAlign: "right" }}>Acțiuni</span>
                    </div>

                    <div className="projects-list">
                        {data.map((project) => (
                            <Item
                                key={project._id}
                                data={project}
                                refetchProjects={refetchProjects}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectList;

// src/pages/Manager/Components/StatusSection/index.js
import "./StatusSection.css";
import { Link } from "react-router-dom";
import { useGetProjectRequestsQuery } from "../../../../services/projectApi";
import { useGetAllUsersQuery } from "../../../../services/userApi";

const StatusSection = () => {

    // Projects Fetch
    const { data: projectData, isLoading: loadingProjects } = useGetProjectRequestsQuery();

    const projects = projectData?.data || [];

    // Only Approved
    const approvedReq = projects.filter((p) => p.status?.toLowerCase() === "approved");







    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();

    const users = Array.isArray(usersData)
        ? usersData
        : Array.isArray(usersData?.data)
            ? usersData.data
            : Array.isArray(usersData?.users)
                ? usersData.users
                : [];

    const totalUsers = users.length;

    return (
        <div className="stats-container">

            <div className="status1">

                <div className="stat-box">
                    <span className="label">📁 Proiecte active</span>
                    <h3>{approvedReq.length}</h3>
                </div>

                <div className="stat-box">
                    <span className="label">🕵️‍♀️ HUMINT în lucru</span>
                    <h3>3</h3>
                </div>

                <div className="stat-box">
                    <span className="label">💻 Solicitare de proiect nou</span>
                    <Link to="/projectRequest-list" className="gradient-btn">Adaugă</Link>
                </div>

                <div className="stat-box">
                    <span className="label">🔎 Solicitare de HUMINT</span>
                    <button className="gradient-btn">Adaugă</button>
                </div>

                <div className="stat-box">
                    <span className="label">👥 Analiști implicați</span>
                    <h3>7/10</h3>
                </div>

                <div className="stat-box">
                    <span className="label">☑️ Finalizate</span>
                    <h3>350</h3>
                </div>

                <div className="stat-box">
                    <span className="label">💳 Costuri & performanța</span>
                    <button className="gradient-btn">KPI</button>
                </div>

            </div>

            <div className="status2">

                <div className="stat-box wide">
                    <span className="label">📤 Solicitări proiect — de revizuit</span>
                    <div className="sec">
                        <h3>4</h3>
                        <button className="gradient-btn">Deschide lista</button>
                    </div>
                </div>

                <div className="stat-box wide">
                    <span className="label">🕵️‍♂️ Solicitări HUMINT — de aprobat</span>
                    <div className="sec">
                        <h3>2</h3>
                        <button className="gradient-btn">Verifica acum</button>
                    </div>
                </div>

                {/* Total Users card */}
                <div className="stat-box wide">
                    <span className="label">👤 Toți utilizatorii</span>
                    <div className="sec">
                        <h3>{usersLoading ? "..." : totalUsers}</h3>
                        <Link to="/allUser" className="gradient-btn">
                            👥 Vezi utilizatorii
                        </Link>
                    </div>
                </div>

                <div className="stat-box wide blue-box">
                    <span className="label">💬 Mesaje necitite</span>
                    <div className="sec">
                        <h3>5</h3>
                        <button className="gradient-btn">Deschide messenger</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusSection;

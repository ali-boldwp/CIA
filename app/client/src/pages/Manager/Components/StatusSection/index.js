import "./StatusSection.css";
import { Link } from "react-router-dom";

const StatusSection = () => {
    return (
        <div className="stats-container">

            {/* Row 1 */}
            <div className="stat-box">
                <span className="label">📁 Proiecte active</span>
                <h3>6</h3>
            </div>

            <div className="stat-box">
                <span className="label">🕵️‍♀️ HUMINT în lucru</span>
                <h3>3</h3>
            </div>

            <div className="stat-box">
                <span className="label">💻 Solicitare de proiect nou</span>
                <button className="gradient-btn">Adaugă</button>
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

            {/* Row 2 */}
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

            <div className="stat-box wide blue-box">
                <span className="label">💬 Mesaje necitite</span>
                <div className="sec">
                    <h3>5</h3>
                    <button className="gradient-btn">Deschide messenger</button>
                </div>
            </div>

            {/* ✅ NEW CARD: All User Romania Language */}
            <div className="stat-box wide">
                <span className="label">👤 Toți utilizatorii</span>
                <div className="sec">
                    <h3>0</h3>
                    <Link to="/allUser" className="gradient-btn">
                        👥 Vezi utilizatorii
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default StatusSection;

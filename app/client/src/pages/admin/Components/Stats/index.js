import {Link} from "react-router-dom";

const Stats = ({ stats }) => {

    return (
        <div className="stats-container">

            <div className="status1">

                <div className="stat-box">
                    <span className="label">📁 Proiecte active</span>
                    <h3>{ stats?.projects }</h3>
                </div>

                <div className="stat-box">
                    <span className="label">🕵️‍♀️ HUMINT în lucru</span>
                    <h3>{ stats?.hument }</h3>
                </div>

                <div className="stat-box">
                    <span className="label">💻 Solicitare de proiect nou</span>
                    <Link to="/project/request/new" className="gradient-btn">Adaugă</Link>
                </div>

                <div className="stat-box">
                    <span className="label">🔎 Solicitare de HUMINT</span>

                    <Link to="/humint/new" className="gradient-btn">Adaugă</Link>

                </div>

                <div className="stat-box">
                    <div>
                        <span className="label">👥 Analiști implicați</span>
                        <h3> { stats?.analyst?.free }/{ stats?.analyst?.total }</h3>
                    </div>
                    <Link to="/allUser" className="gradient-btn">
                        👥 Vezi utilizatorii
                    </Link>
                </div>
            </div>
            <div className="status2">
                <div className="stat-box">
                    <span className="label">☑️ Finalizate</span>
                    <h3>{ stats?.completed }</h3>
                </div>

                <div className="stat-box">
                    <span className="label">💳 Costuri & performanța</span>
                    <button className="gradient-btn">KPI</button>
                </div>





                <div className="stat-box ">
                    <span className="label">📤 Solicitări proiect — de revizuit</span>
                    <div className="sec">
                        <h3>{stats?.requested?.projects}</h3>
                        <Link to="/project/request/all" className="gradient-btn">Deschide lista</Link>
                    </div>
                </div>

                <div className="stat-box ">
                    <span className="label">🕵️‍♂️ Solicitări HUMINT — de aprobat</span>
                    <div className="sec">
                        <h3>{stats?.requested?.huments}</h3>
                        <Link to="/humint" className="gradient-btn">Verifica acum</Link>
                    </div>
                </div>

                <div className="stat-box blue-box">
                    <span className="label">💬 Mesaje necitite</span>
                    <div className="sec">
                        <h3>{ stats?.messages }</h3>
                        <Link to="/messenger" className="gradient-btn">Deschide messenger</Link>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Stats;
import Notification from "../Notification";
import { useState } from 'react'
import {Link, useLocation} from "react-router-dom";

const Header = () => {

    const location=useLocation();
    const isSale=location.pathname.includes("sales") ;
    const isAnalyst=location.pathname.includes("analyst");
    let dashboardTitle = "Dashboard Manager";

    const [showNotif, setShowNotif] = useState(false);

    return (
        <>
            {showNotif && <Notification onClose={() => setShowNotif(false)} />}
            {isSale ? "" : isAnalyst? "":     <Link to="/project/new" className="new-project-btn">+ Creeeaza proiect nou</Link>}
            <div className="right-buttons">
                <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
                    <span className="icon">🔔</span>
                    <span className="text">Alarme</span>
                </button>

                <button className="icon-btn">
                    <span className="icon">📅</span>
                    <span className="text">Calendar</span>
                </button>

            </div>
        </>
    )

}

export default Header;
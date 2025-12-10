import Notification from "../Notification";
import { useState } from 'react'
import "./Header.css"
import {Link, useLocation} from "react-router-dom";
import { useGetUnseenCountQuery } from "../../../../services/notificationApi";

const Header = () => {

    const { data } = useGetUnseenCountQuery();
    const unseen = data?.unseen || 0;

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
                    {unseen > 0 && <span className="notif-badge">{unseen}</span>}
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
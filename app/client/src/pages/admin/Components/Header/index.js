import Notification from "../Notification";
import { useState } from 'react'
import "./Header.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useGetUnseenCountQuery } from "../../../../services/notificationApi";

const Header = ({
    createProject = false,
    notifications = true,
    calander = true
}) => {

    const navigate = useNavigate();

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
            { createProject && <button className="icon-btn new" onClick={ () => navigate( "/project/new" ) }> <span className="text">Creeeaza proiect</span></button> }
            { notifications && <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C7.71983 1.25 4.25004 4.71979 4.25004 9V9.7041C4.25004 10.401 4.04375 11.0824 3.65717 11.6622L2.50856 13.3851C1.17547 15.3848 2.19318 18.1028 4.51177 18.7351C5.26738 18.9412 6.02937 19.1155 6.79578 19.2581L6.79768 19.2632C7.56667 21.3151 9.62198 22.75 12 22.75C14.378 22.75 16.4333 21.3151 17.2023 19.2632L17.2042 19.2581C17.9706 19.1155 18.7327 18.9412 19.4883 18.7351C21.8069 18.1028 22.8246 15.3848 21.4915 13.3851L20.3429 11.6622C19.9563 11.0824 19.75 10.401 19.75 9.7041V9C19.75 4.71979 16.2802 1.25 12 1.25ZM15.3764 19.537C13.1335 19.805 10.8664 19.8049 8.62349 19.5369C9.33444 20.5585 10.571 21.25 12 21.25C13.4289 21.25 14.6655 20.5585 15.3764 19.537ZM5.75004 9C5.75004 5.54822 8.54826 2.75 12 2.75C15.4518 2.75 18.25 5.54822 18.25 9V9.7041C18.25 10.6972 18.544 11.668 19.0948 12.4943L20.2434 14.2172C21.0086 15.3649 20.4245 16.925 19.0936 17.288C14.4494 18.5546 9.5507 18.5546 4.90644 17.288C3.57561 16.925 2.99147 15.3649 3.75664 14.2172L4.90524 12.4943C5.45609 11.668 5.75004 10.6972 5.75004 9.7041V9Z" fill="#FFF"/>
</svg>
                </span>
                <span className="text">Alarme</span>
                {unseen > 0 && <span className="notif-badge">{unseen}</span>}
            </button> }

            { calander && <button className="icon-btn">
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="-5.4 0 98.4 98.4">
                      <g id="Group_4" data-name="Group 4" transform="translate(-822.7 -241.5)">
                        <path id="Path_52" data-name="Path 52" d="M899.4,254.3H833.6a8.92,8.92,0,0,0-8.9,8.9V329a8.92,8.92,0,0,0,8.9,8.9h65.8a8.92,8.92,0,0,0,8.9-8.9V263.2A8.92,8.92,0,0,0,899.4,254.3Z" fill="none" stroke="#FFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10"/>
                        <line id="Line_25" data-name="Line 25" x2="21.2" transform="translate(842.6 283.7)" fill="none" stroke="#FFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10"/>
                        <line id="Line_26" data-name="Line 26" x2="45.9" transform="translate(842.6 302)" fill="none" stroke="#FFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10"/>
                        <line id="Line_27" data-name="Line 27" y2="19.6" transform="translate(853.6 243.5)" fill="none" stroke="#FFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10"/>
                        <line id="Line_28" data-name="Line 28" y2="19.6" transform="translate(879.4 243.5)" fill="none" stroke="#FFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10"/>
                      </g>
                    </svg>
                </span>
                <span className="text">Calendar</span>
            </button> }
        </>
    )

}

export default Header;
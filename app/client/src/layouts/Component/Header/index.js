import "./Header.css";
import {Link, useLocation} from "react-router-dom";
import {Outlet} from "react-router-dom";
import { useSelector } from "react-redux";



const Header = ({ children }) => {

    const user = useSelector((state) => state.auth.user);

    const location = useLocation();
    const isSale = location.pathname.includes("sales");
    const isAnalyst = location.pathname.includes("analyst");
    let dashboardTitle = `Dashboard ${ user.role }`;

    return (
        <header className="header">
            <div className="firstSec">
                <h3 className="logo">{dashboardTitle}</h3>
                <div
                    className="search-box"
                    style={{
                        borderRadius: !isSale && !isAnalyst ? "2rem" : undefined
                    }}
                >

                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Caută proiect, persoană sau task..."/>
                </div>
            </div>
            <div className="secSec">
                {children}
                <button className="icon-btn">
                    <span className="icon">👤</span>
                    <span className="text">Utilizator</span>
                </button>

            </div>
        </header>
    );
};

export default Header;

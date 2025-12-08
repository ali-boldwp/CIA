import "./Header.css";
import { useState } from "react";
import {Link, useLocation,useNavigate} from "react-router-dom";
import {Outlet} from "react-router-dom";
import { useSelector } from "react-redux";



const Header = ({ children }) => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const location = useLocation();
    const isSale = location.pathname.includes("sales");
    const isAnalyst = location.pathname.includes("analyst");
    let dashboardTitle = `Dashboard ${ user.role }`;

    const [input, setInput] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            navigate(`/search/${input.trim()}`);
        }
    };

    return (
        <header className="header">
            <div className="firstSec">
                <Link to={ "/" } ><h3 className="logo">{dashboardTitle}</h3> </Link>
                <div
                    className="search-box"
                    style={{
                        borderRadius: !isSale && !isAnalyst ? "2rem" : undefined
                    }}
                >

                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Caută proiect, persoană sau task..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleSearch}
                    />

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

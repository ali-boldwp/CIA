import "./Header.css";
import {useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";


const Header = ({ children, search, logo, title, back = false }) => {

    const {keyword} = useParams();

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const location = useLocation();
    const isSale = location.pathname.includes("sales");
    const isAnalyst = location.pathname.includes("analyst");
    let dashboardTitle = `Dashboard ${user.role}`;

    const [input, setInput] = useState(keyword);

    const handleSearch = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            navigate(`/project/search/${input.trim()}`);
        }
    };

    return (
        <header className="header">
            <div className="firstSec">
                { back && <Link to={ '/' } className={ 'back-to-dashboard' }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 1024 1024"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg> Înapoi la Dashboard
                </Link> }
                { logo && <Link to={"/"}><h3 className="logo">{ title ? title : dashboardTitle}</h3></Link> }
                {
                    search ?
                        <>
                            <div
                                className="search-box"
                            >

                                <span className="search-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px"
                                                                   height="20px" viewBox="0 0 24 24"
                                                                   fill="none">
                                        <path
                                            d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                            stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Caută proiect, persoană sau task..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleSearch}
                                />

                            </div>
                        </> : <></>
                }

            </div>
            <div className="secSec">
                {children}
                <button className="icon-btn">
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 16 16"
                             fill="none">
                            <path
                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                fill="#FFF"/>
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                  fill="#FFF"/>
                        </svg>
                    </span>
                    <span className="text">Utilizator</span>
                </button>

            </div>
        </header>
    );
};

export default Header;

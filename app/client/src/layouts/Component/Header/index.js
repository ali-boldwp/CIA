import "./Header.css";
import {useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";


const Header = ({ children, search, logo, title, back = false }) => {

    const {keyword} = useParams();

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const location = useLocation();
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 1024 1024"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg> Înapoi la Dashboard
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
                <Link to="/profile" className="icon-btn">
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 16 16"
                             fill="none">
                            <path
                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                fill="#FFF"/>
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                  fill="#FFF"/>
                        </svg>
                    </span>
                    <span className="text">Utilizator</span>
                </Link>


            </div>

            {(user.role === "admin" || user.role === "manager") && (
                <Link
                    to="/categories"
                    className="icon-btn2"
                    aria-label="Settings"
                >
        <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M6 15.8L7.14286 17L10 14" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 8.8L7.14286 10L10 7" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 9L18 9" stroke="#FFF" stroke-width="1.5" stroke-linecap="round"/>
<path d="M13 16L18 16" stroke="#FFF" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#FFF" stroke-width="1.5" stroke-linecap="round"/>
</svg>
        </span>
                </Link>
            )}


        </header>
    );
};

export default Header;

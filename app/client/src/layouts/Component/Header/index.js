import "./Header.css";
import {Link,useLocation} from "react-router-dom";


const Header = () => {

    const location=useLocation();
    const isSale=location.pathname.includes("sales");

  return (
    <header className="header">
        <div className="firstSec">
            {!isSale ?
                <h3 className="logo">Dashboard Manager</h3>:
                <h3 className="logo">Dashboard Sales</h3>

            }


      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Caută proiect, persoană sau task..." />
      </div>
      </div>
       <div className="secSec">
      <Link to="/project" className="new-project-btn">+ Creeeaza proiect nou</Link>

      <div className="right-buttons">
        <button className="icon-btn">🔔 Alarme</button>
        <button className="icon-btn">📅 Calendar</button>
        <button className="icon-btn">👤 Utilizator</button>
      </div>
      </div> 
    </header>
  );
};

export default Header;

import "./Header.css";
import {Link,useLocation} from "react-router-dom";


const Header = () => {

    const location=useLocation();
    const isSale=location.pathname.includes("sales") ;
    const isAnalyst=location.pathname.includes("analyst");
    let dashboardTitle = "Dashboard Manager";

    if (isSale) {
        dashboardTitle = "Dashboard Sales";
    } else if (isAnalyst) {
        dashboardTitle = "Dashboard Analist";
    }
  return (
    <header className="header">
        <div className="firstSec">

                    <h3 className="logo">{dashboardTitle}</h3>




      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Caută proiect, persoană sau task..." />
      </div>
      </div>
       <div className="secSec">
           {isSale ? "" : isAnalyst? "":     <Link to="/project" className="new-project-btn">+ Creeeaza proiect nou</Link>}


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

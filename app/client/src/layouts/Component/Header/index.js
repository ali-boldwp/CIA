import "./Header.css";

const Header = () => {
  return (
    <header className="header">
        <div className="firstSec">
      <h3 className="logo">Dashboard Manager</h3>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Caută proiect, persoană sau task..." />
      </div>
      </div>
       <div className="secSec">
      <button className="new-project-btn">+ Creeeaza proiect nou</button>

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

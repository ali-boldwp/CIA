import "./Calendar.css";

const CalendarList = () => {
  const items = [
    { date: "2025-11-20", title: "Background check: Persoana A.B." },
    { date: "2025-11-25", title: "Background check: Persoana C.D." },
    { date: "2025-11-30", title: "Raport de informare: Societatea KLM" },
    { date: "2025-12-05", title: "Due Diligence: Societatea ABC" },
    { date: "2025-12-10", title: "Fraud investigation: KSTE RO" },
    { date: "2025-12-15", title: "Preliminary Due Diligence: Societatea QRS" },
  ];

  return (
    <div className="main">
        <h3>Calendar deadline-uri — listă</h3>
    <div className="calendar-wrapper">
      <div className="calendar-list">
        {items.map((item, i) => (
          <div className="calendar-row" key={i}>
            <span className="date-badge">{item.date}</span>
            <span className="task-title">{item.title}</span>
            <span className="status-dot"></span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CalendarList;

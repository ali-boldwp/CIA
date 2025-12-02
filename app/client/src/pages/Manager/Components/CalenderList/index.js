import "./Calendar.css";
import { useGetProjectRequestsQuery } from "../../../../services/projectApi";

const CalendarList = () => {

    const {data,isLoading}=useGetProjectRequestsQuery()
    const items=data?.data || [];


  return (
    <div className="main">
        <h3>Calendar deadline-uri — listă</h3>
    <div className="calendar-wrapper">
      <div className="calendar-list">
        {items.map((item, i) => (
          <div className="calendar-row" key={i}>
            <span className="date-badge"> {item.deadline
                ? new Date(item.deadline).toLocaleDateString("ro-RO")
                : "Fără deadline"}</span>
            <span className="task-title">{item.name}</span>
            <span className="status-dot"></span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CalendarList;

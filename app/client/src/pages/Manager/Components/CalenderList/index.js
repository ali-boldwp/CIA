import { useState, useMemo } from "react";
import { useGetProjectCreateQuery } from "../../../../services/projectApi";
import "./Calendar.css";



const CalendarList = () => {
    const { data, isLoading } = useGetProjectCreateQuery();
    const projects = data?.data || [];
    console.log(projects,"color")
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    /** Move to next / prev month */
    const nextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        if (currentMonth === 11) setCurrentYear((y) => y + 1);
    };

    const prevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        if (currentMonth === 0) setCurrentYear((y) => y - 1);
    };

    /** Calendar days */
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const roDays = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

    /** Convert deadlines into a map */
    const eventsMap = useMemo(() => {
        const map = {};

        projects.forEach((p) => {
            if (p.deadline) {
                const d = new Date(p.deadline);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

                map[key] = {
                    ...p,
                    color: p.responsibleAnalyst?.color || "#999"
                };
            }
        });

        return map;
    }, [projects]);


    /** Upcoming deadlines (sorted) */
    const upcoming = [...projects]
        .filter((p) => p.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const daysLeft = (date) => {
        const now = new Date();
        const d = new Date(date);
        return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="calendar-page">
            {/* LEFT SIDE: calendar */}
            <div className="calendar-card">
                <div className="calendar-header">
                    <button onClick={prevMonth}>◀</button>
                    <h3>
                        {new Date(currentYear, currentMonth).toLocaleDateString("ro-RO", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h3>
                    <button onClick={nextMonth}>▶</button>
                </div>

                <div className="calendar-grid">
                    {roDays.map((d) => (
                        <div className="day-label" key={d}>{d}</div>
                    ))}

                    {Array(firstDayIndex === 0 ? 6 : firstDayIndex - 1)
                        .fill("")
                        .map((_, i) => (
                            <div className="empty" key={i}></div>
                        ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const key = `${currentYear}-${currentMonth}-${day}`;
                        const event = eventsMap[key];

                        return (
                            <div className="day-box" key={i}>
                                <span>{day}</span>
                                {event && (
                                    <span
                                        className="dot"
                                        style={{ background: event.color }}
                                    ></span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT SIDE: deadlines list */}
            <div className="deadline-card">
                <h3>Următoarele deadline-uri</h3>

                <div className="deadline-list">
                    {upcoming.map((p, i) => {
                        const left = daysLeft(p.deadline);
                        const color = p.responsibleAnalyst?.color || "#999";


                        return (
                            <div className="deadline-row" key={i}>
                                <span
                                    className="dot"
                                    style={{
                                        background: color,
                                        marginRight: "10px"
                                    }}
                                ></span>

                                <div className="deadline-info">
                                    <div className="deadline-title">{p.projectName}</div>
                                    <div className="deadline-date">
                                        {new Date(p.deadline).toLocaleDateString("ro-RO")}
                                    </div>
                                </div>

                                <div className="deadline-badge">
                                    {left} zile rămase
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarList;

import { useState, useMemo } from "react";
import { useGetProjectsQuery} from "../../../../services/projectApi";


const colors = ["#2ecc71", "#f1c40f", "#e74c3c", "#3498db"];

const Calender = () => {
    const { data, isLoading } = useGetProjectsQuery();
    const projects = data?.data || [];

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());


    const nextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        if (currentMonth === 11) setCurrentYear((y) => y + 1);
    };

    const prevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        if (currentMonth === 0) setCurrentYear((y) => y - 1);
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const roDays = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];


    const monthlyProjects = useMemo(() => {
        return projects.filter(p => {
            if (!p.deadline) return false;
            const d = new Date(p.deadline);
            return (
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear
            );
        });
    }, [projects, currentMonth, currentYear]);

    const eventsMap = useMemo(() => {
        const map = {};
        monthlyProjects.forEach((p, index) => {
            if (p.deadline) {
                const d = new Date(p.deadline);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                map[key] = { ...p, color: colors[index % colors.length] };
            }
        });
        return map;
    }, [monthlyProjects]);


    const upcoming = [...projects]
        .filter((p) => p.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const daysLeft = (date) => {
        const now = new Date();
        const d = new Date(date);
        return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    };

    const formatPrettyDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" }); // Dec
        const year = d.getFullYear();

        return `${day} ${month} ${year}`;
    };




    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="calendar-page">
            {/* LEFT SIDE: calendar */}
            <div className="calendar-card">
                <h2 className="calH3">Calendar & deadline-uri</h2>
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
                                        className="dotEvent"
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
                    {monthlyProjects
                        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                        .map((p, i) => {
                            const left = daysLeft(p.deadline);
                            const color = colors[i % colors.length];

                            return (
                                <div className="deadline-row" key={i}>

                                    <div className="deadline-info">
                                       <span
                                           className="dotEvent2"
                                           style={{
                                               background: color,
                                           }}
                                       ></span>
                                        <div className="deadline-title">{p.projectName}</div>
                                        <div className="deadline-dateCal">
                                            {formatPrettyDate(p.deadline)}
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

export default Calender;

import "./Calendar.css";
import { useState, useMemo } from "react";
import { useGetProjectCreateQuery } from "../../../../services/projectApi";

const CalendarList = () => {
    const { data, isLoading } = useGetProjectCreateQuery();
    const items = data?.data || [];

    /** 📄 PAGINATION */
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.ceil(items.length / limit);

    const paginated = useMemo(() => {
        return items.slice((page - 1) * limit, page * limit);
    }, [page, limit, items]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="main">
            <h3>Calendar deadline-uri — listă</h3>

            <div className="calendar-wrapper">
                <div className="calendar-list">
                    {paginated.map((item, i) => (
                        <div className="calendar-row" key={i}>
                            <span className="date-badge">
                                {item.deadline
                                    ? new Date(item.deadline).toLocaleDateString("ro-RO")
                                    : "Fără deadline"}
                            </span>

                            <span className="task-title">{item.projectName}</span>

                            <span className="status-dot"></span>
                        </div>
                    ))}

                    {paginated.length === 0 && (
                        <p className="empty-state">Nu există proiecte.</p>
                    )}
                </div>
                {/* PAGINATION */}
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        ← Precedent
                    </button>

                    <span>
                    Pagina <strong>{page}</strong> din{" "}
                        <strong>{totalPages}</strong>
                </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Următor →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarList;

import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TableSection from "./TableSection";
import { useGetAllHumintsQuery } from "../../services/humintApi";
import { useGetAnalystsQuery } from "../../services/userApi";

const HumintList = () => {
    const { data : AnalystData}=useGetAnalystsQuery();
    const { data: humintsData } = useGetAllHumintsQuery();
    const humints = humintsData?.data || [];

    const analysts=AnalystData?.data || [];

    const [projectsMap, setProjectsMap] = useState({});

    /** 🔥 FETCH ALL PROJECTS LIKE YOUR "fetchAll()" EXAMPLE */
    useEffect(() => {
        const fetchAllProjects = async () => {
            const token = localStorage.getItem("token");
            let result = {};

            for (const h of humints) {
                if (!h.projectId) continue;

                try {
                    const id = typeof h.projectId === "object" ? h.projectId._id : h.projectId;
                    const res = await fetch(
                        `${process.env.REACT_APP_API_BASE_URL}/project/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const json = await res.json();
                    result[h.projectId] = json.data || null;
                } catch (err) {
                    console.error("Project fetch error:", err);
                }
            }

            setProjectsMap(result);
        };

        if (humints.length > 0) {
            fetchAllProjects();
        }
    }, [humints]);

    /** 🔥 MERGE HUMINT + PROJECT DATA */
    const merged = humints.map((h) => {
        const p = projectsMap[h.projectId] || {};

        return {
            id: h._id,

            // 🔥 ONLY FROM PROJECT TABLE
            projectName: p.projectName || "Independent",
            reportType:p.reportType,
            projectSubject: p.projectSubject || "",

            // 🔥 Everything else from HUMINT table
            responsible: h.responsible,
            priority: h.priority,
            deadline: h.deadline?.split("T")[0],
            createdBy: h.createdBy,
            createdAt: h.createdAt,
            status: h.status
        };
    });

    const resolveAnalystName = (value) => {
        if (!value) return "—";

        // If backend returned full object
        if (typeof value === "object" && value.name) {
            return value.name;
        }

        // If it's an ID, find in analysts list
        const found = analysts.find(a => a._id === value);
        return found ? found.name : "—";
    };
    // UI State
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [priorityFilter, setPriorityFilter] = useState("Toate");
    const [selectedIds, setSelectedIds] = useState([]);

    /** Filters */
    const visibleRequests = useMemo(() => {
        let data = [...merged];

        // 🔍 SEARCH FILTER
        if (searchValue.trim()) {
            const q = searchValue.toLowerCase();

            data = data.filter((item) =>
                (item.projectName || "").toLowerCase().includes(q) ||
                (item.projectSubject || "").toLowerCase().includes(q) ||
                (item.reportType || "").toLowerCase().includes(q) ||
                (resolveAnalystName(item.responsible) || "").toLowerCase().includes(q)
            );
        }

        // ⚠️ PRIORITY FILTER
        if (priorityFilter !== "Toate") {
            data = data.filter((item) => item.priority === priorityFilter);
        }

        // 🔽 SORTING
        if (sortBy === "date") {
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if (sortBy === "deadline") {
            data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        }

        return data;
    }, [merged, searchValue, priorityFilter, sortBy]);


    return (
        <>
            <Header />

            <SearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                sortValue={sortBy}
                onSortChange={setSortBy}
                priorityValue={priorityFilter}
                onPriorityChange={setPriorityFilter}
                hasSelection={selectedIds.length > 0}
                onApproveSelected={() => alert("Approve pending")}
            />

            <TableSection
                analystN={resolveAnalystName}
                requests={visibleRequests}
                selectedIds={selectedIds}
                onToggleSelect={(id) =>
                    setSelectedIds((prev) =>
                        prev.includes(id)
                            ? prev.filter((i) => i !== id)
                            : [...prev, id]
                    )
                }
                onToggleSelectAll={(ids, checked) =>
                    setSelectedIds(checked ? ids : [])
                }
                totalCount={visibleRequests.length}
            />

        </>
    );
};

export default HumintList;

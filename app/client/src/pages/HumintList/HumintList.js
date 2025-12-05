import React, { useMemo, useState ,useEffect } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TableSection from "./TableSection";

import { useGetAllHumintsQuery, useApproveHumintMutation } from "../../services/humintApi";
import { useGetAnalystsQuery } from "../../services/userApi";
import { toast } from "react-toastify";

const HumintList = () => {
    const { data: AnalystData } = useGetAnalystsQuery();
    const { data: humintsData, isLoading } = useGetAllHumintsQuery();

    const [approveHumint] = useApproveHumintMutation();

    const humints = humintsData?.data || [];
    const analysts = AnalystData?.data || [];

    // Resolve analyst name
    const resolveAnalystName = (value) => {
        if (!value) return "—";
        if (typeof value === "object" && value.name) return value.name;

        const found = analysts.find(a => a._id === value);
        return found ? found.name : "—";
    };

    // Merge data
    const [merged, setMerged] = useState([]);

    useEffect(() => {
        if (humints.length > 0) {
            setMerged(
                humints.map((h) => {
                    const p = h.projectId || {};

                    return {
                        id: h._id,
                        projectName: p.projectName || h.humintSubject || "Independent",
                        reportType: p.reportType || h.reportType || "HUMINT",
                        projectSubject: p.projectName ? p.projectName : h.humintSubject || "—",
                        responsible: h.responsible,
                        priority: h.priority,
                        deadline: h.deadline?.split("T")[0],
                        createdBy: h.createdBy?.name || "—",
                        status: h.status
                    };
                })
            );
        }
    }, [humints]);


    // UI State
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [priorityFilter, setPriorityFilter] = useState("Toate");
    const [selectedIds, setSelectedIds] = useState([]);

    // 🔥 BULK APPROVE FUNCTION
    const handleApproveSelected = async () => {
        if (selectedIds.length === 0) {
            toast.error("Nicio solicitare selectată!");
            return;
        }

        try {
            for (const id of selectedIds) {
                await approveHumint(id).unwrap();
            }

            // 🔥 Update UI instantly
            setMerged(prev =>
                prev.map(item =>
                    selectedIds.includes(item.id)
                        ? { ...item, status: "Approved" }
                        : item
                )
            );

            toast.success("Solicitările selectate au fost aprobate!");
            setSelectedIds([]);

        } catch (err) {
            console.error(err);
            toast.error("Eroare la aprobarea solicitărilor!");
        }
    };


    // FILTERING
    const visibleRequests = useMemo(() => {
        let data = [...merged];

        if (searchValue.trim()) {
            const q = searchValue.toLowerCase();
            data = data.filter(x =>
                x.projectName.toLowerCase().includes(q) ||
                x.reportType.toLowerCase().includes(q)
            );
        }

        if (priorityFilter !== "Toate") {
            data = data.filter(x => x.priority === priorityFilter);
        }

        return data;
    }, [merged, searchValue, priorityFilter]);

    if (isLoading) return <h2>Loading HUMINT…</h2>;

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
                onApproveSelected={handleApproveSelected}
            />

            <TableSection
                analystN={resolveAnalystName}
                requests={visibleRequests}
                selectedIds={selectedIds}
                onToggleSelect={(id) =>
                    setSelectedIds(prev =>
                        prev.includes(id)
                            ? prev.filter(i => i !== id)
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

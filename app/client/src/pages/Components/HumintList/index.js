import React, { useMemo, useState ,useEffect } from "react";
import SearchBar from "./SearchBar";
import TableSection from "./TableSection";

import { useApproveHumintMutation } from "../../../services/humintApi";
import { toast } from "react-toastify";

const Index = ({ data }) => {

    const [approveHumint] = useApproveHumintMutation();

    const humints = data?.data || [];

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

            toast("Solicitările selectate au fost aprobate!");
            setSelectedIds([]);

        } catch (err) {
            console.error(err);
            toast.error("Eroare la aprobarea solicitărilor!");
        }
    };

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
                ( item?.responsible?.name  || "").toLowerCase().includes(q)
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

export default Index;

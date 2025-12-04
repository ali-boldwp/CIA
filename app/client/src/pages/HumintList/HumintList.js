import React, { useMemo, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TableSection from "./TableSection";

const initialRequests = [
    {
        id: 1,
        project: "Due Diligence: Societatea ABC",
        description: "Observarea directorul ...",
        type: "Enhanced DD",
        responsible: "Analist C",
        priority: "Urgent",
        deadline: "2025-12-10",
        createdBy: "Analist A",
        createdAt: "2025-12-02 11:05",
        status: "De aprobat"
    },
    {
        id: 2,
        project: "Fraud investigation: KSTE RO",
        description: "Verificare documente ...",
        type: "Fraud Investigation",
        responsible: "Analist A",
        priority: "Urgent",
        deadline: "2025-12-12",
        createdBy: "Analist B",
        createdAt: "2025-12-02 10:42",
        status: "De aprobat"
    },
    {
        id: 3,
        project: "Background check: Persoana A.B.",
        description: "Confirmare referințe ...",
        type: "Background Check",
        responsible: "Analist B",
        priority: "Normal",
        deadline: "2025-12-08",
        createdBy: "Analist B",
        createdAt: "2025-12-02 10:15",
        status: "De aprobat"
    },
    {
        id: 4,
        project: "Independent",
        description: "Observare perimetrue industrial ...",
        type: "HUMINT Independent",
        responsible: "Manager",
        priority: "Confidențial",
        deadline: "2025-12-08",
        createdBy: "Manager",
        createdAt: "2025-12-02 09:30",
        status: "Clarificări"
    }
];

const HumintList = () => {
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("date"); // "date" | "deadline"
    const [priorityFilter, setPriorityFilter] = useState("Toate"); // Toate | Urgent | Normal | Confidențial
    const [selectedIds, setSelectedIds] = useState([]);

    // filter + sort logic
    const visibleRequests = useMemo(() => {
        let data = [...initialRequests];

        // search filter
        if (searchValue.trim() !== "") {
            const q = searchValue.toLowerCase();
            data = data.filter((item) => {
                return (
                    item.project.toLowerCase().includes(q) ||
                    item.type.toLowerCase().includes(q) ||
                    item.responsible.toLowerCase().includes(q)
                );
            });
        }

        // priority filter
        if (priorityFilter !== "Toate") {
            data = data.filter((item) => item.priority === priorityFilter);
        }

        // sort
        if (sortBy === "date") {
            data.sort(
                (a, b) =>
                    new Date(b.createdAt.replace(" ", "T")) -
                    new Date(a.createdAt.replace(" ", "T"))
            );
        } else if (sortBy === "deadline") {
            data.sort(
                (a, b) =>
                    new Date(a.deadline) - new Date(b.deadline)
            );
        }

        return data;
    }, [searchValue, sortBy, priorityFilter]);

    // selection helpers
    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = (visibleIds, checked) => {
        if (checked) {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
        } else {
            setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
        }
    };

    const handleApproveSelected = () => {
        if (selectedIds.length === 0) return;
        // yahan tum API call / action laga sakte ho
        console.log("Approved IDs:", selectedIds);
        alert(`Ai aprobat ${selectedIds.length} solicitări (demo).`);
    };

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
                onApproveSelected={handleApproveSelected}
                hasSelection={selectedIds.length > 0}
            />
            <TableSection
                requests={visibleRequests}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                totalCount={initialRequests.length}
            />
        </>
    );
};

export default HumintList;

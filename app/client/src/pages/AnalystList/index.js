import React, { useState, useMemo } from "react";
import styles from "./AnalystList.module.css";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import AddAnalystForm from "./AddAnalystForm";
import { toast } from "react-toastify";
import {useDeleteUserMutation, useGetAnalystsQuery} from "../../services/userApi";

export default function AnalystList() {
    const [search, setSearch] = useState("");
    const [roleAnalystFilter, setAnalystRoleFilter] = useState("all");
    const [sortBy, setSortBy] = useState("desc");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const open = () => setShowModal(true);

    const close = () => {
        setShowModal(false);
        setEditData(null);
    };

    // FETCH ANALYSTS
    const {data, isLoading, isError  } = useGetAnalystsQuery();
    const [deleteAnalyst] = useDeleteUserMutation();

    const users = Array.isArray(data)
        ? data
        : Array.isArray(data?.analysts)
            ? data.analysts
            : Array.isArray(data?.data)
                ? data.data
                : [];

// ONLY show users with role = analyst OR user
    const analysts = users.filter(
        (u) => u.role === "analyst" || u.role === "user"
    );


    // DELETE ANALYST
    const handleDelete = async (_id) => {
        try {
            await deleteAnalyst(_id).unwrap();
            toast("Analist șters cu succes!");
        } catch (err) {
            toast.error("Eroare la ștergere!");
        }
    };

    // EXPORT CSV
    const exportCSV = () => {
        if (filteredData.length === 0) {
            toast.error("Nu există date pentru export!");
            return;
        }

        const headers = [
            "Nume,Funcție,Data angajării,Vechime,Salariu,Bonus,Cost Zi,Cost Oră"
        ];

        const rows = filteredData.map((a) =>
            [
                a.name,
                a.analystRole,
                a.hiringDate,
                a.seniority || "-",
                a.monthlySalary + " RON",
                a.bonus,
                a.costPerDay,
                a.costPerHour
            ].join(",")
        );

        const csvContent = [...headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "analysts_export.csv";
        link.click();
    };

    // FILTER + SORT DATA
    const filteredData = useMemo(() => {
        let data = [...analysts];

        // SEARCH FILTER
        if (search.trim() !== "") {
            data = data.filter((a) =>
                a.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // ROLE FILTER
        if (roleAnalystFilter !== "all") {
            data = data.filter((a) => a.role === roleAnalystFilter);
        }

        // SORT BY SENIORITY
        data.sort((a, b) => {
            const valA = parseFloat(a.seniority || 0);
            const valB = parseFloat(b.seniority || 0);
            return sortBy === "asc" ? valA - valB : valB - valA;
        });

        return data;
    }, [analysts, search, roleAnalystFilter, sortBy]);

    // TOTAL COST
    const totalCost = useMemo(() => {
        return filteredData.reduce((sum, a) => {
            const num = parseFloat(a.costPerDay);
            return isNaN(num) ? sum : sum + num;
        }, 0);
    }, [filteredData]);

    const formattedTotalCost = `${totalCost.toLocaleString("ro-RO")} RON`;

    if (isLoading) return <h2 className={styles.loading}>Se încarcă...</h2>;
    if (isError) return <h2 className={styles.error}>Eroare la încărcare date!</h2>;

    return (
        <div className={styles.page}>

            {/* HEADER */}
            <div className={styles.headerBar}>
                <button className={styles.backBtn}>← Înapoi la Dashboard</button>
                <h2 className={styles.title}>Analiști</h2>
            </div>

            {/* FILTER ROW */}
            <div className={styles.filtersRow}>

                {/* SEARCH */}
                <div className={styles.serMain}>
                    <span className={styles.serIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută analist după nume..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* ROLE FILTER */}
                <select
                    className={styles.filterSelect}
                    value={roleAnalystFilter}
                    onChange={(e) => setAnalystRoleFilter(e.target.value)}
                >
                    <option value="all">Toate funcțiile</option>
                    <option value="Head of Investigations">Head of Investigations</option>
                    <option value="Analyst">Analyst</option>
                    <option value="HUMINT Detective">HUMINT Detective</option>
                </select>

                {/* SORT */}
                <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="desc">Vechime desc</option>
                    <option value="asc">Vechime asc</option>
                </select>

                {/* EXPORT */}
                <button className={styles.exportBtn} onClick={exportCSV}>
                    Export CSV
                </button>
            </div>

            {/* TABLE */}
            <div className={styles.table}>
                <h4 className={styles.title}>Analiști</h4>

                <div className={styles.tableHeader}>
                    <span>Nume</span>
                    <span>Funcție</span>
                    <span>Data angajării</span>
                    <span>Vechime</span>
                    <span>Salariu</span>
                    <span>Bonus</span>
                    <span>Cost/zi</span>
                    <span>Cost/oră</span>
                    <span>Ațiuni</span>
                </div>

                {filteredData.map((a, i) => (
                    <div className={styles.row} key={i}>

                        <div className={styles.userCell}>
                            <span
                                className={styles.avatar}
                                style={{ background: a.color || "#6C5CE7" }}
                            >
                                {a.name.charAt(0)}
                            </span>
                            <span>{a.name}</span>
                        </div>

                        <span>{a.role}</span>
                        <span>{a.hiringDate}</span>
                        <span>{a.seniority || "-"}</span>
                        <span>{a.monthlySalary} RON</span>
                        <span>{a.bonus || 0}</span>
                        <span>{a.costPerDay} RON</span>
                        <span>{a.costPerHour} RON</span>

                        <div className={styles.actions}>
                            <FiEdit3
                                className={styles.icon}
                                onClick={() => {
                                    setEditData(a);
                                    setShowModal(true);
                                }}
                            />

                            <FiTrash2
                                className={styles.iconDelete}
                                onClick={() => handleDelete(a._id)}
                            />
                        </div>
                    </div>
                ))}

                {/* FOOTER */}
                <div className={styles.footer}>
                    <div className={styles.footerTop}>
                        <span>Total analiști: {filteredData.length}</span>
                        <span>Cost total: {formattedTotalCost}</span>
                    </div>

                    <button className={styles.addBtn} onClick={open}>
                        + Adaugă analist
                    </button>
                </div>

                {showModal && (
                    <div className={styles.overlay} onClick={close}>
                        <div
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AddAnalystForm closeModal={close} editData={editData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

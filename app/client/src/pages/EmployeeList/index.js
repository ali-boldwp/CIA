import React, { useMemo, useState } from "react";
import styles from "./EmployeeList.module.css";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import AddEmployeeForm from "./addEmployeeForm";
import { useGetAllEmployeesQuery } from "../../services/EmployeesApi";
import { useDeleteEmployeeMutation } from "../../services/EmployeesApi";

export default function EmployeeList() {

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("Toate funcțiile");
    const [sort, setSort] = useState("A-Z");
    const [showModal, setShowModal] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [mode, setMode] = useState("add");


    // 🔥 REAL-TIME EMPLOYEES DATA FROM BACKEND
    const { data, isLoading, error } = useGetAllEmployeesQuery();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    // Employees list from backend
    const employees = data?.data || [];

    // 🛠 Transform backend format → match UI format
    const uiEmployees = useMemo(() => {
        return employees.map((emp) => ({
            name: emp.name,
            role: emp.jobRole,
            date: new Date(emp.hiringDate).toLocaleDateString("ro-RO"),
            seniority: "—",
            salary: emp.salaryGross + " RON",
            bonus: emp.bonusMonthly + " RON",
            projectBonus: emp.bonusProject + " RON",
            taxedBonus: emp.bonusMonthly + emp.bonusProject + " RON",
            totalCost: emp.salaryGross + emp.bonusMonthly + emp.bonusProject + " RON",
            costDay: Math.round(emp.salaryGross / 20) + " RON",
            costHour: Math.round(emp.salaryGross / 160) + " RON",
            color: "#2D9CDB",

            // ⭐ VERY IMPORTANT — store original employee data for editing
            originalData: emp,
        }));
    }, [employees]);

    const openModal = () => {
        setMode("add");
        setEditEmployee(null);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setMode("add");
        setEditEmployee(null);
    };

    // 🔍 Filters + Sorting
    const filteredData = useMemo(() => {
        let data = [...uiEmployees];

        if (search.trim() !== "") {
            data = data.filter((emp) =>
                emp.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== "Toate funcțiile") {
            data = data.filter((emp) => emp.role === roleFilter);
        }

        if (sort === "A-Z") {
            data.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            data.sort((a, b) => b.name.localeCompare(a.name));
        }

        return data;
    }, [uiEmployees, search, roleFilter, sort]);





    const handleDelete = async (emp) => {
        if (!window.confirm(`Ștergi angajatul ${emp.name}?`)) return;

        try {
            await deleteEmployee(emp.originalData._id).unwrap();
            alert("Angajat șters!");
        } catch (err) {
            console.error(err);
        }
    };


    // CSV Export
    const exportCSV = () => {
        const csvRows = [];
        const headers = Object.keys(filteredData[0] || {});
        csvRows.push(headers.join(","));

        filteredData.forEach((emp) => {
            csvRows.push(headers.map((h) => emp[h]).join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "employees.csv";
        link.click();
    };

    if (isLoading) return <p className={styles.loading}>Se încarcă...</p>;
    if (error) return <p className={styles.error}>Eroare la încărcare!</p>;

    return (
        <div className={styles.page}>
            <div className={styles.headerBar}>
                <button className={styles.backBtn}>← Înapoi la Dashboard</button>
                <h2 className={styles.title}>Lista angajați</h2>
            </div>

            {/* FILTERS */}
            <div className={styles.filtersRow}>

                <div className={styles.serMain}>
                    <span className={styles.serIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută angajat după nume..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className={styles.filterSelect}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option>Toate funcțiile</option>
                    <option>CEO</option>
                    <option>CFO</option>
                    <option>Analist</option>
                    <option>Tehnician</option>
                    <option>Șofer</option>
                </select>

                <select
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="A-Z">Nume A-Z</option>
                    <option value="Z-A">Nume Z-A</option>
                </select>

                <button className={styles.exportBtn} onClick={exportCSV}>
                    Export CSV
                </button>
            </div>

            {/* TABLE */}
            <div className={styles.table}>
                <h4 className={styles.title}>Angajați</h4>

                <div className={styles.tableHeader}>
                    <span>Nume</span>
                    <span>Funcție</span>
                    <span>Data angajării</span>
                    <span>Vechime</span>
                    <span>Salariu</span>
                    <span>Bonus lunar</span>
                    <span>Bonus proiect</span>
                    <span>Bonus incl. taxe</span>
                    <span>Cost total</span>
                    <span>Cost/zi</span>
                    <span>Cost/oră</span>
                    <span>Ațiuni</span>
                </div>

                {filteredData.map((emp, i) => (
                    <div className={styles.row} key={i}>
                        <div className={styles.userCell}>
                            <span className={styles.avatar} style={{ background: emp.color }}>
                                {emp.name.charAt(0)}
                            </span>
                            <span>{emp.name}</span>
                        </div>

                        <span>{emp.role}</span>
                        <span>{emp.date}</span>
                        <span>{emp.seniority}</span>
                        <span>{emp.salary}</span>
                        <span>{emp.bonus}</span>
                        <span>{emp.projectBonus}</span>
                        <span>{emp.taxedBonus}</span>
                        <span>{emp.totalCost}</span>
                        <span>{emp.costDay}</span>
                        <span>{emp.costHour}</span>

                        <div className={styles.actions}>
                            <FiEdit3
                                className={styles.icon}
                                onClick={() => {
                                    setMode("edit");
                                    setEditEmployee(emp.originalData); // pass REAL backend employee data
                                    setShowModal(true);
                                }}
                            />

                            <FiTrash2
                                className={styles.iconDelete}
                                onClick={() => handleDelete(emp)}
                            />

                        </div>
                    </div>
                ))}

                {/* FOOTER */}
                <div className={styles.footer}>
                    <span>Total angajați: {filteredData.length}</span>
                    <button className={styles.addBtn} onClick={openModal}>
                        + Adaugă angajat
                    </button>
                </div>

                {/* MODAL */}
                {showModal && (
                    <div className={styles.overlay} onClick={closeModal}>
                        <div
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AddEmployeeForm
                                mode={mode}
                                employee={editEmployee}
                                closeModal={closeModal}
                            />

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

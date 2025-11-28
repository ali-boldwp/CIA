import React, { useState, useMemo } from "react";
import styles from "./EmployeeList.module.css";
import { FiTrash2, FiEdit3, FiEye } from "react-icons/fi";
import AddEmployeeForm from "./addEmployeeForm";


const initialEmployees = [
    {
        name: "Angajat A",
        role: "CEO",
        date: "2019-01-10",
        seniority: "6.9 / 10",
        salary: "12.000 RON",
        bonus: "1.000 RON",
        projectBonus: "2.000 RON",
        taxedBonus: "3.960 RON",
        totalCost: "15.960 RON",
        costDay: "600 RON",
        costHour: "75.0 RON",
        color: "#2D9CDB",
    },
    {
        name: "Angajat B",
        role: "CFO",
        date: "2020-05-12",
        seniority: "5.6 / 10",
        salary: "10.500 RON",
        bonus: "800 RON",
        projectBonus: "—",
        taxedBonus: "1.056 RON",
        totalCost: "11.556 RON",
        costDay: "525 RON",
        costHour: "65.6 RON",
        color: "#27AE60",
    },
    // Add all other rows exactly like screenshot...
];

export default function EmployeeList() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("Toate funcțiile");
    const [sort, setSort] = useState("A-Z");
    const [showModal, setShowModal] = useState(false);  // 🔥 MODAL CONTROL STATE

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const filteredData = useMemo(() => {
        let data = [...employees];

        // 🔍 Filter by search
        if (search.trim() !== "") {
            data = data.filter((emp) =>
                emp.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 📌 Filter by role
        if (roleFilter !== "Toate funcțiile") {
            data = data.filter((emp) => emp.role === roleFilter);
        }

        // 🔽 Sorting
        if (sort === "A-Z") {
            data.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            data.sort((a, b) => b.name.localeCompare(a.name));
        }

        return data;
    }, [employees, search, roleFilter, sort]);

    // 📤 EXPORT CSV
    const exportCSV = () => {
        const csvRows = [];
        const headers = Object.keys(initialEmployees[0]);
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

    return (
        <div className={styles.page}>
            <div className={styles.headerBar}>
                <button className={styles.backBtn}>← Înapoi la Dashboard</button>
                <h2 className={styles.title}>Lista angajați</h2>
            </div>

            {/* TOP FILTER BAR */}
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
                    <option>Sales</option>
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
                <h4 className={styles.title} style={{ marginBottom:"50px" }}>Angajați</h4>
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

                            <FiEdit3 className={styles.icon} />
                            <FiTrash2 className={styles.iconDelete} />
                        </div>
                    </div>
                ))}

                {/* FOOTER SUMMARY */}
                <div className={styles.footer}>
                    <span>Total angajați: {filteredData.length}</span>
                    <button className={styles.addBtn} onClick={openModal}>
                        + Adaugă angajat
                    </button>

                </div>
                {showModal && (
                    <div className={styles.overlay} onClick={closeModal}>
                        <div
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        >
                            <AddEmployeeForm closeModal={closeModal} />
                        </div>
                    </div>
                )}

            </div>


        </div>
    );
}

import React, { useState, useMemo } from "react";
import styles from "./AnalystList.module.css";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import AddAnalystForm from "./AddAnalystForm";

const initialAnalysts = [
    {
        name: "Analist A",
        role: "Head of Investigations",
        date: "2021-03-10",
        seniority: "3.7 / 10",
        salary: "8.000 RON",
        bonus: "50 RON",
        costDay: "400 RON",
        costHour: "50.0 RON",
        color: "#6C5CE7",
    },
];

export default function AnalystList() {
    const [analysts, setAnalysts] = useState(initialAnalysts);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const open = () => setShowModal(true);
    const close = () => setShowModal(false);

    const filteredData = useMemo(() => {
        let data = [...analysts];

        if (search.trim() !== "") {
            data = data.filter((a) =>
                a.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return data;
    }, [analysts, search]);

    // ---------- TOTAL COST ----------
    const totalCost = useMemo(() => {
        return filteredData.reduce((sum, a) => {
            const num = parseFloat(a.costDay);
            return isNaN(num) ? sum : sum + num;
        }, 0);
    }, [filteredData]);

    const formattedTotalCost = `${totalCost.toLocaleString("ro-RO")} RON`;

    return (
        <div className={styles.page}>

            {/* HEADER */}
            <div className={styles.headerBar}>
                <button className={styles.backBtn}>← Înapoi la Dashboard</button>
                <h2 className={styles.title}>Analiști</h2>
            </div>

            {/* FILTER ROW */}
            <div className={styles.filtersRow}>

                <div className={styles.serMain}>
                    <span className={styles.serIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută analist după nume..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select className={styles.filterSelect}>
                    <option>Toate funcțiile</option>
                    <option>Head of Investigations</option>
                    <option>Analist de informații</option>
                    <option>Detectiv HUMINT</option>
                </select>

                <select className={styles.sortSelect}>
                    <option>Vechime desc</option>
                    <option>Vechime asc</option>
                </select>

                <button className={styles.exportBtn}>Export CSV</button>
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
                                style={{ background: a.color }}
                            >
                                {a.name.charAt(0)}
                            </span>
                            <span>{a.name}</span>
                        </div>

                        <span>{a.role}</span>
                        <span>{a.date}</span>
                        <span>{a.seniority}</span>
                        <span>{a.salary}</span>
                        <span>{a.bonus}</span>
                        <span>{a.costDay}</span>
                        <span>{a.costHour}</span>

                        <div className={styles.actions}>
                            <FiEdit3 className={styles.icon} />
                            <FiTrash2 className={styles.iconDelete} />
                        </div>
                    </div>
                ))}

                {/* FOOTER */}
                <div className={styles.footer}>
                    <div className={styles.footerTop}>
                        <span className={styles.footerLeft}>
                            Total analiști: {filteredData.length}
                        </span>

                        <span className={styles.footerCenter}>
                            Cost total: {formattedTotalCost}
                        </span>
                    </div>

                    <button className={styles.addBtn} onClick={open}>
                        + Adaugă analist
                    </button>
                </div>

                {showModal && (
                    <div className={styles.overlay} onClick={close}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <AddAnalystForm closeModal={close} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

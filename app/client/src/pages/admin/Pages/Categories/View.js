import React, { useMemo, useState } from "react";
import styles from "./Style.module.css";

function Index({ data }) {
    // Dummy data (baad mein API se replace kar sakte ho)
    const [categories] = useState( data );

    const totalCategories = categories.length;

    /* Pagination */
    const [page, setPage] = useState(1);
    const limit = 10;

    const totalPages = Math.max(1, Math.ceil(categories.length / limit));

    const paginated = useMemo(() => {
        return categories.slice((page - 1) * limit, page * limit);
    }, [page, limit, categories]);

    return (
        <div className={styles.main}>
            {/* ================= Card 1: Header ================= */}
            <div className={styles.topCard}>
                <h3 className={styles.cardTitle}>
                    Nume categorii{" "}
                    <span className={styles.countText}>
            {totalCategories}{" "}
                        {totalCategories === 1 ? "categorie" : "categorii"}
          </span>
                </h3>

                <button className={`${styles.pillBtn} ${styles.addBtn}`}>
                    <span className={styles.addIcon}>＋</span>
                    <span>Adaugă categorie</span>
                </button>
            </div>

            {/* ================= Card 2: Table ================= */}
            <div className={styles.tableCard}>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Nume categorie</span>
                        <span>Număr capitole</span>
                        <span>Număr task-uri</span>
                        <span>Stare</span>
                        <span style={{ textAlign: "right" }}>Acțiuni</span>
                    </div>

                    <div className={styles.tableBody}>
                        {paginated.map((c) => (
                            <div className={styles.tableRow} key={c.id}>
                                <div className={styles.col}>{c.name}</div>
                                <div className={styles.col}>{c.chapters}</div>
                                <div className={styles.col}>{c.tasks}</div>

                                <div className={styles.col}>
                  <span
                      className={`${styles.stateBadge} ${
                          c.status === "activ"
                              ? styles.active
                              : styles.inactive
                      }`}
                  >
                    {c.status}
                  </span>
                                </div>

                                <div className={styles.actions}>
                                    <button className={styles.openBtn}>Deschide</button>
                                    <button className={styles.deleteBtn}>🗑 Șterge</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= Pagination ================= */}
                <div className={styles.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
}

export default Index;

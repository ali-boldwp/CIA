import React, { useMemo, useState } from "react";
import styles from "./Style.module.css";
import Popup from "./Popup";
import { useCreateCategoryMutation } from "../../../../../services/categoryApi";

function View({ data, isError }) {
    const categories = data || [];
    const totalCategories = categories.length;

    const [openAddModal, setOpenAddModal] = useState(false);

    // ✅ Create mutation
    const [createCategory, { isLoading: isCreating, error: createError }] =
        useCreateCategoryMutation();

    /* Pagination */
    const [page, setPage] = useState(1);
    const limit = 10;

    const totalPages = Math.max(1, Math.ceil(categories.length / limit));

    const paginated = useMemo(() => {
        return categories.slice((page - 1) * limit, page * limit);
    }, [page, limit, categories]);

    const onSubmitAddCategory = async (payload) => {
        // payload: { name, status } where status is "active" | "suspended"
        await createCategory(payload).unwrap();
        setOpenAddModal(false);
    };

    const renderStatusText = (status) => {
        if (status === "active") return "activ";
        if (status === "suspended") return "suspendat";
        return status || "-";
    };

    const statusClass = (status) =>
        status === "active" ? styles.active : styles.inactive;

    return (
        <div className={styles.main}>
            {/* Card 1 */}
            <div className={styles.topCard}>
                <h3 className={styles.cardTitle}>
                    <span>Nume categorii</span>
                    <span className={styles.countText}>

                        {totalCategories} {totalCategories === 1 ? "categorie" : "categorii"}
  </span>
                </h3>


                <span
                    className={styles.addCategoryText}
                    onClick={() => setOpenAddModal(true)}
                >
  + Adaugă categorie
</span>

            </div>

            {/* Errors */}
            {isError && (
                <div style={{ padding: 12, background: "#fff", borderRadius: 4 }}>
                    Nu s-au putut încărca categoriile.
                </div>
            )}

            {/* Card 2 */}
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
                            <div className={styles.tableRow} key={c._id || c.id}>
                                <div className={styles.col}>{c.name}</div>

                                {/* Backend me nahi hain abhi -> safe fallback */}
                                <div className={styles.col}>
                                    {c.chapters !== undefined && c.chapters !== null ? c.chapters : "—"}
                                </div>

                                <div className={styles.col}>
                                    {c.tasks !== undefined && c.tasks !== null ? c.tasks : "—"}
                                </div>

                                <div className={styles.col}>
                  <span className={`${styles.stateBadge} ${statusClass(c.status)}`}>
                    {renderStatusText(c.status)}
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

                {/* Pagination */}
                <div className={styles.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        ← Precedent
                    </button>

                    <span>
            Pagina <strong>{page}</strong> din <strong>{totalPages}</strong>
          </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Următor →
                    </button>
                </div>
            </div>

            {/* Popup */}
            {openAddModal && (
                <Popup
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSubmit={onSubmitAddCategory}
                    loading={isCreating}
                    apiError={createError}
                />
            )}
        </div>
    );
}

export default View;

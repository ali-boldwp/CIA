import Header from "../../../../../CategoryView/Components/Header";
import React, { useState } from "react";
import styles from "./Style.module.css";
import {
    useCreateFormFieldsMutation,
    useGetFoamFieldsByTaskQuery,
} from "../../../../../../services/categoryApi";
import Popup from "./Popup";
import { useParams } from "react-router-dom";

function FoamFields() {
    const { id: taskId } = useParams();

    const [openAddModal, setOpenAddModal] = useState(false);

    /** 🔥 GET FIELDS BY TASK */
    const {
        data,
        isLoading: isFetching,
        error: fetchError,
    } = useGetFoamFieldsByTaskQuery(taskId, {
        skip: !taskId,
    });

    /** 🔥 CREATE FIELD */
    const [createFormFields, { isLoading: isCreating, error: createError }] =
        useCreateFormFieldsMutation();

    const fields = data?.data || [];

    const handleSubmit = (data) => {
        return createFormFields({
            ...data,
            task: taskId,
        }).unwrap();
    };

    return (
        <div className={styles.main}>
            <Header />

            {/* TOP CARD */}
            <div className={styles.topCard}>
                <h3 className={styles.cardTitle}>
                    <span>Câmpuri de formular</span>
                </h3>

                <span
                    className={styles.addCategoryText}
                    onClick={() => setOpenAddModal(true)}
                >
                    + Adaugă câmpuri de formular
                </span>
            </div>

            {/* TABLE */}
            <div className={styles.tableCard}>
                {isFetching && (
                    <div className={styles.emptyState}>
                        Se încarcă câmpurile...
                    </div>
                )}

                {fetchError && (
                    <div className={styles.errorState}>
                        Eroare la încărcarea câmpurilor
                    </div>
                )}

                {!isFetching && fields.length === 0 && (
                    <div className={styles.emptyState}>
                        Nu există încă câmpuri de formular.
                    </div>
                )}

                {fields.length > 0 && (
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>Nume</span>
                            <span>Slug</span>
                            <span>Tip</span>
                            <span style={{ textAlign: "right" }}>
                                Acțiuni
                            </span>
                        </div>

                        <div className={styles.tableBody}>
                            {fields.map((field) => (
                                <div
                                    key={field._id}
                                    className={styles.tableRow}
                                >
                                    <div className={styles.col}>
                                        {field.name}
                                    </div>
                                    <div className={styles.col}>
                                        {field.slug}
                                    </div>
                                    <div className={styles.col}>
                                        {field.type}
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.deleteBtn}
                                        >
                                            🗑 Șterge
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* POPUP */}
            {openAddModal && (
                <Popup
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSubmit={handleSubmit}
                    loading={isCreating}
                    apiError={createError}
                />
            )}
        </div>
    );
}

export default FoamFields;

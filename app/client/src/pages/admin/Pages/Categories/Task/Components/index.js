import Header from "../../../../../CategoryView/Components/Header";
import React, { useState } from "react";
import styles from "./Style.module.css";
import { useCreateFormFieldsMutation } from "../../../../../../services/categoryApi";
import Popup from "./Popup";
import { useParams } from "react-router-dom";


function FoamFields() {
    const {id:taskId}=useParams()

    const [openAddModal, setOpenAddModal] = useState(false);
    const [createFormFields, { isLoading, error }] = useCreateFormFieldsMutation();


    const handleSubmit = (data) => {
        return createFormFields({
            ...data,
            task: taskId, // ✅ VERY IMPORTANT
        }).unwrap();
    };

    return (
        <div className={styles.main}>
            <Header />
            {/* Card 1 */}
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

            {/* Popup */}
            {openAddModal && (
                <Popup
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSubmit={handleSubmit}
                    loading={isLoading}
                    apiError={error}
                />
            )}
        </div>
    );
}

export default FoamFields;
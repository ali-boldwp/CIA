import Header from "../../../../../CategoryView/Components/Header";
import React, { useState } from "react";
import styles from "./Style.module.css";
import Popup from "./Popup";


function FoamFields() {


    const [openAddModal, setOpenAddModal] = useState(false);



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

                />
            )}
        </div>
    );
}

export default FoamFields;
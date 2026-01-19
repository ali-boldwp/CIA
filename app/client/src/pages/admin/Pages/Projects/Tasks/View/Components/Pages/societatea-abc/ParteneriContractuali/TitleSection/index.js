import React from "react";
import styles from "./style.module.css"; // Apni CSS file

const Index = () => {
    return (
        <div className={styles.titleContainer}>
            {/* Main Title */}
            <h1 className={styles.mainTitle}>I. Societatea ABC | 4. Parteneri contractuali</h1>

            {/* Section Title */}
            <h3 className={styles.sectionTitle}>Lista Principalilor Clienți Si Furnizori Ai Societatii</h3>
        </div>
    );
};

export default Index;

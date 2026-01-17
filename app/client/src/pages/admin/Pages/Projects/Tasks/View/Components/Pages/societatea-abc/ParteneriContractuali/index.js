import React from 'react';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';


const Index = () => {

    return (
        <div className={styles.container}>
            {/* Single Main Card Container with everything inside */}
            <div className={styles.mainCard}>

                {/* Title Section Component */}
                <TitleSection />


                {/* TextArea Section Component */}
                <TextAreaSection />

                {/* Table Section */}
                <div className={styles.sectionWrapper}>
                    <TableSection />
                </div>

                {/* Image Section */}

                <div className={styles.sectionWrapper}>
                    <ImageSection />
                </div>


                {/* Navigation Buttons */}

                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton}>
                            <span className={styles.saveIcon}>💾</span>
                            Salveaza sectiunea
                        </button>
                        <button className={styles.middleButton}>
                            ❌  Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                        <button className={styles.nextButton}>
                            ➡️  Mergi la I.3. „Date fianciare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

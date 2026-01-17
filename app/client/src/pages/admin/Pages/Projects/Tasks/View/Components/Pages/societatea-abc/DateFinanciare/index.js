import React from 'react';
import styles from "../GeneralInformation/styles.module.css";
import SectionHeader from "./SectionHeader";
import FinancialTable from "./FinancialTable";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Navigation from "./Navigation";

const Index = () => {
    return (
        <>
            <div className={styles.container}>
                {/* Single Main Card Container with everything inside */}
                <div className={styles.mainCard}>
        <SectionHeader/>
        <FinancialTable/>
            <ImagePlaceHolder/>
            <Navigation/>
                </div>
            </div>
        </>
    );
};

export default Index;
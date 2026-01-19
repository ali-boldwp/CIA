import React from "react";
import styles from "../GeneralInformation/styles.module.css";
import SectionHeader from "./SectionHeader";
import FinancialTable from "./FinancialTable";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Navigation from "./Navigation";

const Index = ({ formValues, setFormValues }) => {

    // 1️⃣ Safe state: fallback if empty
    const analysisText = formValues?.dateFinanciare?.analysisText || "";
    const financialTable = formValues?.dateFinanciare?.financialTable || {};
    const images = formValues?.dateFinanciare?.images || [];

    // 2️⃣ Setters that update formValues directly
    const setAnalysisText = (text) => {
        setFormValues(prev => ({
            ...prev,
            dateFinanciare: {
                ...prev.dateFinanciare,
                analysisText: text,
                financialTable,
                images
            }
        }));
    };

    const setFinancialTable = (table) => {
        setFormValues(prev => ({
            ...prev,
            dateFinanciare: {
                ...prev.dateFinanciare,
                analysisText,
                financialTable: table,
                images
            }
        }));
    };

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            dateFinanciare: {
                ...prev.dateFinanciare,
                analysisText,
                financialTable,
                images: imgs
            }
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <SectionHeader
                    value={analysisText}
                    onChange={setAnalysisText}
                />

                <FinancialTable
                    value={financialTable}
                    onChange={setFinancialTable}
                />

                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceHolder images={images} setImages={setImages} />
                </div>

                <Navigation />

            </div>
        </div>
    );
};

export default Index;

import React, { useEffect, useState } from "react";
import styles from "../GeneralInformation/styles.module.css";
import SectionHeader from "./SectionHeader";
import FinancialTable from "./FinancialTable";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Navigation from "./Navigation";

const Index = ({ formValues, setFormValues }) => {

    const [analysisText, setAnalysisText] = useState("");
    const [financialTable, setFinancialTable] = useState({});
    const [images, setImages] = useState([]);

    // 🧠 load existing data (edit mode)
    useEffect(() => {
        if (formValues?.dateFinanciare) {
            const d = formValues.dateFinanciare;
            setAnalysisText(d.analysisText || "");
            setFinancialTable(d.financialTable || {});
            setImages(d.images || []);
        }
    }, []);

    // 🔄 sync to parent (auto)
    useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            dateFinanciare: {
                analysisText,
                financialTable,
                images
            }
        }));
    }, [analysisText, financialTable, images]);

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

                <ImagePlaceHolder
                    value={images}
                    onChange={setImages}
                />

                <Navigation />

            </div>
        </div>
    );
};

export default Index;

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import SectionHeader from "./SectionHeader";
import FinancialTable from "./FinancialTable";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Navigation from "./Navigation";

/* =========================
   UTILITY: Object → rows/columns
========================== */
const mapFinancialTableToRowsColumns = (tableObj = {}) => {
    const columns = [
        "Bilanț (valori în RON)",
        "2024 (RON)",
        "2023 (RON)",
        "2022 (RON)",
    ];

    const rows = Object.keys(tableObj).map(label => [
        label,
        tableObj[label]?.["2024"] || "",
        tableObj[label]?.["2023"] || "",
        tableObj[label]?.["2022"] || "",
    ]);

    return { columns, rows };
};

const Index = ({ formValues, setFormValues, onSaveSection, isSaving }) => {

    /* =========================
       LOCAL STATE (UI-friendly)
    ========================== */
    const [analysisText, setAnalysisText] = useState("");
    const [financialTable, setFinancialTableState] = useState({});
    const [images, setImages] = useState([]);

    /* =========================
       INIT FROM FORM VALUES
    ========================== */
    useEffect(() => {
        setAnalysisText(formValues?.dateFinanciare?.analysisText || "");
        setFinancialTableState(
            formValues?.dateFinanciare?.financialTableRaw || {}
        );
        setImages(formValues?.dateFinanciare?.images || []);
    }, [formValues]);

    /* =========================
       SAVE HANDLER
    ========================== */
    const handleSave = () => {
        const formattedFinancialTable =
            mapFinancialTableToRowsColumns(financialTable);

        const payload = {
            data: {
                dateFinanciare: {
                    analysisText,

                    // ✅ API format (rows + columns)
                    financialTable: formattedFinancialTable,

                    // ✅ UI format preserved
                    financialTableRaw: financialTable,

                    images,
                },
            },
        };

        console.log("FINAL PAYLOAD FOR API:", payload);

        onSaveSection(payload);

        setFormValues(prev => ({
            ...prev,
            dateFinanciare: payload.data.dateFinanciare,
        }));
    };

    /* =========================
       UI (UNCHANGED)
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <SectionHeader
                    value={analysisText}
                    onChange={setAnalysisText}
                />

                <FinancialTable
                    value={financialTable}
                    onChange={setFinancialTableState}
                />

                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>
                        🖼️ Imagini / grafice
                    </h3>
                    <ImagePlaceHolder
                        images={images}
                        setImages={setImages}
                    />
                </div>

                <Navigation
                    isSaving={isSaving}
                    handleSave={handleSave}
                />

            </div>
        </div>
    );
};

export default Index;

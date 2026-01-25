import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import SectionHeader from "./SectionHeader";
import FinancialTable from "./FinancialTable";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Navigation from "./Navigation";

const Index = ({ formValues, setFormValues, onSaveSection,isSaving }) => {
    /* =========================
       LOCAL STATE (like useForm)
    ========================== */
    const [analysisText, setAnalysisText] = useState("");
    const [financialTable, setFinancialTableState] = useState({});
    const [images, setImages] = useState([]);

    /* =========================
       INIT FROM FORM VALUES
    ========================== */
    useEffect(() => {
        setAnalysisText(formValues?.dateFinanciare?.analysisText || "");
        setFinancialTableState(formValues?.dateFinanciare?.financialTable || {});
        setImages(formValues?.dateFinanciare?.images || []);
    }, [formValues]);

    /* =========================
       HANDLERS
    ========================== */
    const handleSave = () => {
        const payload = {
            data: {
                dateFinanciare: {
                    analysisText,
                    financialTable,
                    images,
                },
            },
        };

        console.log("FINAL PAYLOAD FOR API:", payload);
        onSaveSection(payload);

        // update main formValues
        setFormValues(prev => ({
            ...prev,
            dateFinanciare: payload.data.dateFinanciare,
        }));
    };

    const handleFinancialTableChange = (table) => setFinancialTableState(table);
    const handleImagesChange = (imgs) => setImages(imgs);

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <SectionHeader value={analysisText} onChange={setAnalysisText} />

                <FinancialTable
                    value={financialTable}
                    onChange={handleFinancialTableChange}
                />

                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceHolder images={images} setImages={handleImagesChange} />
                </div>


                <Navigation isSaving={isSaving} handleSave={handleSave} />
            </div>
        </div>
    );
};

export default Index;

import React from "react";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";
import styles from "./styles.module.css";

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    /* =========================
       DEFAULT TABLE STRUCTURE
    ========================== */
    const tableColumns = {
        shareholders: ["ACTIONAR", "CALITATE DETINUTA", "COTA-PARTE"],
        management: ["NUME", "CALITATE", "DATA NUMIRE"],
        board: ["NUME", "CALITATE", "DATA START", "DATA END"],
        locations: ["TIP", "ADRESA", "ACT JURIDIC", "PERIOADA"]
    };

    const safeTable = (key, defaultRows = [[]]) => {
        const table = formValues?.generalInfo?.[key];
        return {
            rows: table?.rows?.length > 0 ? table.rows : defaultRows,
            columns: table?.columns?.length > 0 ? table.columns : tableColumns[key]
        };
    };

    const generalProfile =
        formValues?.generalInfo?.generalProfile?.length > 0
            ? formValues.generalInfo.generalProfile
            : [
                ["Denumire societate", ""],
                ["Cod unic de inregistrare (CUI)", ""],
                ["Numar de inmatriculare", ""],
                ["Data infiintarii", ""],
                ["Adresa sediu social", ""],
                ["Obiect principal de activitate (cod CAEN)", ""],
                ["Cifra de afaceri (an 2024)", ""],
                ["Profit net (an 2024)", ""],
                ["Numar mediu angajati", ""]
            ];

    const shareholders = safeTable("shareholders", [["", "", ""]]);
    const management = safeTable("management", [["", "", ""]]);
    const board = safeTable("board", [["", "", "", ""]]);
    const locations = safeTable("locations", [["", "", "", ""]]);

    const images = formValues?.generalInfo?.images?.length > 0
        ? formValues.generalInfo.images
        : [null];

    /* =========================
       UPDATE SECTION
    ========================== */
    const updateSection = (key, newRows, newColumns = null) => {
        setFormValues(prev => ({
            ...prev,
            generalInfo: {
                ...prev.generalInfo,
                generalProfile,
                shareholders,
                management,
                board,
                locations,
                images,
                [key]: {
                    rows: newRows,
                    columns: newColumns || prev.generalInfo[key]?.columns || tableColumns[key]
                }
            }
        }));
    };

    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            generalInfo: {
                ...prev.generalInfo,
                images: imgs,
                generalProfile,
                shareholders,
                management,
                board,
                locations
            }
        }));
    };

    /* =========================
       ADD ROW TO TABLE
    ========================== */
    const addRowToTable = (tableKey) => {
        setFormValues(prev => {
            const table = prev.generalInfo[tableKey] || { rows: [], columns: tableColumns[tableKey] };
            const newRow = table.columns.map(() => "");
            return {
                ...prev,
                generalInfo: {
                    ...prev.generalInfo,
                    [tableKey]: {
                        rows: [...table.rows, newRow],
                        columns: table.columns
                    }
                }
            };
        });
    };

    /* =========================
       RENDER TABLE
    ========================== */
    const renderTable = (tableKey, tableData) => {
        return (
            <>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        {tableData.columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        value={cell}
                                        placeholder={`[${tableData.columns[j]}]`}
                                        onChange={(e) => {
                                            const updated = tableData.rows.map(r => [...r]);
                                            updated[i][j] = e.target.value;
                                            updateSection(tableKey, updated);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button
                    className={styles.addRowButton}
                    type="button"
                    onClick={() => addRowToTable(tableKey)}
                >
                    + Add Row
                </button>
            </>
        );
    };

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 1. Informatii generale
                </h1>

                {/* ================= PROFIL GENERAL ================= */}
                <h3 className={styles.sectionTitle}>📋 Profil General Al Companiei</h3>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>CRITERIU</th>
                        <th>DETALII</th>
                    </tr>
                    </thead>
                    <tbody>
                    {generalProfile.map((row, i) => (
                        <tr key={i}>
                            <td>
                                <input value={row[0]} disabled />
                            </td>
                            <td>
                                <input
                                    placeholder="[text editabil]"
                                    value={row[1]}
                                    onChange={(e) => {
                                        const updated = generalProfile.map(r => [...r]);
                                        updated[i][1] = e.target.value;
                                        updateSection("generalProfile", updated);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ================= TABLES ================= */}
                <h3 className={styles.sectionTitle}>📊 Structura Actionariatului</h3>
                {renderTable("shareholders", shareholders)}

                <h3 className={styles.sectionTitle}>👥 Conducere / Administratori</h3>
                {renderTable("management", management)}

                <h3 className={styles.sectionTitle}>🏛️ Consiliu De Administratie</h3>
                {renderTable("board", board)}

                <h3 className={styles.sectionTitle}>📍 Locatii / Puncte De Lucru</h3>
                {renderTable("locations", locations)}

                {/* ================= IMAGES ================= */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / Grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                    <Navigation
                        onSave={onSaveSection}
                        nextLabel="➡️ Mergi la I.2. Istoric societate"
                        onNext={() => console.log("Navigate to next section")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;

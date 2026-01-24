import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";
import styles from "./styles.module.css";

const tableColumns = {
    shareholders: ["ACTIONAR", "CALITATE DETINUTA", "COTA-PARTE"],
    management: ["NUME", "CALITATE", "DATA NUMIRE"],
    board: ["NUME", "CALITATE", "DATA START", "DATA END"],
    locations: ["TIP", "ADRESA", "ACT JURIDIC", "PERIOADA"]
};

const Index = ({ formValues, onSaveSection }) => {

    /* =========================
       useForm INIT
    ========================== */
    const { control, register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            generalInfo: {
                generalProfile: [
                    ["Denumire societate", ""],
                    ["Cod unic de inregistrare (CUI)", ""],
                    ["Numar de inmatriculare", ""],
                    ["Data infiintarii", ""],
                    ["Adresa sediu social", ""],
                    ["Obiect principal de activitate (cod CAEN)", ""],
                    ["Cifra de afaceri (an 2024)", ""],
                    ["Profit net (an 2024)", ""],
                    ["Numar mediu angajati", ""]
                ],
                shareholders: { rows: [["", "", ""]] },
                management: { rows: [["", "", ""]] },
                board: { rows: [["", "", "", ""]] },
                locations: { rows: [["", "", "", ""]] },
                images: [null]
            }
        }
    });

    /* =========================
       LOAD API DATA (SAFE)
    ========================== */
    useEffect(() => {
        if (formValues?.generalInfo) {
            Object.entries(formValues.generalInfo).forEach(([key, val]) => {
                setValue(`generalInfo.${key}`, val);
            });
        }
    }, [formValues, setValue]);

    /* =========================
       FIELD ARRAYS
    ========================== */
    const shareholdersFA = useFieldArray({ control, name: "generalInfo.shareholders.rows" });
    const managementFA = useFieldArray({ control, name: "generalInfo.management.rows" });
    const boardFA = useFieldArray({ control, name: "generalInfo.board.rows" });
    const locationsFA = useFieldArray({ control, name: "generalInfo.locations.rows" });

    /* =========================
       RENDER TABLE (UNCHANGED UI)
    ========================== */
    const renderTable = (title, key, fa) => (
        <>
            <h3 className={styles.sectionTitle}>{title}</h3>

            <table className={styles.editableTable}>
                <thead>
                <tr>
                    {tableColumns[key].map((col, i) => (
                        <th key={i}>{col}</th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {fa.fields.map((row, i) => (
                    <tr key={row.id}>
                        {tableColumns[key].map((_, j) => (
                            <td key={j}>
                                <input
                                    {...register(`generalInfo.${key}.rows.${i}.${j}`)}
                                    placeholder={`[${tableColumns[key][j]}]`}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <button
                type="button"
                className={styles.addRowButton}
                onClick={() => fa.append(tableColumns[key].map(() => ""))}
            >
                + Add Row
            </button>
        </>
    );

    /* =========================
       SAVE
    ========================== */
    const onSubmit = (data) => {
        const payload = {
            data: {
                generalInfo: {
                    ...data.generalInfo,

                    shareholders: {
                        columns: tableColumns.shareholders,
                        rows: data.generalInfo.shareholders.rows
                    },

                    management: {
                        columns: tableColumns.management,
                        rows: data.generalInfo.management.rows
                    },

                    board: {
                        columns: tableColumns.board,
                        rows: data.generalInfo.board.rows
                    },

                    locations: {
                        columns: tableColumns.locations,
                        rows: data.generalInfo.locations.rows
                    }
                }
            }
        };

        onSaveSection(payload);
    };


    const images = watch("generalInfo.images");

    /* =========================
       UI
    ========================== */
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 1. Informatii generale
                </h1>

                {/* ===== PROFIL GENERAL ===== */}
                <h3 className={styles.sectionTitle}>📋 Profil General Al Companiei</h3>

                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>CRITERIU</th>
                        <th>DETALII</th>
                    </tr>
                    </thead>

                    <tbody>
                    {watch("generalInfo.generalProfile")?.map((row, i) => (
                        <tr key={i}>
                            <td>
                                <input value={row[0]} disabled />
                            </td>
                            <td>
                                <input
                                    {...register(`generalInfo.generalProfile.${i}.1`)}
                                    placeholder="[text editabil]"
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ===== TABLES ===== */}
                {renderTable("📊 Structura Actionariatului", "shareholders", shareholdersFA)}
                {renderTable("👥 Conducere / Administratori", "management", managementFA)}
                {renderTable("🏛️ Consiliu De Administratie", "board", boardFA)}
                {renderTable("📍 Locatii / Puncte De Lucru", "locations", locationsFA)}

                {/* ===== IMAGES ===== */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / Grafice</h3>

                    <ImagePlaceholder
                        images={images}
                        setImages={(imgs) => setValue("generalInfo.images", imgs)}
                    />

                    <Navigation
                        onSave={handleSubmit(onSubmit)}
                        nextLabel="➡️ Mergi la I.2. Istoric societate"
                        onNext={() => console.log("next")}
                    />
                </div>

            </div>
        </form>
    );
};

export default Index;

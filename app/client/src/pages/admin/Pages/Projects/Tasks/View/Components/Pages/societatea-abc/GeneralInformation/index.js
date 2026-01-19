import React, { useEffect, useRef } from 'react';
import ImagePlaceholder from './ImagePlaceholder';
import Navigation from './Navigation';
import styles from './styles.module.css';
import { useUpdateTaskDataMutation } from "../../../../../../../../../../services/taskApi";

const Index = ({ formValues, setFormValues, taskId }) => {

    const latestFormValuesRef = useRef(formValues);
    const [updateTaskData] = useUpdateTaskDataMutation();

    /* =========================
       HELPERS
    ========================== */

    const updateTableCell = (slug, rowIndex, colIndex, value) => {
        setFormValues(prev => {
            const rows = Array.isArray(prev?.[slug]) ? [...prev[slug]] : [];
            rows[rowIndex] = rows[rowIndex] || [];
            rows[rowIndex][colIndex] = value;
            return { ...(prev || {}), [slug]: rows };
        });
    };

    const addRow = (slug, colCount) => {
        setFormValues(prev => {
            const rows = Array.isArray(prev?.[slug]) ? [...prev[slug]] : [];
            rows.push(Array(colCount).fill(""));
            return { ...(prev || {}), [slug]: rows };
        });
    };

    useEffect(() => {
        latestFormValuesRef.current = formValues;
    }, [formValues]);

    const handleAutoSave = async (nextValues) => {
        if (!taskId) return;

        try {
            await updateTaskData({
                id: taskId,
                data: nextValues || latestFormValuesRef.current
            }).unwrap();
        } catch (error) {
            console.error("Auto-save failed", error);
        }
    };

    /* =========================
       INITIAL STATE (SAFE)
    ========================== */

    useEffect(() => {
        setFormValues(prev => ({
            ...prev,

            generalProfile: prev?.generalProfile || Array(9).fill(null).map(() => [""]),
            shareholders: prev?.shareholders || [["", "", ""]],
            management: prev?.management || [["", "", ""]],
            board: prev?.board || [["", "", "", ""]],
            locations: prev?.locations || [["", "", "", ""]],
        }));
    }, [setFormValues]);

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
                <h3 className={styles.sectionTitle}>
                    📋 PROFIL GENERAL AL COMPANIEI
                </h3>

                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>CRITERIU</th>
                            <th>DETALII</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            "Denumire societate",
                            "Cod unic de inregistrare (CUI)",
                            "Numar de inmatriculare",
                            "Data infiintarii",
                            "Adresa sediu social",
                            "Obiect principal de activitate (cod CAEN)",
                            "Cifra de afaceri (an 2024)",
                            "Profit net (an 2024)",
                            "Numar mediu angajati"
                        ].map((label, index) => (
                            <tr key={index}>
                                <td>
                                    <input value={label} disabled />
                                </td>
                                <td>
                                    <input
                                        value={formValues?.generalProfile?.[index]?.[0] || ""}
                                        onChange={(e) =>
                                            updateTableCell("generalProfile", index, 0, e.target.value)
                                        }
                                        onBlur={() => handleAutoSave()}
                                        placeholder="[text editabil]"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button
                        className={styles.addButton}
                        onClick={() => addRow("generalProfile", 1)}
                    >
                        ➕ Adauga rand
                    </button>
                </div>

                {/* ================= ACTIONARI ================= */}
                <h3 className={styles.sectionTitle}>
                    📊 STRUCTURA ACTIONARIATULUI
                </h3>

                <div className={styles.tableContainer}>
                    <table className={styles.editableTable}>
                        <thead>
                        <tr>
                            <th>ACTIONAR</th>
                            <th>CALITATE DETINUTA</th>
                            <th>COTA-PARTE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(formValues?.shareholders || []).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex}>
                                        <input
                                            value={cell || ""}
                                            onChange={(e) =>
                                                updateTableCell("shareholders", rowIndex, colIndex, e.target.value)
                                            }
                                            onBlur={() => handleAutoSave()}
                                            placeholder="[text editabil]"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button
                        className={styles.addButton}
                        onClick={() => addRow("shareholders", 3)}
                    >
                        ➕ Adauga rand
                    </button>
                </div>

                {/* ================= IMAGES ================= */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder />
                    <Navigation />
                </div>

                <div className={styles.noteSection}>
                    <p className={styles.noteText}>
                        Nota: Tabelele pot fi eliminate daca nu se aplica.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Index;

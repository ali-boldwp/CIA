import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";

const Index = ({ formValues, setFormValues, onSaveSection, isSaving }) => {
    /* =========================
       COLUMNS + LOCAL STATE
    ========================== */
    const columns = ["DENUMIRE", "DETALII", "ACTIONARIAT"];

    const defaultRow = () => ({
        DENUMIRE: "",
        STATUS: "active",
        DETALII: {
            cui: "",
            dateInf: "",
            sediu: "",
            caen: "",
            cifraAfaceri: "",
            profit: "",
            angajati: ""
        },
        ACTIONARIAT: ""
    });

    const [participatiIntroducere, setParticipatiiIntroducere] = useState("");
    const [rows, setRows] = useState([
        {
            DENUMIRE: "ABC SRL",
            STATUS: "active",
            DETALII: {
                cui: "",
                dateInf: "",
                sediu: "",
                caen: "",
                cifraAfaceri: "",
                profit: "",
                angajati: ""
            },
            ACTIONARIAT: ""
        }
    ]);
    const [images, setImages] = useState([]);

    /* =========================
       INIT FROM FORM VALUES
       - Supports both formats:
         1) OLD/UI format: rows = [{DENUMIRE, DETALII:{...}, ACTIONARIAT}]
         2) SAVED/API format: rows = [[denumire, "{json detalii}", actionariat]]
    ========================== */
    useEffect(() => {
        // ✅ Introducere is now top-level (like achizitiiIntroducere)
        setParticipatiiIntroducere(formValues?.participatiiIntroducere || "");

        const savedRows = formValues?.participatii?.rows;

        // ✅ If saved rows are array-of-arrays, convert back to objects for UI
        if (Array.isArray(savedRows) && Array.isArray(savedRows[0])) {
            const converted = savedRows.map((r) => {
                const detaliiObj = (() => {
                    try {
                        return JSON.parse(r?.[1] || "{}");
                    } catch {
                        return {};
                    }
                })();

                return {
                    ...defaultRow(),
                    DENUMIRE: r?.[0] || "",
                    STATUS: detaliiObj?.STATUS || "active",
                    DETALII: {
                        ...defaultRow().DETALII,
                        ...detaliiObj
                    },
                    ACTIONARIAT: r?.[2] || ""
                };
            });

            setRows(converted.length > 0 ? converted : [defaultRow()]);
        }
        // ✅ If already object format, just sanitize
        else if (Array.isArray(savedRows) && savedRows.length > 0) {
            const sanitized = savedRows.map((r) => ({
                ...defaultRow(),
                ...r,
                DETALII: { ...defaultRow().DETALII, ...(r?.DETALII || {}) }
            }));
            setRows(sanitized);
        }

        // images remain as before (inside participatii)
        setImages(formValues?.participatii?.images || []);
    }, [formValues]);

    /* =========================
       HANDLERS
    ========================== */
    const handleRowChange = (index, key, value) => {
        const updated = rows.map((row, i) => (i === index ? { ...row, [key]: value } : row));
        setRows(updated);
    };

    const handleDetailsChange = (index, field, value) => {
        const updated = rows.map((row, i) =>
            i === index ? { ...row, DETALII: { ...(row?.DETALII || {}), [field]: value } } : row
        );
        setRows(updated);
    };

    const addRow = () => setRows([...rows, defaultRow()]);

    const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

    /* =========================
       SAVE (Like achizitii format)
       - participatii: {columns, rows:[[...],[...]]}
       - participatiiIntroducere: "..."
       - Other sections kept via ...formValues
    ========================== */
    const handleSave = () => {
        const normalizedRows = rows.map((r) => [
            r?.DENUMIRE || "",
            JSON.stringify({ STATUS: r?.STATUS || "active", ...(r?.DETALII || {}) }),
            r?.ACTIONARIAT || ""
        ]);

        const payload = {
            data: {
                ...formValues,
                participatii: {
                    columns,
                    rows: normalizedRows,
                    images // if you want images to stay inside participatii
                },
                participatiiIntroducere: participatiIntroducere
            }
        };

        console.log("FINAL PAYLOAD:", payload);
        if (onSaveSection) onSaveSection(payload);

        setFormValues((prev) => ({
            ...prev,
            ...payload.data
        }));
    };

    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>
                <h1 className={styles.mainTitle}>I. Societatea ABC | 9. Participatii in alte societati</h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        value={participatiIntroducere}
                        onChange={(e) => setParticipatiiIntroducere(e.target.value)}
                        placeholder="In urma verificarilor efectuate..."
                    />
                    <div className={styles.deleteBoxContainer}>
                        <button className={styles.deleteBox} onClick={() => setParticipatiiIntroducere("")}>
                            Șterge căsuța
                        </button>
                    </div>
                </div>

                {/* Table */}
                <h3 className={styles.sectionTitle}>📋 Tabel participatii in alte societati</h3>
                <table className={styles.editableTableIstoric2}>
                    <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {/* DENUMIRE + STATUS */}
                            <td>
                                <input
                                    value={row?.DENUMIRE || ""}
                                    placeholder="Denumire societate"
                                    onChange={(e) => handleRowChange(index, "DENUMIRE", e.target.value)}
                                />
                                <div className={styles.status}>
                                    {row?.STATUS === "active" ? (
                                        <span className={styles.active}>✔ societate activa</span>
                                    ) : (
                                        <span className={styles.inactive}>✖ Radiata din [anul]</span>
                                    )}
                                </div>
                            </td>

                            {/* DETALII */}
                            <td className={styles.details}>
                                {Object.keys(row?.DETALII || {}).map((field) => (
                                    <div key={field} className={styles.display}>
                                        <b>{field.toUpperCase()}:</b>
                                        <input
                                            value={row?.DETALII?.[field] || ""}
                                            placeholder="[completeaza aici]"
                                            onChange={(e) => handleDetailsChange(index, field, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </td>

                            {/* ACTIONARIAT */}
                            <td>
                  <textarea
                      value={row?.ACTIONARIAT || ""}
                      placeholder="[Structura actionariatului]"
                      className={styles.actionariat}
                      onChange={(e) => handleRowChange(index, "ACTIONARIAT", e.target.value)}
                  />
                            </td>

                            {/* DELETE */}
                            <td>
                                <button className={styles.trash} onClick={() => deleteRow(index)}>
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className={styles.addRow} onClick={addRow}>
                    + Adaugă rând
                </button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                {/* Navigation */}
                <Navigation
                    handleSave={handleSave}
                    isSaving={isSaving}
                    nextLabel="➡️ Mergi la I.3. „Date financiare”"
                    onNext={() => console.log("Navigating to next section...")}
                />
            </div>
        </div>
    );
};

export default Index;

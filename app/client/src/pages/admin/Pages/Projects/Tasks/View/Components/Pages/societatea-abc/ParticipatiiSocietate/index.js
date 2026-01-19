import React from "react";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const Index = ({ formValues, setFormValues }) => {
    // Initialize companies array in formValues if not exists
    const companies = formValues?.participatii?.companies || [
        {
            name: "ABC SRL",
            status: "active",
            cui: "",
            dateInf: "",
            sediu: "",
            caen: "",
            cifraAfaceri: "",
            profit: "",
            angajati: "",
            actionariat: ""
        }
    ];

    const setCompanies = (newCompanies) => {
        setFormValues(prev => ({
            ...prev,
            participatii: {
                ...prev.participatii,
                companies: newCompanies,
                introducere: prev.participatii?.introducere || "",
                images: prev.participatii?.images || []
            }
        }));
    };

    const deleteCompany = (index) => {
        setCompanies(companies.filter((_, i) => i !== index));
    };

    const handleCompanyChange = (index, field, value) => {
        const updated = [...companies];
        updated[index][field] = value;
        setCompanies(updated);
    };

    // Introducere text
    const introducere = formValues?.participatii?.introducere || "";
    const setIntroducere = (text) => {
        setFormValues(prev => ({
            ...prev,
            participatii: {
                ...prev.participatii,
                introducere: text,
                companies,
                images: prev.participatii?.images || []
            }
        }));
    };

    // Images
    const images = formValues?.participatii?.images || [];
    const setImages = (imgs) => {
        setFormValues(prev => ({
            ...prev,
            participatii: {
                ...prev.participatii,
                images: imgs,
                companies,
                introducere
            }
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 9. Participatii in alte societati
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <textarea
                        className={styles.textarea}
                        placeholder="In urma verificarilor efectuate la autoritatile publice, a reiesit faptul ca Societatea [denumire societate] detine si/sau a detinut calitatea de actionar in cadrul urmatoarelor societati comerciale:"
                        value={introducere}
                        onChange={(e) => setIntroducere(e.target.value)}
                    />
                    <div className={styles.deleteBoxContainer}>
                    <button className={styles.deleteBox} onClick={() => setIntroducere("")}>
                        Șterge căsuța
                    </button>
                    </div>
                </div>

                {/* Tabel participatii */}
                <h3 className={styles.sectionTitle}>📋 Tabel participatii in alte societati</h3>

                <table className={styles.editableTableIstoric2}>
                    <thead>
                    <tr>
                        <th>DENUMIRE SOCIETATE</th>
                        <th>DETALII SOCIETATE</th>
                        <th>STRUCTURA ACTIONARIAT</th>
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((c, index) => (
                        <tr key={index}>
                            {/* DENUMIRE + STATUS */}
                            <td>
                                <strong>{c.name}</strong>
                                <div className={styles.status}>
                                    {c.status === "active" ? (
                                        <span className={styles.active}>✔ societate activa</span>
                                    ) : (
                                        <span className={styles.inactive}>✖ Radiata din [anul]</span>
                                    )}
                                </div>
                            </td>

                            {/* DETALII */}
                            <td className={styles.details}>
                                <div className={styles.display}><b>CUI:</b> <input value={c.cui} onChange={(e) => handleCompanyChange(index, "cui", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Data infiintarii:</b> <input value={c.dateInf} onChange={(e) => handleCompanyChange(index, "dateInf", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Sediu social:</b> <input value={c.sediu} onChange={(e) => handleCompanyChange(index, "sediu", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Cod CAEN:</b> <input value={c.caen} onChange={(e) => handleCompanyChange(index, "caen", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Cifra de afaceri:</b> <input value={c.cifraAfaceri} onChange={(e) => handleCompanyChange(index, "cifraAfaceri", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Profit/Pierdere neta:</b> <input value={c.profit} onChange={(e) => handleCompanyChange(index, "profit", e.target.value)} placeholder="[completeaza aici]" /></div>
                                <div className={styles.display}><b>Numar angajati:</b> <input value={c.angajati} onChange={(e) => handleCompanyChange(index, "angajati", e.target.value)} placeholder="[completeaza aici]" /></div>
                            </td>

                            {/* ACTIONARIAT */}
                            <td>
                                    <textarea
                                        className={styles.actionariat}
                                        value={c.actionariat}
                                        onChange={(e) => handleCompanyChange(index, "actionariat", e.target.value)}
                                        placeholder="[Structura actionariatului]"
                                    />
                            </td>

                            {/* DELETE */}
                            <td>
                                <button className={styles.trash} onClick={() => deleteCompany(index)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Add new row button */}
                <button className={styles.addRow} onClick={() => setCompanies([...companies, { name: "", status: "active", cui: "", dateInf: "", sediu: "", caen: "", cifraAfaceri: "", profit: "", angajati: "", actionariat: "" }])}>
                    + Adaugă rând
                </button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder images={images} setImages={setImages} />
                </div>

                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button
                            className={styles.saveButton}

                        >
                            <span className={styles.saveIcon}>💾</span>
                            Salveaza sectiunea
                        </button>

                        <button className={styles.middleButton}>
                            ❌ Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>

                        <button className={styles.nextButton}>
                            ➡️ Mergi la I.3. „Date fianciare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;

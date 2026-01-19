import React from "react";
import ImagePlaceholder from "./ImagePlaceholder";
import Navigation from "./Navigation";
import styles from "./styles.module.css";

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    /* =========================
       SAFE STATE
    ========================== */
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

    const shareholders =
        formValues?.generalInfo?.shareholders?.length > 0
            ? formValues.generalInfo.shareholders
            : [["", "", ""]];

    const management =
        formValues?.generalInfo?.management?.length > 0
            ? formValues.generalInfo.management
            : [["", "", ""]];

    const board =
        formValues?.generalInfo?.board?.length > 0
            ? formValues.generalInfo.board
            : [["", "", "", ""]];

    const locations =
        formValues?.generalInfo?.locations?.length > 0
            ? formValues.generalInfo.locations
            : [["", "", "", ""]];

    const images = formValues?.generalInfo?.images?.length > 0
        ? formValues.generalInfo.images
        : [null];

    /* =========================
       SETTER
    ========================== */
    const updateSection = (key, value) => {
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
                [key]: value
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
                                        const updated = generalProfile.map(r => [...r]); // deep clone inner arrays
                                        updated[i][1] = e.target.value;
                                        updateSection("generalProfile", updated);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ================= ACTIONARI ================= */}
                <h3 className={styles.sectionTitle}>📊 Structura Actionariatului</h3>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>ACTIONAR</th>
                        <th>CALITATE DETINUTA</th>
                        <th>COTA-PARTE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shareholders.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        placeholder={["[nume actionar]", "Selectează", "[ % ]"][j]}
                                        value={cell}
                                        onChange={(e) => {
                                            const updated = shareholders.map(r => [...r]);
                                            updated[i][j] = e.target.value;
                                            updateSection("shareholders", updated);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ================= MANAGEMENT ================= */}
                <h3 className={styles.sectionTitle}>👥 Conducere / Administratori </h3>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>NUME</th>
                        <th>CALITATE</th>
                        <th>DATA NUMIRE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {management.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        placeholder={["[nume]", "Selectează", "[ data ]"][j]}
                                        value={cell}
                                        onChange={(e) => {
                                            const updated = management.map(r => [...r]);
                                            updated[i][j] = e.target.value;
                                            updateSection("management", updated);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ================= BOARD ================= */}
                <h3 className={styles.sectionTitle}>🏛️ Consiliu De Administratie</h3>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>NUME</th>
                        <th>CALITATE</th>
                        <th>DATA START</th>
                        <th>DATA END</th>
                    </tr>
                    </thead>
                    <tbody>
                    {board.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        placeholder={["[nume]", "Selectează", "[ data ]", "[ data ]"][j]}
                                        value={cell}
                                        onChange={(e) => {
                                            const updated = board.map(r => [...r]);
                                            updated[i][j] = e.target.value;
                                            updateSection("board", updated);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* ================= LOCATIONS ================= */}
                <h3 className={styles.sectionTitle}>📍 Locatii / Puncte De Lucru</h3>
                <table className={styles.editableTable}>
                    <thead>
                    <tr>
                        <th>TIP</th>
                        <th>ADRESA</th>
                        <th>ACT JURIDIC</th>
                        <th>PERIOADA</th>
                    </tr>
                    </thead>
                    <tbody>
                    {locations.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        placeholder={["Punct de lucru", "[text editabil]", "[text editabil]", "[perioada]"][j]}
                                        value={cell}
                                        onChange={(e) => {
                                            const updated = locations.map(r => [...r]);
                                            updated[i][j] = e.target.value;
                                            updateSection("locations", updated);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

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

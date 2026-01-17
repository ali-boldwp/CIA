import React from 'react';
import EditableTable from './EditableTable';
import ImagePlaceholder from './ImagePlaceholder';
import Navigation from './Navigation';
import './styles.css';

const Index = () => {
    const generalProfileColumns = [
        { name: "CRITERIU", type: "text" },
        { name: "DETALII", type: "text" }
    ];

    // General Company Profile initial data
    const generalProfileData = [
        [
            { value: "Denumire societate", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Cod unic de inregistrare (CUI)", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Numar de inmatriculare", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Data infiintarii", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Adresa sediu social", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Obiect principal de activitate (cod CAEN)", type: "text" },
            { value: "[text editabil]", type: "text" }
        ],
        [
            { value: "Cifra de afaceri (an 2024)", type: "text" },
            { value: "[valoare] 📈/📉", type: "text", hasCheckbox: true }
        ],
        [
            { value: "Profit net (an 2024)", type: "text" },
            { value: "[valoare] 📈/📉", type: "text", hasCheckbox: true }
        ],
        [
            { value: "Numar mediu angajati", type: "text" },
            { value: "[numar] 📈/📉", type: "text", hasCheckbox: true }
        ]
    ];

    // Shareholder Structure columns
    const shareholderColumns = [
        { name: "ACTIONAR", type: "text", defaultValue: "[nume actionar]" },
        { name: "CALITATE DETINUTA", type: "select", defaultValue: "" },
        { name: "COTA-PARTE", type: "text", defaultValue: "[%]" }
    ];

    // Management/Administrators columns
    const managementColumns = [
        { name: "NUME / DENUMIRE", type: "text", defaultValue: "[nume]" },
        { name: "CALITATE DETINUTA", type: "select", defaultValue: "" },
        { name: "DATA NUMIRE", type: "date", defaultValue: "" }
    ];

    // Board of Directors columns
    const boardColumns = [
        { name: "NUME / DENUMIRE", type: "text", defaultValue: "[nume]" },
        { name: "CALITATE DETINUTA", type: "select", defaultValue: "" },
        { name: "DATA INCEPUT MANDAT", type: "date", defaultValue: "" },
        { name: "DATA SFARSIT MANDAT", type: "date", defaultValue: "" }
    ];

    // Locations/Workpoints columns
    const locationColumns = [
        { name: "TIP", type: "text", defaultValue: "Punct de lucru permanent" },
        { name: "ADRESA", type: "text", defaultValue: "[text editabil]" },
        { name: "ACT JURIDIC", type: "text", defaultValue: "[text editabil]" },
        { name: "PERIOADA", type: "text", defaultValue: "[perioada]" }
    ];

    return (
        <div className="container">
            {/* Single Main Card Container with everything inside */}
            <div className="main-card">

                {/* Main Title */}
                <h1 className="main-title">I. Societatea ABC | 1. Informatii generale</h1>

                {/* Section Title */}
                <h3 className="section-title">📋 PROFIL GENERAL AL COMPANIEI</h3>

                {/* General Company Profile Table */}
                <div className="table-container">
                    <table className="editable-table">
                        <thead>
                        <tr>
                            <th>CRITERIU</th>
                            <th>DETALII</th>
                        </tr>
                        </thead>
                        <tbody>
                        {generalProfileData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {cellIndex === 0 ? (
                                            // ✅ First column (read-only, non-clickable)
                                            <input
                                                type="text"
                                                value={cell.value}
                                                className="input"
                                                disabled
                                            />
                                        ) : (
                                            // ✅ Second column (editable)
                                            <input
                                                type="text"
                                                placeholder={cell.value}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="add-button">Adaugă nouă</button>
                </div>

                {/* Section Title */}
                <h3 className="section-title">📊 STRUCTURA ACTIONARIATULUI</h3>

                {/* Shareholder Structure Table */}
                <div className="table-container">
                    <table className="editable-table">
                        <thead>
                        <tr>
                            <th>ACTIONAR</th>
                            <th>CALITATE DETINUTA</th>
                            <th>COTA-PARTE</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[nume actionar]"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Selectează"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="[ % ]"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className="add-button">Adaugă nouă</button>
                </div>

                {/* Section Title */}
                <h3 className="section-title">👥 CONDUCERE / ADMINISTRATORI</h3>

                {/* Management/Administrators Table */}
                <div className="table-container">
                    <table className="editable-table">
                        <thead>
                        <tr>
                            <th>NUME / DENUMIRE</th>
                            <th>CALITATE DETINUTA</th>
                            <th>DATA NUMIRE</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[nume]"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Selectează"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="[ data ]"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className="add-button">Adaugă nouă</button>
                </div>

                {/* Section Title */}
                <h3 className="section-title">️🏛️ CONSILIU DE ADMINISTRATIE</h3>

                {/* Board of Directors Table */}
                <div className="table-container">
                    <table className="editable-table">
                        <thead>
                        <tr>
                            <th>NUME / DENUMIRE</th>
                            <th>CALITATE DETINUTA</th>
                            <th>DATA INCEPUT MANDAT</th>
                            <th>DATA SFARSIT MANDAT</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[nume]"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Selectează"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="[ data ]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[ data ]"
                                />
                            </td>
                        </tr>
                        </tbody>

                    </table>
                    <button className="add-button">Adaugă nouă</button>
                </div>

                {/* Section Title */}
                <h3 className="section-title">📍 LOCATII / PUNCTE DE LUCRU</h3>

                {/* Locations/Workpoints Table */}
                <div className="table-container">
                    <table className="editable-table">
                        <thead>
                        <tr>
                            <th>TIP</th>
                            <th>ADRESA</th>
                            <th>ACT JURIDIC</th>
                            <th>PERIOADA</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[nume actionar]"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Selectează"
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="[text editabil]"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="[perioada]"
                                />
                            </td>
                        </tr>
                        </tbody>

                    </table>
                    <button className="add-button">Adaugă nouă</button>
                </div>

                {/* Images/Graphics Section */}
                <div className="images-section">
                    <h3 className="section-title">🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder />
                </div>

                {/* Navigation Buttons */}
                <Navigation />

            </div>
        </div>
    );
};

export default Index;
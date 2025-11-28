import { useState, useRef, useEffect } from "react";
import "./NewProjectstyle.css";

const NewProject = () => {
    const [files, setFiles] = useState([]);

    const [respOpen, setRespOpen] = useState(false);
    const [responsible, setResponsible] = useState("Analist C");

    // MULTI-SELECT ANALYSTS
    const [multiOpen, setMultiOpen] = useState(false);
    const [selectedAnalysts, setSelectedAnalysts] = useState([
        "Analist A",
        "Analist E"
    ]);

    const handleFileUpload = (e) => {
        const uploaded = Array.from(e.target.files);
        setFiles([...files, ...uploaded]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files);
        setFiles([...files, ...dropped]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const respRef = useRef(null);
    const multiRef = useRef(null);

    /* CLICK OUTSIDE TO CLOSE */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (respRef.current && !respRef.current.contains(e.target)) {
                setRespOpen(false);
            }
            if (multiRef.current && !multiRef.current.contains(e.target)) {
                setMultiOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* MULTI SELECT HANDLER */
    const toggleAnalyst = (name) => {
        if (selectedAnalysts.includes(name)) {
            setSelectedAnalysts(selectedAnalysts.filter(a => a !== name));
        } else {
            setSelectedAnalysts([...selectedAnalysts, name]);
        }
    };
    const attachedFiles = [
        { name: "Lista_intrebari_client.docx", size: "86 KB" }
    ];



    const analystsList = [
        "Analist A",
        "Analist B",
        "Analist C (responsabil)",
        "Analist D",
        "Analist E",
        "Analist F",
        "Analist G"
    ];



    return (
        <div className="page-wrapper">

            <div className="page-container">

                {/* HEADER */}
                <div className="header-box">
                    <span className="header-back">← Înapoi la solicitare</span>
                    <h1 className="header-title">Creează proiect nou</h1>
                </div>

                {/* FORM CARD */}
                <div className="form-card">

                    <h2 className="form-title">Detalii proiect</h2>

                    {/* ROW 1 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Denumire proiect</label>
                            <input
                                className="input-box"
                                placeholder="ex: Due Diligence: Societatea ABC"
                            />
                        </div>

                        <div className="form-field">
                            <label>Subiect proiect</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Societatea ABC" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row-four">

                        <div className="form-field">
                            <label>Tip raport</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Enhanced Due Diligence" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Tip entitate</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Societate" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Termen limită (deadline)</label>
                            <div className="input-wrapper">
                                <input className="input-box bold" defaultValue="2025-12-05" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Prioritate</label>
                            <div className="input-wrapper">
                                <input className="input-box bold" defaultValue="Normal" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Limbă livrabil</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Română" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Vizualizare fișiere atașate</label>

                            {/* DROPZONE */}
                            <div
                                className="dropzone"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById("fileInput").click()}
                            >
                                <p>📁 Click sau trage fișiere aici</p>
                                <span className="drop-hint">Fișiere acceptate: .pdf, .docx, .png...</span>
                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    hidden
                                />
                            </div>

                            {/* FILE LIST */}
                            {files.map((file, index) => (
                                <div className="file-item" key={index}>
                                    📄 {file.name} · {(file.size / 1024).toFixed(1)} KB
                                </div>
                            ))}
                        </div>


                    </div>


                    {/* DESCRIPTION */}
                    <div className="form-field full-width">
                        <label>Descriere proiect</label>
                        <div className="textarea">
                        <textarea className="textarea-box">
                           Scop: evaluare reputațională & riscuri de integritate; întrebări client; beneficiari reali, litigii active, sancțiuni, reputație media; livrabile: raport PDF.
                        </textarea>

                            <button className="pill-badge textarea-badge ">auto din solicitare</button>
                        </div>
                    </div>


                    <div className="form-card">
                        <h2 className="form-title">Responsabili proiect</h2>

                        <div className="row-two">

                            {/* LEFT: RESPONSABIL PROJECT */}
                            <div className="form-field" ref={respRef}>
                                <label>Responsabil proiect (alege 1)</label>

                                <div
                                    className="dropdown-box"
                                    onClick={() => setRespOpen(!respOpen)}
                                >
                        <span className="dropdown-selected">
                            {responsible} ▾
                        </span>
                                </div>

                                {respOpen && (
                                    <div className="dropdown-list">
                                        <p className="sub-label">Selectează responsabilul</p>

                                        {["Analist A", "Analist B", "Analist C", "Analist D", "Analist E", "Analist F", "Analist G"].map((name) => (
                                            <label className="radio-item" key={name}>
                                                <input
                                                    type="radio"
                                                    name="resp"
                                                    checked={responsible === name}
                                                    onChange={() => {
                                                        setResponsible(name);
                                                        setRespOpen(false);
                                                    }}
                                                />
                                                {name}
                                            </label>
                                        ))}
                                    </div>
                                )}


                            </div>

                            {/* RIGHT: MULTIPLE ANALYSTS */}
                            <div className="form-field" ref={multiRef}>
                                <label>Analiști alocați suplimentar (select multiplu, opțional)</label>

                                <div
                                    className="dropdown-box"
                                    onClick={() => setMultiOpen(!multiOpen)}
                                >
                        <span className="dropdown-selected">
                            {selectedAnalysts.length > 0
                                ? selectedAnalysts.join(", ")
                                : "Selectează analiști ▾"}
                        </span>
                                </div>

                                {multiOpen && (
                                    <div className="dropdown-list">
                                        <p className="sub-label">Selectează analiștii</p>

                                        {analystsList.map((name) => {
                                            const isDisabled = name.includes("(responsabil)");
                                            const cleanName = name.replace(" (responsabil)", "");

                                            return (
                                                <label
                                                    key={name}
                                                    className={`checkbox-item ${isDisabled ? "disabled" : ""}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        disabled={isDisabled}
                                                        checked={selectedAnalysts.includes(cleanName)}
                                                        onChange={() => toggleAnalyst(cleanName)}
                                                    />
                                                    {name}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="button-row">
                            <button className="submit-btn">Creează Task Proiect</button>
                            <button className="submit-btn">Mergi la Task Proiect</button>
                        </div>
                    </div>
                </div>


                <div className="form-card" style={{ marginTop: "30px" }}>

                    <h2 className="form-title">
                        Detalii contract & client (vizibile doar pentru manageri)
                    </h2>

                    {/* ROW 1 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Nume client</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="ZZZ SRL" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Persoană de contact</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Ana Popescu" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Funcție (opțional)</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="Director Achiziții" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 2 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Email</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="ana.popescu@zzz.ro" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Telefon</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="+40 7xx xxx xxx" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Nr. contract</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="CTR-2025-014" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Nr. Anexă</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="ANX-03" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Se dorește</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="OSINT, HUMINT" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 4 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Preț proiect</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="3.500" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Monedă</label>
                            <div className="input-wrapper">
                                <input className="input-box" defaultValue="EUR ▾" />
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 5 */}
                    <div className="row-two">

                        <div className="form-field">
                            <label>Alte informații despre contract</label>

                            <div className="textarea-wrapper">
                <textarea className="textarea-box">
Clauze SLA: 5 zile lucrătoare; livrabile intermediare; confidențialitate extinsă.
                </textarea>
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Solicitare referințe / informații suplimentare</label>

                            <div className="textarea-wrapper">
                <textarea className="textarea-box">
De la Popa Remus
                </textarea>
                                <button className="pill-badge badge-inline">auto din solicitare</button>
                            </div>
                        </div>

                    </div>

                    {/* ROW 6 */}
                    <div className="form-field full-width">
                        <label>Note interne</label>
                        <textarea className="textarea-box">
Risc moderat; țări sursă: RO/DE; verificări suplimentare: CF, RC, monitorizare media.
        </textarea>
                    </div>

                    {/* BUTTONS */}
                    <div className="button-row">
                        <button className="btn-secondary">Salvează draft</button>
                        <button className="btn-primary">Creează pagina proiect</button>
                    </div>

                </div>


            </div>

        </div>
    );
};

export default NewProject;

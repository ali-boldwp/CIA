import "./style.css";


const ProjectCosts = () => {
    return (
        <div className="page-wrapper">
            <div className="page-container">
                {/* HEADER */}
                <div className="header-box">
                    <span className="header-back">← Înapoi la Dashboard</span>
                    <h1 className="header-title">
                        Proiect: Due Diligence Societatea ABC — Costuri
                    </h1>

                    <div className="header-tags">
                        <span className="tag blue">Creat la: 2025-12-01 09:20</span>
                        <span className="tag yellow">Finalizat la: în lucru</span>
                    </div>
                </div>

                {/* TOP ROW: PROJECT DETAILS + FINANCIAL SUMMARY */}
                <div className="top-row">
                    {/* LEFT: PROJECT DETAILS */}
                    <div className="form-card project-card">
                        <h2 className="form-title">Detalii proiect</h2>

                        <div className="project-block">
                            <ul>
                                <li>
                                    <b>Denumire proiect</b>
                                    <span>Due Diligence: Societatea ABC</span>
                                </li>
                                <li>
                                    <b>Tip raport</b>
                                    <span>Enhanced Due Diligence</span>
                                </li>
                                <li>
                                    <b>Tip entitate / caz</b>
                                    <span>Societate</span>
                                </li>
                                <li>
                                    <b>Nume client</b>
                                    <span>ZZZ SRL</span>
                                </li>
                                <li>
                                    <b>Responsabil proiect</b>
                                    <span>Analist C</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT: FINANCIAL SUMMARY */}
                    <div className="form-card finance-card">
                        <h2 className="form-title">Rezumat financiar</h2>

                        <div className="financial-grid">
                            <div className="summary-box box-purple">
                                <span className="s-label">Preț proiect</span>
                                <span className="s-value">3500 EUR</span>
                            </div>

                            <div className="summary-box box-blue">
                                <span className="s-label">Cheltuieli fixe</span>
                                <span className="s-value">300 EUR</span>
                            </div>

                            <div className="summary-box box-cyan">
                                <span className="s-label">Cheltuieli OSINT</span>
                                <span className="s-value">150 EUR</span>
                            </div>

                            <div className="summary-box box-gray">
                                <span className="s-label">Cheltuieli angajați</span>
                                <span className="s-value">1050 EUR</span>
                            </div>

                            <div className="summary-box box-yellow">
                                <span className="s-label">Cheltuieli HUMINT (cu taxe)</span>
                                <span className="s-value">554.4 EUR</span>
                            </div>

                            <div className="summary-box box-lightgray">
                                <span className="s-label">Total cheltuieli</span>
                                <span className="s-value">2054.4 EUR</span>
                            </div>

                            <div className="summary-box box-profit">
                                <div className="profit-left">
                                    <span className="s-label-green">Marjă</span>
                                    <span className="profit-right">41.3%</span>
                                </div>
                                <div className="s-value">1445.6 EUR</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FIXED COSTS + OSINT COSTS BAR */}
                <div className="form-card costs-bar">
                    <div className="cost-block">
                        <h2 className="cost-title">Cheltuieli fixe</h2>

                        <div className="cost-row">
                            <div className="form-field">
                                <label>Cheltuieli totale (editabil)</label>
                                <input className="input-box" defaultValue="180 EUR" />
                            </div>

                            <div className="form-field small-field">
                                <label>Monedă</label>
                                <input className="input-box" defaultValue="EUR ▾" />
                            </div>
                        </div>
                    </div>

                    <div className="cost-block">
                        <h2 className="cost-title">Cheltuieli OSINT</h2>

                        <div className="cost-row">
                            <div className="form-field">
                                <label>Cheltuieli totale (editabil)</label>
                                <input className="input-box" defaultValue="180 EUR" />
                            </div>

                            <div className="form-field small-field">
                                <label>Monedă</label>
                                <input className="input-box" defaultValue="EUR ▾" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* EMPLOYEE COSTS TABLE */}
                <div className="form-card">
                    <h2 className="form-title">Cheltuieli cu angajații (timp & cost)</h2>

                    <table className="cost-table">
                        <thead>
                        <tr>
                            <th>Analist</th>
                            <th>Rol</th>
                            <th>Zile</th>
                            <th>Ore</th>
                            <th>Cost/ora</th>
                            <th>Cost/zi</th>
                            <th>Total</th>
                            <th>Editare</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Analist A</td>
                            <td>Lead OSINT</td>
                            <td>2.5</td>
                            <td>20</td>
                            <td>30 EUR</td>
                            <td>240 EUR</td>
                            <td>600 EUR</td>
                            <td className="edit-cell">📎 Modifică</td>
                        </tr>

                        <tr>
                            <td>Analist C</td>
                            <td>OSINT</td>
                            <td>Automat / 8</td>
                            <td>
                                <input className="input-cell" defaultValue="8" />
                            </td>
                            <td>35 EUR</td>
                            <td>280 EUR</td>
                            <td>280 EUR</td>
                            <td className="edit-cell">✔ Salvează × Anulează</td>
                        </tr>

                        <tr>
                            <td>Analist E</td>
                            <td>OSINT</td>
                            <td>0.5</td>
                            <td>4</td>
                            <td>25 EUR</td>
                            <td>200 EUR</td>
                            <td>100 EUR</td>
                            <td className="edit-cell">📎 Modifică</td>
                        </tr>
                        </tbody>
                    </table>

                    {/* Blank strip under table like in screenshot */}
                    <div className="table-empty-strip" />

                    {/* ADD EMPLOYEE COST BLOCK */}
                    <button className="btn-green">Adaugă cheltuiala</button>

                    <div className="add-block">
                        <p className="block-label">Adaugă cheltuiala (angajați)</p>

                        <div className="row-three">
                            <div className="form-field">
                                <label>Analist</label>
                                <input className="input-box soft" placeholder="Selectează..." />
                            </div>
                            <div className="form-field">
                                <label>Rol</label>
                                <input className="input-box soft" placeholder="Selectează..." />
                            </div>
                            <div className="form-field">
                                <label>Data</label>
                                <input
                                    className="input-box soft"
                                    placeholder="Selectează data"
                                />
                            </div>
                        </div>

                        <div className="row-five">
                            <div className="form-field">
                                <label>Ore lucrate</label>
                                <input className="input-box soft" placeholder="ex: 6.5" />
                            </div>
                            <div className="form-field">
                                <label>Zile (automat)</label>
                                <input className="input-box soft" placeholder="ex: 0.5" />
                            </div>
                            <div className="form-field">
                                <label>Cost/ora (auto)</label>
                                <input className="input-box soft" placeholder="ex: 30" />
                            </div>
                            <div className="form-field">
                                <label>Monedă</label>
                                <input className="input-box soft" placeholder="EUR ▾" />
                            </div>
                            <div className="form-field">
                                <label>Total (auto)</label>
                                <input className="input-box soft" placeholder="195" />
                            </div>
                        </div>

                        <div className="add-actions">
                            <button className="btn-primary">Salvează cheltuiala</button>
                        </div>
                    </div>
                </div>

                {/* HUMINT COSTS */}
                <div className="form-card">
                    <h2 className="form-title">Cheltuieli HUMINT</h2>

                    <table className="cost-table">
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descriere</th>
                            <th>Utilitate</th>
                            <th>Cash</th>
                            <th>Alte</th>
                            <th>Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>2025-11-18</td>
                            <td>Interviu sursa</td>
                            <td>4/5</td>
                            <td>200 EUR</td>
                            <td>60 EUR</td>
                            <td>260 EUR</td>
                        </tr>

                        <tr>
                            <td>2025-11-20</td>
                            <td>Verificare locatie</td>
                            <td>3/5</td>
                            <td>120 EUR</td>
                            <td>45 EUR</td>
                            <td>165 EUR</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="total-box">Total HUMINT: 425 EUR</div>

                    <button className="btn-green">Adaugă cheltuiala</button>

                    {/* ADD HUMINT COST BLOCK */}
                    <div className="add-block">
                        <p className="block-label">Adaugă cheltuiala HUMINT</p>

                        {/* Row 1 */}
                        <div className="row-two">
                            <div className="form-field">
                                <label>Data</label>
                                <input className="input-box soft" placeholder="Selectează data" />
                            </div>

                            <div className="form-field">
                                <label>Descriere</label>
                                <input
                                    className="input-box soft"
                                    placeholder="ex: Interviu sursa, deplasare, verificare locatie"
                                />
                            </div>
                        </div>

                        {/* Row 2 (6 columns) */}
                        <div className="row-six">

                            <div className="form-field utilitate-list">
                                <label>Utilitate (1-5)</label>
                                <div className="utilitate-box">
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Cost</label>
                                <input className="input-box soft" placeholder="ex: 200" />
                            </div>

                            <div className="form-field">
                                <label>Monedă</label>
                                <input className="input-box soft" placeholder="EUR ▾" />
                            </div>

                            <div className="form-field">
                                <label>Cost cu taxe</label>
                                <input className="input-box soft" placeholder="ex: 200 + 32%" />
                            </div>

                            <div className="form-field">
                                <label>Procent total taxe</label>
                                <input className="input-box soft" placeholder="32%" />
                            </div>

                            <div className="form-field">
                                <label>Total (auto)</label>
                                <input className="input-box soft" placeholder="260 EUR" />
                            </div>
                        </div>

                        <div className="add-actions">
                            <button className="btn-primary">Salvează cheltuiala</button>
                        </div>
                    </div>
                </div>


                {/* PAGE FOOTER BUTTONS */}
                <div className="button-row footer-row">
                    <button className="btn-secondary" style={{"background":"#10B981"}}>Salvează modificări</button>
                    <button className="btn-primary">Înapoi la Pagina Proiect</button>
                </div>
            </div>
        </div>
    );
};


export default ProjectCosts;

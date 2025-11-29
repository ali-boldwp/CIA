import "./style.css"
import { FaUser } from "react-icons/fa";
const AnalystProfile=()=>{

    const projects = [
        {
            name: "Due Diligence: Societatea ABC",
            role: "Membru",
            start: "2025-01-10",
            end: "2025-02-02",
            days: 24,
            billed: "RON 50.000",
            cost: "RON 5.000",
            status: "La termen",
            score: 90,
            feedback: "Structurat și complet."
        },
        {
            name: "Fraud investigation: KSTE RO",
            role: "Responsabil",
            start: "2025-10-12",
            end: "2025-11-10",
            days: 30,
            billed: "RON 70.000",
            cost: "RON 5.000",
            status: "Înainte de termen",
            score: 92,
            feedback: "Foarte mulțumit de claritate."
        },
        {
            name: "Background check: Persoana A.B.",
            role: "Membru",
            start: "2025-03-06",
            end: "2025-03-18",
            days: 11,
            billed: "RON 12.000",
            cost: "RON 5.000",
            status: "Înainte de termen",
            score: 88,
            feedback: "Rapid și bine documentat."
        },
        {
            name: "Raport de informare: Societatea KLM",
            role: "Membru",
            start: "2025-05-02",
            end: "2025-05-28",
            days: 27,
            billed: "RON 30.000",
            cost: "RON 5.000",
            status: "La termen",
            score: 87,
            feedback: "Clar și aplicat pe obiective."
        },
        {
            name: "Preliminary Due Diligence: Societatea QRS",
            role: "Membru",
            start: "2025-06-10",
            end: "2025-06-25",
            days: 16,
            billed: "RON 18.000",
            cost: "RON 5.000",
            status: "După termen",
            score: 80,
            feedback: "Întârziere minoră."
        },
        {
            name: "Background check: Persoana C.D.",
            role: "Membru",
            start: "2025-02-08",
            end: "2025-02-28",
            days: 17,
            billed: "RON 14.000",
            cost: "RON 5.000",
            status: "La termen",
            score: 89,
            feedback: "Concils și util."
        },
        {
            name: "Monitoring: XYZ SRL",
            role: "Membru",
            start: "2025-04-10",
            end: "2025-04-25",
            days: 16,
            billed: "RON 10.000",
            cost: "RON 5.000",
            status: "La termen",
            score: 85,
            feedback: "Ok perimetrul/abordarea."
        },
        {
            name: "Vendor screening: MNO",
            role: "Membru",
            start: "2025-09-05",
            end: "2025-09-25",
            days: 21,
            billed: "RON 22.000",
            cost: "RON 5.000",
            status: "La termen",
            score: 91,
            feedback: "Foarte bine."
        }
    ];

    const scoreDots = (score) => {
        const dots = Math.round(score / 10);
        return (
            <div className="score-dots">
                {[...Array(dots)].map((_, i) => (
                    <span key={i} className="dot"></span>
                ))}
            </div>
        );
    };

    const statusClass = {
        "La termen": "status-blue",
        "Înainte de termen": "status-green",
        "După termen": "status-red"
    };

    const groups = [
        { label: "Implicare (general)", options: ["Scăzută", "Medie", "Ridicată"] },
        { label: "Atenție la detalii", options: ["Scăzută", "Medie", "Ridicată"] },
        { label: "Timp de răspuns", options: ["Rar", "Moderat", "Frecvent"] },
        { label: "Atitudine față de colegi", options: ["Negativă", "Neutră", "Pozitivă"] },

        { label: "Comunicare (ușor de comunicat)", options: ["Scăzută", "Medie", "Ridicată"] },
        { label: "Pauze (frecvență)", options: ["Rar", "Moderat", "Frecvent"] },
        { label: "Atitudine față de muncă", options: ["Negativă", "Neutră", "Pozitivă"] },
        { label: "Curat?", options: ["Da", "Uneori", "Nu"] }
    ];


    return(
 <div className="container">
     <div className="header-wrapper">
         <div className="header-left">
             <button className="btn-back">← Înapoi la Dashboard</button>

             <h2 className="header-title">
                 <FaUser className="user-icon" />
                 Analist — Iulia Barbu
             </h2>
         </div>

         <div className="header-right">
             <button className="btn-export">Export PDF</button>
             <button className="btn-save">Salvează</button>
         </div>
     </div>
     <div className="info-wrapper">

         {/* TOP IDENTITY SECTION */}
         <div className="identity-box">
             <div className="identity-left">
                 <div>
                     <span className="label">Nume</span>
                     <div className="value">Iulia Barbu</div>
                 </div>

                 <div>
                     <span className="label">Rol</span>
                     <div className="value">Analist</div>
                 </div>
             </div>

             <div className="identity-right">
                 <div>
                     <span className="label">Data angajării</span>
                     <div className="value">2023-03-15</div>
                 </div>

                 <div>
                     <span className="label">Vechime</span>
                     <div className="value">2 ani, 7 luni</div>
                 </div>
             </div>
         </div>

         {/* STAT GRID */}
         <div className="stats-grid">
             {[
                 { label: "Proiecte totale", value: 8 },
                 { label: "Responsabil proiect", value: 1 },
                 { label: "Membru echipă", value: 7 },
                 { label: "Înainte de termen", value: 2 },
                 { label: "La termen", value: 5 },
                 { label: "După termen", value: 1 },
                 { label: "Scor mediu", value: "88.0/100" },
                 { label: "Salariu lunar", value: "RON 8.700" },
                 { label: "Bonus (12 luni)", value: "RON 7.000" },
                 { label: "Cost (12 luni)", value: "RON 111.400" },
                 { label: "General (alocat)", value: "RON 115.265" },
                 { label: "Profit estimat", value: "RON 3.865 + 3%" },
             ].map((item, i) => (
                 <div key={i} className="stat-card">
                     <span className="stat-label">{item.label}</span>
                     <span className="stat-value">{item.value}</span>
                 </div>
             ))}
         </div>

     </div>
     <div>
         <h3 className="projects-title">Proiecte la care a participat</h3>
     <div className="project-wrapper">


         <div className="projects-container">
             <table className="projects-table">
                 <thead>
                 <tr>
                     <th>Proiect</th>
                     <th>Rol</th>
                     <th>Start</th>
                     <th>Final</th>
                     <th>Durată (zile)</th>
                     <th>Facturat</th>
                     <th>Cost analist</th>
                     <th>Status termen</th>
                     <th>Scor</th>
                     <th>Feedback client</th>
                 </tr>
                 </thead>

                 <tbody  >
                 {projects.map((p, i) => (
                     <tr    key={i}>
                         <td>{p.name}</td>
                         <td>{p.role}</td>
                         <td>{p.start}</td>
                         <td>{p.end}</td>
                         <td>{p.days}</td>
                         <td>{p.billed}</td>
                         <td>{p.cost}</td>

                         <td>
                  <span className={`status-pill ${statusClass[p.status]}`}>
                    {p.status}
                  </span>
                         </td>

                         <td>
                             <div className="score-wrapper">
                                 <span className="score-text">{p.score}/100</span>
                                 {scoreDots(p.score)}
                             </div>
                         </td>

                         <td className="feedback-text">{p.feedback}</td>
                     </tr>
                 ))}
                 </tbody>

             </table>
         </div>
     </div>
     </div>
     <div className="eval-wrapper">
         <h3 className="eval-title" style={{margin:"35px 0px"}}>
             Evaluare manager (obiceiuri & atitudini) + scor personal de adăugat
         </h3>

         {/* MAIN EVALUATION BLOCK */}
         <div className="eval-box">
             <div className="eval-grid">
                 {groups.map((g, i) => (
                     <div key={i} className="eval-group">
                         <label className="eval-label">{g.label}</label>
                         <div className="eval-options">
                             {g.options.map((opt, idx) => (
                                 <label key={idx} className="eval-option">
                                     <input type="checkbox" />
                                     {opt}
                                 </label>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>

             {/* OBSERVATIONS */}
             <label className="obs-label">Observații / acțiuni recomandate</label>
             <textarea className="obs-textarea"></textarea>
         </div>

         {/* FOOTER BUTTONS */}
         <div className="eval-footer">
             <div className="footer-left">
                 <button className="btn-light">+ Adaugă obiectiv</button>
                 <button className="btn-light">+ Adaugă feedback</button>
             </div>

             <button className="btn-back">← Înapoi</button>
         </div>
     </div>
 </div>
    )
}

export default AnalystProfile
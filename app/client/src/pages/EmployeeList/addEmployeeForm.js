import React, { useState } from "react";
import styles from "./EmployeeList.module.css";

export default function AddEmployeeForm({ closeModal }) {

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [date, setDate] = useState("");
    const [salary, setSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [bonusProject, setBonusProject] = useState("");
    const [notes, setNotes] = useState("");

    const reset = () => {
        setName("");
        setRole("");
        setDate("");
        setSalary("");
        setBonus("");
        setBonusProject("");
        setNotes("");
    };

    const saveEmployee = () => {
        // Later you will connect API here
        alert("Saved!");

        closeModal();
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Adaugă angajat</h3>

            <div className={styles.grid}>

                <div className={styles.field}>
                    <label>Nume</label>
                    <input
                        type="text"
                        placeholder="ex: Angajat N"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Funcție</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Selectează funcția -</option>
                        <option>CEO</option>
                        <option>CFO</option>
                        <option>Analist</option>
                        <option>Tehnician</option>
                        <option>Șofer</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Data angajării</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Salariu lunar brut (RON)</label>
                    <input
                        type="number"
                        placeholder="ex: 6000"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Bonus lunar (RON)</label>
                    <input
                        type="number"
                        placeholder="ex: 500"
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Bonus proiect (RON)</label>
                    <input
                        type="number"
                        placeholder="ex: 800"
                        value={bonusProject}
                        onChange={(e) => setBonusProject(e.target.value)}
                    />
                </div>
            </div>

            {/* Notes */}
            <div className={styles.notesBox}>
                <label>Note (optional)</label>
                <textarea
                    placeholder="observații, senioritate, certificări..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>

            {/* FORMULA PREVIEW */}
            <div className={styles.previewBox}>
                <h4>Previzualizare formulă:</h4>
                <p><strong>Bonus incl. taxe = (Bonus lunar + bonus proiect) * (1 + nivel taxare cash)</strong></p>
                <p>Cost total = salariu brut + bonus incl. taxe</p>
                <p>Cost/zi = salariu / 160 • Cost/oră = x 8</p>
            </div>

            {/* FOOTER BUTTONS */}
            <div className={styles.buttons}>
                <button className={styles.resetBtn} onClick={reset}>
                    Resetează
                </button>
                <button className={styles.saveBtn} onClick={saveEmployee}>
                    Salvează în listă
                </button>
            </div>
        </div>
    );
}

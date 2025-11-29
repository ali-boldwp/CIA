// /src/pages/AnalystList/AddAnalystForm.js
import React, { useState, useMemo } from "react";
import styles from "./AnalystList.module.css";

export default function AddAnalystForm({ closeModal }) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [salary, setSalary] = useState("");
    const [date, setDate] = useState("");
    const [bonus, setBonus] = useState("");
    const [notes, setNotes] = useState("");

    // ab ye editable honge
    const [hoursMonth, setHoursMonth] = useState(160);
    const [hoursDay, setHoursDay] = useState(8);

    // auto calc cost/oră & cost/zi
    const { costHour, costDay } = useMemo(() => {
        const s = parseFloat(salary || "0");
        const hMonth = parseFloat(hoursMonth || "0");
        const hDay = parseFloat(hoursDay || "0");

        if (!s || !hMonth || !hDay) {
            return { costHour: "0", costDay: "0" };
        }

        const perHour = (s / hMonth).toFixed(1);       // salary / ore/lună
        const perDay = (perHour * hDay).toFixed(0);    // cost/oră * ore/zi

        return { costHour: perHour, costDay: perDay };
    }, [salary, hoursMonth, hoursDay]);

    const reset = () => {
        setName("");
        setRole("");
        setSalary("");
        setDate("");
        setBonus("");
        setNotes("");
        setHoursMonth(160);
        setHoursDay(8);
    };

    const saveAnalyst = () => {
        alert("Analist salvat!");
        closeModal();
    };

    return (
        <div className={styles.formContainer}>
            <h3 className={styles.formTitle}>Adaugă analist</h3>
            <p className={styles.formSubtitle}>
                Completează câmpurile. Costurile se calculează automat din salariu / ore.
                Câmpurile „auto” sunt calculate și nu necesită introducere.
            </p>

            <div className={styles.formGrid}>
                {/* ROW 1 */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Nume</label>
                    <input
                        type="text"
                        placeholder="ex: Analist I"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className={`${styles.field} ${styles.fieldRightWide}`}>
                    <label>Salariu lunar (RON)</label>
                    <input
                        type="number"
                        placeholder="ex: 6000"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>

                {/* ROW 2 */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Funcție</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Selectează funcția -</option>
                        <option>Head of Investigations</option>
                        <option>Analist de informații</option>
                        <option>Detectiv HUMINT</option>
                    </select>

                    <div className={styles.helperText}>
                        Roluri disponibile: Head of Investigations · Analist de informații · Detectiv HUMINT
                    </div>
                </div>

                <div className={`${styles.fieldSmall} ${styles.fieldRight}`}>
                    <label>Ore/lună</label>
                    <input
                        type="number"
                        value={hoursMonth}
                        onChange={(e) => setHoursMonth(e.target.value)}
                    />
                </div>

                <div className={`${styles.fieldSmall} ${styles.fieldRightLast}`}>
                    <label>Ore/zi</label>
                    <input
                        type="number"
                        value={hoursDay}
                        onChange={(e) => setHoursDay(e.target.value)}
                    />
                </div>

                {/* ROW 3 */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Data angajării</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className={`${styles.fieldSmall} ${styles.fieldRight}`}>
                    <label>Bonus (%)</label>
                    <input
                        type="number"
                        placeholder="-"
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                    />
                </div>

                <div className={`${styles.fieldCosts} ${styles.fieldRightLast}`}>
                    <label>Costuri (calcul automat)</label>
                    <div className={styles.costGrid}>
                        <input
                            value={costHour}
                            readOnly
                            placeholder="Cost/oră"
                            className={styles.costInput}
                        />
                        <input
                            value={costDay}
                            readOnly
                            placeholder="Cost/zi"
                            className={styles.costInput}
                        />
                    </div>
                </div>

                {/* ROW 4 – NOTE */}
                <div className={`${styles.notesBox} ${styles.fieldFull}`}>
                    <label>Note (optional)</label>
                    <textarea
                        placeholder="observații, senioritate, certificări…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* ROW 5 – PREVIEW */}
                <div className={`${styles.previewBox} ${styles.fieldFull}`}>
                    <strong>Previzualizare costuri:</strong>{" "}
                    <span>
            Salariu {salary || 0} RON → Cost/oră = {costHour} RON, Cost/zi = {costDay} RON
          </span>
                </div>
            </div>

            {/* BUTTONS */}
            <div className={styles.buttons}>
                <button className={styles.resetBtn} onClick={reset}>
                    Reset
                </button>
                <button className={styles.saveBtn} onClick={saveAnalyst}>
                    Salvează
                </button>
            </div>
        </div>
    );
}

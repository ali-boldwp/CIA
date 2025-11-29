import React, { useEffect, useState } from "react";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation
} from "../../services/EmployeesApi";
import styles from "./EmployeeList.module.css";

export default function AddEmployeeForm({ mode = "add", employee = null, closeModal }) {

    const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
    const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [date, setDate] = useState("");
    const [salary, setSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [bonusProject, setBonusProject] = useState("");
    const [notes, setNotes] = useState("");

    // Load existing employee into form when editing
    useEffect(() => {
        if (mode === "edit" && employee) {
            setName(employee.name);
            setRole(employee.jobRole);
            setDate(employee.hiringDate.split("T")[0]);
            setSalary(employee.salaryGross);
            setBonus(employee.bonusMonthly);
            setBonusProject(employee.bonusProject);
            setNotes(employee.notes || "");
        }
    }, [employee, mode]);

    const reset = () => {
        setName("");
        setRole("");
        setDate("");
        setSalary("");
        setBonus("");
        setBonusProject("");
        setNotes("");
    };

    const saveEmployee = async () => {
        const payload = {
            name,
            jobRole: role,
            hiringDate: date,
            salaryGross: Number(salary),
            bonusMonthly: Number(bonus),
            bonusProject: Number(bonusProject),
            notes,
        };

        try {
            if (mode === "add") {
                await createEmployee(payload).unwrap();
                alert("Angajat adăugat!");
            } else {
                await updateEmployee({ id: employee._id, updatedData: payload }).unwrap();
                alert("Angajat actualizat!");
            }

            reset();
            closeModal();

        } catch (error) {
            console.error("Error saving employee:", error);
            alert("Eroare la salvare.");
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                {mode === "add" ? "Adaugă angajat" : "Editează angajat"}
            </h3>

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
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Bonus lunar (RON)</label>
                    <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Bonus proiect (RON)</label>
                    <input
                        type="number"
                        value={bonusProject}
                        onChange={(e) => setBonusProject(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.notesBox}>
                <label>Note (optional)</label>
                <textarea
                    placeholder="observații, senioritate, certificări..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>

            <div className={styles.buttons}>
                <button className={styles.resetBtn} onClick={reset}>
                    Resetează
                </button>

                <button
                    className={styles.saveBtn}
                    onClick={saveEmployee}
                    disabled={creating || updating}
                >
                    {creating || updating
                        ? "Se salvează..."
                        : mode === "add"
                            ? "Salvează"
                            : "Actualizează"}
                </button>
            </div>
        </div>
    );
}

import React, { useEffect } from "react";
import styles from "./AnalystList.module.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { useCreateAnalystMutation } from "../../services/analystApi";
import { useUpdateUserMutation } from "../../services/userApi";

export default function AddAnalystForm({ closeModal, editData }) {
    const isEdit = Boolean(editData);

    // Convert backend user → form-friendly values
    const convertEditData = (data) => {
        if (!data) return null;

        return {
            name: data.name || "",
            analystRole: data.analystRole || "",
            salary: data.monthlySalary || "",
            hoursMonth: data.hoursPerMonth || 160,
            hoursDay: data.hoursPerDay || 8,
            bonus: data.bonus || 0,
            date: data.hiringDate ? data.hiringDate.substring(0, 10) : "",
            notes: data.notes || "",
        };
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
    } = useForm({
        defaultValues: convertEditData(editData) || {
            name: "",
            analystRole: "",
            salary: "",
            hoursMonth: 160,
            hoursDay: 8,
            bonus: "",
            date: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (editData) reset(convertEditData(editData));
    }, [editData, reset]);

    // Auto cost
    const salary = watch("salary");
    const hoursMonth = watch("hoursMonth");
    const hoursDay = watch("hoursDay");

    const costHour = salary && hoursMonth ? (salary / hoursMonth).toFixed(1) : 0;
    const costDay = (costHour * hoursDay).toFixed(0);

    const [createAnalyst] = useCreateAnalystMutation();
    const [updateAnalyst] = useUpdateUserMutation();

    const onSubmit = async (data) => {
        const payload = {
            name: data.name,

            // Analyst-specific fields (must match Mongoose schema)
            role: "analyst", // fixed role
            analystRole: data.analystRole,

            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),

            bonus: Number(data.bonus),
            hiringDate: data.date,
            notes: data.notes,

            costPerHour: Number(costHour),
            costPerDay: Number(costDay),
        };

        try {
            if (isEdit) {
                await updateAnalyst({ id: editData._id, data: payload }).unwrap();
                toast.success("Analist actualizat!");
            } else {
                await createAnalyst(payload).unwrap();
                toast.success("Analist creat!");
            }

            closeModal();
        } catch (err) {
            toast.error(err?.data?.message || "Eroare la salvare!");
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.formTitle}>
                {isEdit ? "Editează analist" : "Adaugă analist"}
            </h3>

            <p className={styles.formSubtitle}>
                Completează câmpurile. Costurile se calculează automat.
            </p>

            <div className={styles.formGrid}>

                {/* NAME */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Nume</label>
                    <input placeholder="ex: Iulia Barbu" {...register("name")} />
                </div>

                {/* SALARY */}
                <div className={`${styles.field} ${styles.fieldRightWide}`}>
                    <label>Salariu lunar (RON)</label>
                    <input type="number" {...register("salary")} />
                </div>

                {/* ANALYST ROLE — matches your model */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Funcție analist</label>
                    <select {...register("analystRole")}>
                        <option value="">Selectează funcția</option>
                        <option value="Head of Investigations">Head of Investigations</option>
                        <option value="Intelligence Analyst">Intelligence Analyst</option>
                        <option value="HUMINT Detective">HUMINT Detective</option>
                    </select>
                </div>

                {/* HOURS MONTH */}
                <div className={styles.fieldSmall}>
                    <label>Ore/lună</label>
                    <input type="number" {...register("hoursMonth")} />
                </div>

                {/* HOURS DAY */}
                <div className={styles.fieldSmall}>
                    <label>Ore/zi</label>
                    <input type="number" {...register("hoursDay")} />
                </div>

                {/* DATE */}
                <div className={`${styles.field} ${styles.fieldLeft}`}>
                    <label>Data angajării</label>
                    <input type="date" {...register("date")} />
                </div>

                {/* BONUS */}
                <div className={styles.fieldSmall}>
                    <label>Bonus (%)</label>
                    <input type="number" {...register("bonus")} />
                </div>

                {/* COSTS */}
                <div className={styles.fieldCosts}>
                    <label>Costuri (automat)</label>
                    <div className={styles.costGrid}>
                        <input readOnly value={costHour} className={styles.costInput} />
                        <input readOnly value={costDay} className={styles.costInput} />
                    </div>
                </div>

                {/* NOTES */}
                <div className={styles.notesBox}>
                    <label>Note</label>
                    <textarea placeholder="observații..." {...register("notes")} />
                </div>
            </div>

            <div className={styles.buttons}>
                <button type="button" className={styles.resetBtn} onClick={() => reset()}>
                    Reset
                </button>

                <button className={styles.saveBtn} type="submit">
                    {isEdit ? "Actualizează" : "Salvează"}
                </button>
            </div>
        </form>
    );
}

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./AddAnalystManager.module.css";

import {
    useCreateAnalystMutation,
    useUpdateAnalystMutation,
} from "../../../../services/analystApi";

const AddAnalystManager = ({ isOpen, onClose, editData }) => {
    const isEdit = Boolean(editData);

    const convertEditData = (data) => {
        if (!data) return null;

        return {
            name: data.name,
            role: data.role,
            salary: data.monthlySalary,
            hoursMonth: data.hoursPerMonth,
            hoursDay: data.hoursPerDay,
            bonus: data.bonus,
            date: data.hiringDate?.substring(0, 10),
            notes: data.notes,

            // NEW login fields
            isLogin: data.isLogin || false,
            username: data.username || "",
            password: "",
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
            role: "",
            salary: "",
            date: "",
            bonus: "",
            notes: "",
            hoursMonth: 160,
            hoursDay: 8,

            // NEW defaults
            isLogin: false,
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        if (editData) reset(convertEditData(editData));
    }, [editData, reset]);

    const salary = watch("salary");
    const hoursMonth = watch("hoursMonth");
    const hoursDay = watch("hoursDay");
    const isLogin = watch("isLogin");

    const costHour = salary && hoursMonth ? (salary / hoursMonth).toFixed(1) : 0;
    const costDay = (costHour * hoursDay).toFixed(0);

    const [createAnalyst] = useCreateAnalystMutation();
    const [updateAnalyst] = useUpdateAnalystMutation();

    const onSubmit = async (data) => {
        const payload = {
            name: data.name,
            role: data.role,

            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),

            bonus: Number(data.bonus),
            hiringDate: data.date,
            notes: data.notes,

            costPerHour: Number(costHour),
            costPerDay: Number(costDay),

            // NEW login
            isLogin: Boolean(data.isLogin),
            username: data.isLogin ? data.username : undefined,
            password: data.isLogin ? data.password : undefined,
        };

        try {
            if (isEdit) {
                await updateAnalyst({ id: editData._id, data: payload }).unwrap();
                toast.success("Analist actualizat!");
            } else {
                await createAnalyst(payload).unwrap();
                toast.success("Analist creat!");
            }

            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Eroare la salvare!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
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
                            <input placeholder="ex: Analist I" {...register("name")} />
                        </div>

                        {/* SALARY */}
                        <div className={`${styles.field} ${styles.fieldRightWide}`}>
                            <label>Salariu lunar (RON)</label>
                            <input type="number" {...register("salary")} />
                        </div>

                        {/* ROLE */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Funcție</label>
                            <select {...register("role")}>
                                <option value="">Selectează funcția</option>
                                <option>Head of Investigations</option>
                                <option>Intelligence Analyst</option>
                                <option>HUMINT Detective</option>
                                <option>Analyst</option>
                            </select>
                            <p className={styles.helperText}>Alege rolul principal al analistului.</p>
                        </div>

                        {/* CHECKBOX */}
                        <div className={styles.fieldFull}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" {...register("isLogin")} />
                                <span>Are cont de acces</span>
                            </label>

                        </div>

                        {/* USERNAME & PASSWORD EXACT CHECKBOX KE NICHE */}
                        {isLogin && (
                            <div className={`${styles.fieldFull} ${styles.loginBox}`}>
                                <div className={styles.loginGrid}>
                                    <div className={styles.field}>
                                        <label>Username</label>
                                        <input placeholder="ex: andrei.pop" {...register("username")} />
                                    </div>

                                    <div className={styles.field}>
                                        <label>Parolă</label>
                                        <input type="password" placeholder="••••••••" {...register("password")} />
                                    </div>
                                </div>
                            </div>
                        )}

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

                        {/* COSTS AUTOMATIC */}
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

                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Anulează
                        </button>

                        <button className={styles.saveBtn} type="submit">
                            {isEdit ? "Actualizează" : "Salvează"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddAnalystManager;

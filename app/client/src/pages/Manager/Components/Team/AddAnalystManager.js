import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./AddAnalystManager.module.css";

import {
    useCreateAnalystMutation,
    useUpdateAnalystMutation,
} from "../../../../services/userApi";   // 👈 FIXED IMPORT

const AddAnalystManager = ({ isOpen, onClose, editData }) => {
    const isEdit = Boolean(editData);

    // Convert backend response → form-friendly values
    const convertEditData = (u) => {
        if (!u) return null;

        return {
            name: u.name || "",
            role: u.analystRole || "",
            salary: u.monthlySalary || "",
            hoursMonth: u.hoursPerMonth || 160,
            hoursDay: u.hoursPerDay || 8,
            bonus: u.bonus || 0,
            date: u.hiringDate ? u.hiringDate.substring(0, 10) : "",
            notes: u.notes || "",

            // Login fields
            isLogin: u.isLogin || false,
            email: u.email || "",
            password: ""
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
            hoursMonth: 160,
            hoursDay: 8,
            bonus: 0,
            date: "",
            notes: "",

            isLogin: false,
            email: "",
            password: ""
        }
    });

    // Reset form when editing
    useEffect(() => {
        if (editData) {
            reset(convertEditData(editData));
        }
    }, [editData, reset]);

    // Auto-cost calculations
    const salary = watch("salary") || 0;
    const hoursMonth = watch("hoursMonth") || 1;
    const hoursDay = watch("hoursDay") || 1;
    const isLogin = watch("isLogin");

    const costHour = (salary / hoursMonth).toFixed(1);
    const costDay = (costHour * hoursDay).toFixed(0);

    const [createAnalyst] = useCreateAnalystMutation();
    const [updateAnalyst] = useUpdateAnalystMutation();

    // Submit handler
    const onSubmit = async (data) => {
        const payload = {
            name: data.name,

            // Backend requires:
            role: "analyst",
            analystRole: data.role,        // human job title

            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),
            bonus: Number(data.bonus),
            hiringDate: data.date,
            notes: data.notes,

            costPerHour: Number(costHour),
            costPerDay: Number(costDay),

            // Login fields
            isLogin: Boolean(data.isLogin),
            email: data.isLogin ? data.email : undefined,
            password: data.isLogin ? data.password : undefined
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
                        <div className={styles.field}>
                            <label>Nume</label>
                            <input {...register("name")} placeholder="ex: Andrei Popescu" />
                        </div>

                        {/* SALARY */}
                        <div className={styles.field}>
                            <label>Salariu lunar (RON)</label>
                            <input type="number" {...register("salary")} />
                        </div>

                        {/* ROLE */}
                        <div className={styles.field}>
                            <label>Funcție</label>
                            <select {...register("role")}>
                                <option value="">Selectează funcția</option>
                                <option>Head of Investigations</option>
                                <option>Intelligence Analyst</option>
                                <option>HUMINT Detective</option>
                            </select>
                        </div>

                        {/* LOGIN CHECKBOX */}
                        <div className={styles.fieldFull}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" {...register("isLogin")} />
                                <span>Este cont de login</span>
                            </label>
                        </div>

                        {/* LOGIN FIELDS */}
                        {isLogin && (
                            <div className={styles.loginBox}>
                                <div className={styles.field}>
                                    <label>Email</label>
                                    <input {...register("email")} placeholder="emailul analistului" />
                                </div>

                                <div className={styles.field}>
                                    <label>Parolă</label>
                                    <input type="password" {...register("password")} placeholder="••••••" />
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
                        <div className={styles.field}>
                            <label>Data angajării</label>
                            <input type="date" {...register("date")} />
                        </div>

                        {/* BONUS */}
                        <div className={styles.fieldSmall}>
                            <label>Bonus (%)</label>
                            <input type="number" {...register("bonus")} />
                        </div>

                        {/* COSTS AUTO */}
                        <div className={styles.fieldCosts}>
                            <label>Costuri (automat)</label>
                            <div className={styles.costGrid}>
                                <input readOnly value={costHour} />
                                <input readOnly value={costDay} />
                            </div>
                        </div>

                        {/* NOTES */}
                        <div className={styles.notesBox}>
                            <label>Note</label>
                            <textarea {...register("notes")} placeholder="Observații..." />
                        </div>

                    </div>

                    <div className={styles.buttons}>
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

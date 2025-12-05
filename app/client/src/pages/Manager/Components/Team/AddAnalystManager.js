import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./AddAnalystManager.module.css";

import {
    useCreateUserMutation,
    useUpdateUserMutation,
} from "../../../../services/userApi";

const AddAnalystManager = ({ isOpen, onClose, editData }) => {
    const isEdit = Boolean(editData);

    // Convert backend → form-friendly
    const convertEditData = (u) => {
        if (!u) return null;

        return {
            name: u.name || "",
            userRole: u.role || "employee",

            analystRole: u.analystRole || "",
            salary: u.monthlySalary || "",
            hoursMonth: u.hoursPerMonth || 160,
            hoursDay: u.hoursPerDay || 8,
            bonus: u.bonus || 0,
            date: u.hiringDate ? u.hiringDate.substring(0, 10) : "",
            notes: u.notes || "",

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
            userRole: "employee",
            analystRole: "",
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

    // Reset on edit change
    useEffect(() => {
        if (editData) {
            reset(convertEditData(editData));
        }
    }, [editData]);

    // WATCH FIELDS
    const role = watch("userRole");
    const salary = watch("salary") || 0;
    const hoursMonth = watch("hoursMonth") || 1;
    const hoursDay = watch("hoursDay") || 1;
    const isLogin = watch("isLogin");

    // AUTO COST CALC
    const costHour = (salary / hoursMonth).toFixed(1);
    const costDay = (costHour * hoursDay).toFixed(0);

    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();

    // SUBMIT DATA
    const onSubmit = async (data) => {
        const payload = {
            name: data.name,
            role: data.userRole,

            // ANALYST FIELDS only when role = analyst
            analystRole: data.userRole === "analyst" ? data.analystRole : undefined,
            monthlySalary: data.userRole === "analyst" ? Number(data.salary) : undefined,
            hoursPerMonth: data.userRole === "analyst" ? Number(data.hoursMonth) : undefined,
            hoursPerDay: data.userRole === "analyst" ? Number(data.hoursDay) : undefined,
            bonus: data.userRole === "analyst" ? Number(data.bonus) : undefined,
            hiringDate: data.userRole === "analyst" ? data.date : undefined,
            notes: data.userRole === "analyst" ? data.notes : undefined,

            // AUTO COSTS
            costPerHour: data.userRole === "analyst" ? Number(costHour) : undefined,
            costPerDay: data.userRole === "analyst" ? Number(costDay) : undefined,

            // LOGIN USERS
            isLogin: data.isLogin,
            email: data.isLogin ? data.email : undefined,
            password: data.isLogin ? data.password : undefined
        };

        try {
            if (isEdit) {
                await updateUser({ id: editData._id, data: payload }).unwrap();
                toast("Utilizator actualizat!");
            } else {
                await createUser(payload).unwrap();
                toast("Utilizator creat!");
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
                        {isEdit ? "Editează utilizator" : "Adaugă utilizator"}
                    </h3>

                    {/* USER NAME */}
                    <div className={styles.field}>
                        <label>Nume</label>
                        <input {...register("name")} placeholder="ex: Andrei Popescu" />
                    </div>

                    {/* ROLE SELECT */}
                    <div className={styles.field}>
                        <label>Rol utilizator</label>
                        <select {...register("userRole")}>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="sales">Sales</option>
                            <option value="analyst">Analyst</option>
                            <option value="user">Employee</option>
                        </select>
                    </div>

                    {/* SHOW LOGIN ONLY IF MANAGER WANTS */}
                    <div className={styles.fieldFull}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" {...register("isLogin")} />
                            <span>Creează cont de login</span>
                        </label>
                    </div>

                    {isLogin && (
                        <div className={styles.loginBox}>
                            <div className={styles.field}>
                                <label>Email</label>
                                <input {...register("email")} />
                            </div>

                            <div className={styles.field}>
                                <label>Parolă</label>
                                <input type="password" {...register("password")} />
                            </div>
                        </div>
                    )}

                    {/* ANALYST ONLY FIELDS */}
                    {role === "analyst" && (
                        <>
                            <div className={styles.field}>
                                <label>Funcție analist</label>
                                <select {...register("analystRole")}>
                                    <option value="">Selectează</option>
                                    <option>Head of Investigations</option>
                                    <option>Intelligence Analyst</option>
                                    <option>HUMINT Detective</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label>Salariu lunar (RON)</label>
                                <input type="number" {...register("salary")} />
                            </div>

                            <div className={styles.fieldSmall}>
                                <label>Ore/lună</label>
                                <input type="number" {...register("hoursMonth")} />
                            </div>

                            <div className={styles.fieldSmall}>
                                <label>Ore/zi</label>
                                <input type="number" {...register("hoursDay")} />
                            </div>

                            <div className={styles.field}>
                                <label>Data angajării</label>
                                <input type="date" {...register("date")} />
                            </div>

                            <div className={styles.fieldSmall}>
                                <label>Bonus (%)</label>
                                <input type="number" {...register("bonus")} />
                            </div>

                            <div className={styles.fieldCosts}>
                                <label>Costuri automat</label>
                                <div className={styles.costGrid}>
                                    <input readOnly value={costHour} />
                                    <input readOnly value={costDay} />
                                </div>
                            </div>

                            <div className={styles.notesBox}>
                                <label>Note</label>
                                <textarea {...register("notes")} />
                            </div>
                        </>
                    )}

                    {/* ACTION BUTTONS */}
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

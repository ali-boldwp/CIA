import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddEmployeeModal.module.css";
import { toast } from "react-toastify";

import {
    useCreateUserMutation,
    useUpdateUserMutation,
} from "../../../../../services/userApi";

import { DEPARTMENT_CONFIG } from "../utils/departmentConfig";

const sectionNames = {
    management: "Management",
    investigatii: "Investigații",
    auxiliar: "Personal auxiliar",
    vanzari: "Vânzări",
    logistica: "Logistică",
    tehnica: "Tehnică",
};

const AddEmployeeModal = ({ isOpen, sectionKey, editData, onClose }) => {
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const submitting = isCreating || isUpdating;
    const sectionLabel = sectionNames[sectionKey] || "Angajat";

    const departmentConfig = DEPARTMENT_CONFIG[sectionKey] || {
        role: "",
        functions: [],
    };


    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            functionName: "",
            salary: "",
            hoursMonth: "",
            hoursDay: "",
            bonus: "",
            date: "",
            remember: false,
            rememberUser: "",
            rememberPassword: "",
            color: "#ff0000",
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                functionName: editData.functionName,
                salary: editData.monthlySalary,
                hoursMonth: editData.hoursPerMonth,
                hoursDay: editData.hoursPerDay,
                bonus: editData.bonus,
                date: editData.hiringDate?.slice(0, 10),
               color: editData.color || "#ff0000",
            });
        } else {
            reset();
        }
    }, [editData, reset]);

    if (!isOpen) return null;

    // Auto cost
    const salary = watch("salary");
    const hoursMonth = watch("hoursMonth");
    const hoursDay = watch("hoursDay");
    const rememberChecked = watch("remember");

    const costHour =
        salary && hoursMonth
            ? (Number(salary) / Number(hoursMonth)).toFixed(1)
            : "0";

    const costDay = (Number(costHour) * Number(hoursDay || 0)).toFixed(0);

    // SUBMIT
    const onSubmit = async (data) => {
        const payload = {
            name: data.name,

            // 🔒 SYSTEM ROLE (auto)
            role: departmentConfig.role,

            // ✅ HR FUNCTION
            functionName: data.functionName,

            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),
            bonus: Number(data.bonus),
            hiringDate: data.date,

            isLogin: data.remember,
            email: data.remember ? data.rememberUser : undefined,
            password: data.remember ? data.rememberPassword : undefined,

            color:
                sectionKey === "investigatii" && data.remember
                    ? data.color
                    : undefined,
        };

        const actionPromise = editData
            ? updateUser({ id: editData._id, data: payload }).unwrap()
            : createUser(payload).unwrap();

        try {
            await toast.promise(actionPromise, {
                pending: editData
                    ? "Se actualizează angajatul..."
                    : "Se salvează angajatul...",
                success: editData
                    ? "Angajat actualizat!"
                    : "Angajat salvat!",
                error: {
                    render({ data }) {
                        return data?.data?.message || "Eroare salvare";
                    },
                },
            });

            onClose();
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button
                    type="button"
                    className={styles.modalClose}
                    onClick={onClose}
                >
                    ✕
                </button>

                <form
                    className={styles.formContainer}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h3 className={styles.formTitle}>
                        Adaugă angajat – {sectionLabel}
                    </h3>

                    <p className={styles.formSubtitle}>
                        Completează câmpurile. Costurile se calculează automat.
                    </p>

                    <div className={styles.formGrid}>
                        {/* NUME */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Nume</label>
                            <input
                                {...register("name", {
                                    required: "Numele este obligatoriu",
                                })}
                            />
                            {errors.name && (
                                <p className={styles.error}>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* SALARIU */}
                        <div
                            className={`${styles.field} ${styles.fieldRightWide}`}
                        >
                            <label>Salariu lunar</label>
                            <input
                                type="number"
                                min="0"
                                {...register("salary", { required: true })}
                            />
                        </div>

                        {/* FUNCTION NAME (🔥 NEW) */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Funcție</label>
                            <select
                                {...register("functionName", {
                                    required: "Funcția este obligatorie",
                                })}
                            >
                                <option value="">
                                    Selectează funcția
                                </option>
                                {departmentConfig.functions.map((fn) => (
                                    <option key={fn} value={fn}>
                                        {fn}
                                    </option>
                                ))}

                            </select>
                            {errors.functionName && (
                                <p className={styles.error}>
                                    {errors.functionName.message}
                                </p>
                            )}
                        </div>

                        {/* ORE/LUNĂ */}
                        <div className={styles.fieldSmall}>
                            <label>Ore/lună</label>
                            <input
                                type="number"
                                {...register("hoursMonth", { required: true })}
                            />
                        </div>

                        {/* ORE/ZI */}
                        <div className={styles.fieldSmall}>
                            <label>Ore/zi</label>
                            <input
                                type="number"
                                {...register("hoursDay", { required: true })}
                            />
                        </div>

                        {/* DATA */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Data angajării</label>
                            <input
                                type="date"
                                {...register("date", { required: true })}
                            />
                        </div>

                        {/* BONUS */}
                        <div className={styles.fieldSmall}>
                            <label>Bonus lunar</label>
                            <input type="number" {...register("bonus")} />
                        </div>

                        {/* COST */}
                        <div className={`${styles.field} ${styles.colorFieldSmall}`}>
                            <label>Costuri</label>
                            <div className={styles.costGrid}>
                                <input value={costHour} disabled />
                                <input value={costDay} disabled />
                            </div>
                        </div>

                        {/* LOGIN */}
                        {!editData && (
                            <>
                                <div
                                    className={`${styles.fieldFull} ${styles.checkboxRow}`}
                                >
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            {...register("remember")}
                                        />
                                        Creează cont
                                    </label>
                                </div>

                                {rememberChecked && (
                                    <div className={`${styles.fieldLeft} ${styles.loginRow}`}>
                                        <div className={styles.loginGrid}>
                                            {/* USER */}
                                            <div className={styles.field}>
                                                <label>User</label>
                                                <input
                                                    placeholder="User"
                                                    {...register("rememberUser", {
                                                        validate: (value) =>
                                                            !rememberChecked ||
                                                            value.trim() !== "" ||
                                                            "Userul este obligatoriu",
                                                    })}
                                                />
                                            </div>

                                            {/* PASSWORD */}
                                            <div className={styles.field}>
                                                <label>Parolă</label>
                                                <input
                                                    type="password"
                                                    placeholder="Parolă"
                                                    {...register("rememberPassword", {
                                                        validate: (value) =>
                                                            !rememberChecked ||
                                                            value.trim() !== "" ||
                                                            "Parola este obligatorie",
                                                    })}
                                                />
                                            </div>

                                            {/* 🔥 COLOR PICKER — ONLY FOR INVESTIGATII */}
                                            {sectionKey === "investigatii" && (
                                                <div className={`${styles.field} ${styles.colorFieldSmall}`}>
                                                    <label>Culoare avatar</label>
                                                    <input
                                                        type="color"
                                                        className={styles.colorSmallBox}
                                                        {...register("color")}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </>
                        )}
                    </div>

                    <div className={styles.buttons}>
                        <button
                            className={styles.resetBtn}
                            type="button"
                            onClick={() => reset()}
                            disabled={submitting}
                        >
                            Resetează
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={submitting}>
                            {submitting
                                ? "Se salvează..."
                                : editData
                                    ? "Actualizează"
                                    : "Salvează"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;

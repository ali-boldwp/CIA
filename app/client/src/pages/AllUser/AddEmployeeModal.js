import React from "react";
import { useForm } from "react-hook-form";
import styles from "./AddEmployeeModal.module.css";

const sectionNames = {
    management: "Management",
    investigatii: "Investigații",
    auxiliar: "Personal auxiliar",
};

const AddEmployeeModal = ({ isOpen, sectionKey, onClose }) => {
    const sectionLabel = sectionNames[sectionKey] || "Angajat";

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            role: "",
            salary: "",
            hoursMonth: 160,
            hoursDay: 8,
            bonus: "",
            date: "",
            remember: false,
            rememberUser: "",
            rememberPassword: "",
        },
    });

    // agar modal closed ho to render hi mat karo
    if (!isOpen) return null;

    // auto-cost
    const salary = watch("salary");
    const hoursMonth = watch("hoursMonth");
    const hoursDay = watch("hoursDay");
    const rememberChecked = watch("remember");

    const costHour =
        salary && hoursMonth ? (Number(salary) / Number(hoursMonth)).toFixed(1) : 0;
    const costDay = (Number(costHour) * Number(hoursDay || 0)).toFixed(0);

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            role: data.role,
            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),
            bonus: Number(data.bonus),
            hiringDate: data.date,
            remember: data.remember,
            costPerHour: Number(costHour),
            costPerDay: Number(costDay),
            rememberUser: data.rememberUser || "",
            rememberPassword: data.rememberPassword || "",
        };

        console.log("EMPLOYEE FORM PAYLOAD:", payload);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                {/* CLOSE BTN */}
                <button
                    type="button"
                    className={styles.modalClose}
                    onClick={onClose}
                >
                    ✕
                </button>

                <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
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
                                placeholder="ex: Iulia Barbu"
                                {...register("name", {
                                    required: "Numele este obligatoriu",
                                })}
                            />
                            {errors.name && (
                                <p className={styles.error}>{errors.name.message}</p>
                            )}
                        </div>

                        {/* SALARIU */}
                        <div className={`${styles.field} ${styles.fieldRightWide}`}>
                            <label>Salariu lunăr</label>
                            <input
                                type="number"
                                {...register("salary", {
                                    required: "Salariul este obligatoriu",
                                    min: {
                                        value: 1,
                                        message:
                                            "Salariul trebuie să fie mai mare decât 0",
                                    },
                                })}
                            />
                            {errors.salary && (
                                <p className={styles.error}>{errors.salary.message}</p>
                            )}
                        </div>

                        {/* FUNCȚIE (employee roles) */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Funcție</label>
                            <select
                                {...register("role", {
                                    required: "Funcția este obligatorie",
                                })}
                            >
                                <option value="">Selectează funcția</option>
                                <option value="ceo">CEO</option>
                                <option value="analist">Analist</option>
                                <option value="manager">Manager</option>
                                <option value="alt">Alt rol</option>
                            </select>
                            {errors.role && (
                                <p className={styles.error}>{errors.role.message}</p>
                            )}
                        </div>

                        {/* ORE/LUNĂ */}
                        <div className={styles.fieldSmall}>
                            <label>Ore/lună</label>
                            <input
                                type="number"
                                {...register("hoursMonth", {
                                    required: "Ore/lună este obligatoriu",
                                    min: {
                                        value: 1,
                                        message:
                                            "Orele pe lună trebuie să fie mai mari decât 0",
                                    },
                                })}
                            />
                            {errors.hoursMonth && (
                                <p className={styles.error}>
                                    {errors.hoursMonth.message}
                                </p>
                            )}
                        </div>

                        {/* ORE/ZI */}
                        <div className={styles.fieldSmall}>
                            <label>Ore/zi</label>
                            <input
                                type="number"
                                {...register("hoursDay", {
                                    required: "Ore/zi este obligatoriu",
                                    min: {
                                        value: 1,
                                        message:
                                            "Orele pe zi trebuie să fie mai mari decât 0",
                                    },
                                })}
                            />
                            {errors.hoursDay && (
                                <p className={styles.error}>
                                    {errors.hoursDay.message}
                                </p>
                            )}
                        </div>

                        {/* DATA ANGAJĂRII */}
                        <div className={`${styles.field} ${styles.fieldLeft}`}>
                            <label>Data angajării</label>
                            <input
                                type="date"
                                {...register("date", {
                                    required: "Data angajării este obligatorie",
                                })}
                            />
                            {errors.date && (
                                <p className={styles.error}>{errors.date.message}</p>
                            )}
                        </div>

                        {/* BONUS – optional */}
                        <div className={styles.fieldSmall}>
                            <label>Bonus lunar </label>
                            <input type="number" {...register("bonus")} />
                        </div>

                        {/* COSTURI (automat) – DISABLED fields */}
                        <div className={styles.fieldCosts}>
                            <label>Costuri</label>
                            <div className={styles.costGrid}>
                                <input
                                    value={costHour}
                                    readOnly
                                    disabled
                                    className={styles.costInput}
                                />
                                <input
                                    value={costDay}
                                    readOnly
                                    disabled
                                    className={styles.costInput}
                                />
                            </div>
                        </div>

                        {/* CHECKBOX */}
                        <div className={`${styles.fieldFull} ${styles.checkboxRow}`}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" {...register("remember")} />
                                <span>este logat</span>
                            </label>
                        </div>

                        {/* USER & PASSWORD jab checkbox tick ho */}
                        {rememberChecked && (
                            <div className={`${styles.fieldLeft} ${styles.loginRow}`}>
                                <div className={styles.loginGrid}>
                                    <div className={styles.field}>
                                        <label>User</label>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            {...register("rememberUser", {
                                                validate: (value) =>
                                                    !rememberChecked ||
                                                    value.trim() !== "" ||
                                                    "Userul este obligatoriu",
                                            })}
                                        />
                                        {errors.rememberUser && (
                                            <p className={styles.error}>
                                                {errors.rememberUser.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.field}>
                                        <label>Parolă</label>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            {...register("rememberPassword", {
                                                validate: (value) =>
                                                    !rememberChecked ||
                                                    value.trim() !== "" ||
                                                    "Parola este obligatorie",
                                            })}
                                        />
                                        {errors.rememberPassword && (
                                            <p className={styles.error}>
                                                {errors.rememberPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => reset()}
                        >
                            Resetează
                        </button>

                        <button className={styles.saveBtn} type="submit">
                            Salvează angajat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;

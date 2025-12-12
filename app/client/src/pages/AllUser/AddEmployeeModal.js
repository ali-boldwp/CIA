import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddEmployeeModal.module.css";
import { useCreateUserMutation, useUpdateUserMutation } from "../../services/userApi";

const sectionNames = {
    management: "Management",
    investigatii: "Investigații",
    auxiliar: "Personal auxiliar",
};

const AddEmployeeModal = ({ isOpen, sectionKey, editData, onClose }) => {
    const [ createUser ] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();

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
            hoursMonth: "",
            hoursDay: "",
            bonus: "",
            date: "",
            remember: false,
            rememberUser: "",
            rememberPassword: "",
            avatarDotColor: "#ff0000", // 🔥 default color
        },
    });

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                role: editData.role,
                analystRole: editData.analystRole,
                salary: editData.monthlySalary,
                hoursMonth: editData.hoursPerMonth,
                hoursDay: editData.hoursPerDay,
                bonus: editData.bonus,
                date: editData.hiringDate?.slice(0, 10),
                remember: editData.isLogin,
                rememberUser: editData.email,
                avatarDotColor: editData.avatarDotColor || "#ff0000",
            });
        } else {
            reset({
                name: "",
                role: "",
                salary: "",
                hoursMonth: "",
                hoursDay: "",
                bonus: "",
                date: "",
                remember: false,
                rememberUser: "",
                rememberPassword: "",
                avatarDotColor: "#ff0000",
            });
        }
    }, [editData, reset]);

    // agar modal closed ho to render hi mat karo
    if (!isOpen) return null;

    // auto-cost
    const salary = watch("salary");
    const hoursMonth = watch("hoursMonth");
    const hoursDay = watch("hoursDay");
    const rememberChecked = watch("remember");
    const selectedRole = watch("role");

    const costHour =
        salary && hoursMonth ? (Number(salary) / Number(hoursMonth)).toFixed(1) : 0;
    const costDay = (Number(costHour) * Number(hoursDay || 0)).toFixed(0);

    const onSubmit = async (data) => {
        const payload = {
            name: data.name,
            role: data.role.toLowerCase(),

            // For analysts
            analystRole: data.role === "analyst" ? data.analystRole : undefined,

            monthlySalary: Number(data.salary),
            hoursPerMonth: Number(data.hoursMonth),
            hoursPerDay: Number(data.hoursDay),
            bonus: Number(data.bonus),
            hiringDate: data.date,

            isLogin: data.remember,
            email: data.remember ? data.rememberUser : undefined,
            password: data.remember ? data.rememberPassword : undefined,

            // 🔥 Avatar color – only for Investigations + logged in
            avatarDotColor:
                sectionKey === "investigatii" && data.remember
                    ? data.avatarDotColor
                    : undefined,
        };

        try {
            if (editData) {
                await updateUser({ id: editData._id, data: payload }).unwrap();
            } else {
                await createUser(payload).unwrap();
            }

            onClose();
            reset();
        } catch (err) {
            alert(err?.data?.message || "Error saving user");
        }
    };

    const roleOptions = {
        management: [
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
        ],

        investigatii: [
            { value: "analyst", label: "Intelligence Analyst", analystRole: "Intelligence Analyst" },
            { value: "analyst", label: "HUMINT Detective", analystRole: "HUMINT Detective" },
            { value: "analyst", label: "Head of Investigations", analystRole: "Head of Investigations" },
        ],

        auxiliar: [
            { value: "sales", label: "Sales" },
            { value: "user", label: "User / Angajat simplu" },
        ],
    };

    // 🔥 If editing → show correct role group automatically
    let options;

    if (editData) {
        if (["admin", "manager"].includes(editData.role)) {
            options = roleOptions.management;
        } else if (editData.role === "analyst") {
            options = roleOptions.investigatii;
        } else {
            options = roleOptions.auxiliar;
        }
    } else {
        // Normal (adding new employee)
        options = roleOptions[sectionKey] || [];
    }

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
                                className="no-spin "
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "Minus") {
                                        e.preventDefault();
                                    }
                                }}
                                type="number"
                                {...register("salary", {
                                    required: "Salariul este obligatoriu",
                                    min: {
                                        value: 1,
                                        message: "Salariul trebuie să fie mai mare decât 0",
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
                                {...register("role", { required: "Funcția este obligatorie" })}
                            >
                                <option value="">Selectează funcția</option>

                                {options.map((opt, idx) => (
                                    <option key={idx} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {/* Analyst Role Dropdown (only when role = 'analyst') */}
                            {selectedRole === "analyst" && (
                                <div className={`${styles.field} ${styles.fieldLeft}`}>
                                    <label>Rol analist</label>
                                    <select {...register("analystRole", { required: true })}>
                                        <option value="">Selectează rolul analistului</option>
                                        <option value="Head of Investigations">Head of Investigations</option>
                                        <option value="Intelligence Analyst">Intelligence Analyst</option>
                                        <option value="HUMINT Detective">HUMINT Detective</option>
                                    </select>
                                    {errors.analystRole && (
                                        <p className={styles.error}>Rolul analist este obligatoriu</p>
                                    )}
                                </div>
                            )}

                            {errors.role && (
                                <p className={styles.error}>{errors.role.message}</p>
                            )}
                        </div>

                        {/* ORE/LUNĂ */}
                        <div className={styles.fieldSmall}>
                            <label>Ore/lună</label>
                            <input
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "Minus") {
                                        e.preventDefault();
                                    }
                                }}
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
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "Minus") {
                                        e.preventDefault();
                                    }
                                }}
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
                            <input
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "Minus") {
                                        e.preventDefault();
                                    }
                                }}
                                type="number"
                                {...register("bonus")}
                            />
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

                        {/* LOGIN + EXTRA FIELDS – only when creating new */}
                        {!editData && (
                            <>
                                <div className={`${styles.fieldFull} ${styles.checkboxRow}`}>
                                    <label className={styles.checkboxLabel}>
                                        <input type="checkbox" {...register("remember")} />
                                        <span>este logat</span>
                                    </label>
                                </div>

                                {/* USERNAME, PASSWORD & (for investigatii) COLOR */}
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

                                            {/* 🔥 Color picker – only for Investigations section */}
                                            {sectionKey === "investigatii" && (
                                                <div className={`${styles.field} ${styles.colorFieldSmall}`}>
                                                    <label>Culoare avatar</label>

                                                    <input
                                                        type="color"
                                                        className={styles.colorSmallBox}
                                                        {...register("avatarDotColor")}
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
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => reset()}
                        >
                            Resetează
                        </button>

                        <button className={styles.saveBtn}>
                            {editData ? "Actualizează" : "Salvează"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;

import React from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../../services/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../../assets/image 1.svg';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const response = await login(formData).unwrap();
            const loggedUser = response.data.user;
            const token = response.data.accessToken;

            dispatch(setUser(loggedUser));
            localStorage.setItem("user", JSON.stringify(loggedUser));
            localStorage.setItem("token", token);

            toast.success("Autentificare reușită");

            const role = loggedUser.role;

            if (role === "sales" || role === "user") navigate("/dashboard/sales");
            else if (role === "analyst") navigate("/dashboard/analyst");
            else if (role === "manager" || role === "admin") navigate("/manager/dashboard");
            else navigate("/");

        } catch (err) {
            console.error("LOGIN ERROR:", err);
        }
    };

    return (
            <div className="login-page">
                <div className="mainLog">
                    <div className="login-card">

                        {/* Logo */}
                        <img src={logo} alt="Logo" className="login-logo" />

                        <h2 className="login-title">Autentificare</h2>
                        <p className="login-subtitle">
                            Introdu datele contului tău pentru a continua
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

                            {/* Email */}
                            <label className="login-label">Utilizator</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="email@firma.ro"
                                    {...register("email", { required: "Email obligatoriu" })}
                                />
                                <span className="input-icon">👤</span>
                            </div>
                            {errors.email && <p className="error">{errors.email.message}</p>}

                            {/* Password */}
                            <label className="login-label">Parola</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="•••••••"
                                    {...register("password", { required: "Parola obligatorie" })}
                                />
                                <span className="input-icon">🔒</span>
                            </div>
                            {errors.password && <p className="error">{errors.password.message}</p>}

                            {/* Remember + Forgot */}
                            <div className="login-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    Ține-mă minte
                                </label>
                                <a href="#" className="forgot-password">Ai uitat parola?</a>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="login-btn" disabled={isLoading}>
                                {isLoading ? "Se conectează..." : "Conectează-te"}
                            </button>

                            {/* Divider line */}
                            <hr className="login-divider" />

                            {error && (
                                <p className="error">
                                    {error?.data?.message || "Autentificare eșuată"}
                                </p>
                            )}
                        </form>

                        <p className="footer-text">
                            Prin autentificare, accepți Termenii și Politica de confidențialitate.
                        </p>
                    </div>
                </div>

                <p className="bottom-footer">
                    Corporate Intelligence Agency — Project Management Platform
                </p>
            </div>

    );
};

export default Login;

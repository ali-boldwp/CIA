import { useState, useEffect } from "react";
import "./profile.css";
import {
    useGetMeQuery,
    useUpdateMyProfileMutation,
} from "../../services/userApi";
import {toast} from "react-toastify";

const Profile = () => {
    const { data, isLoading: isFetching } = useGetMeQuery();
    const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    // ✅ Auto fill logged-in user data
    useEffect(() => {
        if (data?.data) {
            setName(data.data.name);
            setEmail(data.data.email);
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("❌ Parolele nu se potrivesc");
            return;
        }

        try {
            await updateProfile({
                name,
                email,
                password,
                confirmPassword,
            }).unwrap();

            toast.success("Setările au fost salvate cu succes");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error(err?.data?.message || "❌ A apărut o eroare");
        }
    };


    return (
        <>
            <div
                className="projects-header"
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                }}
            >
                <h3>Setările contului tău</h3>
            </div>

            <div className="settings-wrapper">
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Numele tău</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <label>Adresa ta de email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <label>Parolă</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Parolă"
                        />
                    </div>

                    <div className="form-row">
                        <label>Confirmă parola</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmă parola"
                        />
                    </div>

                    <button type="submit" className="save-btn" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Salvează modificările"}
                    </button>

                </form>
            </div>
        </>
    );
};

export default Profile;

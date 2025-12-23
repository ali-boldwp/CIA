import { useState } from "react";
import "./profile.css";
import {Link} from "react-router-dom";

const Profile = () => {
    const [name, setName] = useState("Shoaib Khaliq");
    const [email, setEmail] = useState("shoaibkhaliq238@gmail.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return;
        }

        setPassword("");
        setConfirmPassword("");
    };

    return (
        <>

            <div className="projects-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div>
                    <h3>Setările contului tău</h3>

                </div>
            </div>

        <div className="settings-wrapper">

            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Numele tău</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label>Adresa ta de email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label>Parolă</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank if you don’t want to change it"
                    />
                </div>

                <div className="form-row">
                    <label>Confirmă parola</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="save-btn">
                    Save updates
                </button>


            </form>
        </div>
        </>
    );
};

export default Profile;

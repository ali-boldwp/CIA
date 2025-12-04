import "./HumintList.css"
import styles from "../Humint/Header.module.css";
import React from "react";
import {useNavigate} from "react-router-dom";

const HumintList=()=>{
    const navigate = useNavigate();
    const goBack = () => {
        navigate("/manager/dashboard");
    };
    return(
    <div className="HumintMain">
        <div className="headerHumint">
            <div className="boxHumint">

                <button className="backBtnHumint" onClick={goBack}>
                    <span className="backBtnIconHumint">⟵</span>
                    Înapoi la Dashboard
                </button>

                <h2 className={styles.title}>Solicitări HUMINT — De aprobat</h2>

            </div>
        </div>
    </div>
    );
}
export default HumintList;
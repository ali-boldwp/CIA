import styles from "./style.module.css";

import moment from 'moment';
import React from "react";

const Header = ({ data }) => {

    let status = data.status;

    /*if ( status == 'approved' ) {

        status = "În lucru";

    }*/

    return (
        <div className={ styles.wraper }>
            <div className="flex-column text-white">
                <button className="task-btn italic" style={{ maxWidth: '150px', fontSize: '12px', justifyContent: "center", color: "#1E293B" }}>TASK INDIVIDUAL</button>
            </div>
            <h3> Proiect: <span>{ data?.projectName }</span> </h3>
            <div>
                <p> Persoană: [Nume complet] • Creat la: { moment( data.createdAt ).format('YYYY-MM-DD HH:mm') } • Deadline: { data?.deadline } </p>
            </div>
        </div>
    )

}

export default Header;
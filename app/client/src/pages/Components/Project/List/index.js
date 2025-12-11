import Item from "./Item";
import {Link} from "react-router-dom";

import "./style.css";

const ProjectList = ({ data, header = false }) => {

    console.log( data )

    return (
        <div className="main">

            { header && <div className="projects-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div>
                    <h3>Proiecte active în derulare <span className="count">{ data.length } proiecte</span></h3>

                </div>
                <Link to={ "/project/all" } style={{ fontSize: '14px' }} > View All Projects </Link>
            </div> }

            <div className="responsive-table-wrapper">
                <div className="projects-wrapper">
                    <div className="projects-table-header">
                        <span>Nume proiect / Responsabili & echipă</span>
                        <span>Deadline</span>
                        <span>Progres</span>
                        <span>Status HUMINT</span>
                        <span style={{ textAlign: "right !important" }}>Acțiuni</span>
                    </div>
                    <div className="projects-list">
                        { data.map((project, index) => (
                            <Item data={ project } key={ index }/>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );

}

export default ProjectList;
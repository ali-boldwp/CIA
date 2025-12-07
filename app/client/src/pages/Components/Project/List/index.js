import Item from "./Item";

const ProjectList = ({ data }) => {

    console.log( data )

    return (
        <div className="main">

            <div className="projects-header">
                <h3>Proiecte active în derulare</h3>
                <span className="count">{ data.length } proiecte</span>
            </div>

            <div className="responsive-table-wrapper">
                <div className="projects-wrapper">
                    <div className="projects-table-header">
                        <span>Nume proiect / Responsabili & echipă</span>
                        <span>Deadline</span>
                        <span>Progres</span>
                        <span>Status HUMINT</span>
                        <span>Acțiuni</span>
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
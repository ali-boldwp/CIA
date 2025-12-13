import ProjectRequestListComponent from "../../../../../Components/ProjectRequestList";

import Layout from "../../../../../../layouts";
import Header from "../../../../Components/Header";

const RequestList = () => {

    return (
        <Layout
            loading={ false }
            header={
                {
                    search: false,
                    back: true,
                    title: "Solicitări proiect — De revizuit",
                    content: <Header createProject={ true } />
                }
            }
            content={ <ProjectRequestListComponent /> }
        />

    )
}

export default RequestList;
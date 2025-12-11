import ProjectRequestForm from "../../../../../Components/ProjectRequestForm";

import Layout from "../../../../../../layouts";
import Header from "../../../../Components/Header";

const RequestProject = () => {

   return (
       <Layout
           loading={ false }
           header={
               {
                   search: false,
                   back: true,
                   title: "Solicitare noua de proiect",
                   content: <Header createProject={ true } />
               }
           }
           content={ <ProjectRequestForm /> }
       />

   )
}

export default RequestProject;
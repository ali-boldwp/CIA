import Layout from "../../../../../../layouts"
import {useGetAnalystsQuery} from "../../../../../../services/userApi";
import {useGetRequestedProjectByIdQuery} from "../../../../../../services/projectApi";
import {useParams} from "react-router-dom";

import View from "./View";
import Header from "../../../../Components/Header"

const CreateProject = () => {

    const {id} = useParams();

    const { data, isLoading: dataIsLoading } = useGetAnalystsQuery();
    const {data: main, isLoading} = useGetRequestedProjectByIdQuery(id, {
        skip: !id,
    });

    return(
        <Layout
            loading={ dataIsLoading || isLoading }
            header={{
                back: true,
                search: false,
                title: "Creează proiect nou",
                content: <Header />
            }}
            content={
                <View
                    data={ data }
                    main={ main }
                />
            }
        />
    )

}

export default  CreateProject;
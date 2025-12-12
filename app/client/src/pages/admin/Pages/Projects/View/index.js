import Layout from "../../../../../layouts";
import {useGetCreateProjectByIdQuery} from "../../../../../services/projectApi";
import ProjectView from "../../../../Components/Project/View";
import {useParams} from "react-router-dom";
import Header from "../../../Components/Header";
import ProjectHeader from "../../../../Components/Project/Components/Header";

const View = () => {

    const { id } = useParams();

    const { data, isLoading } = useGetCreateProjectByIdQuery( id, {
        skip: !id,
    });

    return (
        <Layout
            loading={ isLoading }
            header={{
                search: false,
                back: true,
                title: <ProjectHeader data={ data?.data } />,
                content: <Header createProject={ false } />
            }}
            content={ <ProjectView data={ data } /> }
        />
    );

}

export default View;
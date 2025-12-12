import Layout from "../../../../../layouts"
import {useGetCreateProjectByIdQuery} from "../../../../../services/projectApi";
import {useParams} from "react-router-dom";
import Header from "../../../Components/Header";
import CostView from "./Cost";

import PrjectHeader from "../../../../Components/Project/Components/Header";

const Cost = () => {

    const { id } = useParams();

    const { data, isLoading, isError } = useGetCreateProjectByIdQuery( id );

    return (
        <Layout
            loading={ isLoading }
            header={
                {
                    search: false,
                    back: true,
                    title: <PrjectHeader data={ data } />,
                    content: <Header createProject={ false } />
                }
            }
            content={ <CostView data={ data }/> }
        />
    )

}

export default Cost;
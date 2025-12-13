import Layout from "../../../../../layouts";
import View from "./View";

import {useGetProjectsQuery} from "../../../../../services/projectApi";
import {useParams} from "react-router-dom";

import Header from "../../../Components/Header";

const Search = () => {

    const params = useParams();

    const { keyword } = useParams();

    // call RTK Query — include search param, and maybe paging if needed
    const { data, isLoading } = useGetProjectsQuery({
        search: keyword || "",
        limit: 10
        // optionally, page: 1, limit: 20
    });

    return (
        <Layout
            loading={ isLoading }
            header={{
                content: <Header />
            }}
            content={ <View data={ data } /> }
        />
    )

}

export default Search;
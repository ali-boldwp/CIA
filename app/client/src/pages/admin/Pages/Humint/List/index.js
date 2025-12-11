import HumintList from "../../../../Components/HumintList";

import Layout from "../../../../../layouts";
import Header from "../../../Components/Header";
import { useGetAllHumintsQuery } from "../../../../../services/humintApi";

const Humints = () => {

    const { data: data, isLoading } = useGetAllHumintsQuery();

    return (
        <>
            <Layout
                loading={ isLoading }
                header={
                    {
                        back: true,
                        search: false,
                        title: "Solicitări HUMINT — De aprobat",
                        content: <Header createProject={ false } />
                    }
                }
                content={ <HumintList data={ data } /> }
            />
        </>
    )

}

export  default Humints;
import Layout from "../../../../../layouts"
import HumentRequest from "../../../../Components/HumintRequest";
import {useParams} from "react-router-dom";
import {useGetClarificationsByHumintQuery, useGetHumintByIdQuery} from "../../../../../services/humintApi";
import {useGetAnalystsQuery} from "../../../../../services/userApi";

import Header from "../../../Components/Header"

const HumintView = () => {

    const { id } = useParams(); // HUMINT id

    const { data, isLoading } = useGetHumintByIdQuery(id);
    const { data: analystData, isLoading: analystIsLoading } = useGetAnalystsQuery();
    const {
        data: clarificationData,
        refetch: refetchClarifications,
    } = useGetClarificationsByHumintQuery(id);

    return (
        <Layout
            loading={ isLoading || analystIsLoading }
            header={{
                title: "Solicitare HUMINT — Aprobare manager",
                back: true,
                search: false,
                content: <Header/>
            }}
            content={
                <HumentRequest
                    data={ data }
                    analystData={ analystData }
                    clarificationData={ clarificationData }
                    refetchClarifications={ refetchClarifications }
                />
            }
        />
    )

}

export default HumintView;
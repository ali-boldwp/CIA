import Layout from "../../../../../layouts/Template"
import View from "./View";
import {useParams} from "react-router-dom";
import {useGetCategoryByIdQuery} from "../../../../../services/categoryApi";

const Template = () => {

    const { id: categoryId } = useParams();

    const { data, isLoading, refetch } = useGetCategoryByIdQuery(categoryId, {
        skip: !categoryId
    });


    return (
        <Layout
            loading={ isLoading }
            content={
                <View
                    data={data?.data}
                    categoryId={categoryId}
                    onChapterCreated={refetch}
                />

            }
        />
    )

}

export default Template;
import Layout from "../../../../layouts";
import Header from "../../Components/Header";
import View from "./View";
import { useGetCategoriesQuery } from "../../../../services/categoryApi";

const Categories = () => {
    const { data, isLoading, isFetching, isError } = useGetCategoriesQuery();


    const categories = data?.data || [];

    return (
        <Layout
            loading={isLoading || isFetching}
            header={{
                search: false,
                back: true,
                content: <Header />,
            }}
            content={
                <View
                    data={categories}
                    isError={isError}
                />
            }
        />
    );
};

export default Categories;

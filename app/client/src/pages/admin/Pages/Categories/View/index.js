import Layout from "../../../../../layouts/Template"
import CategoryView from "../../../../CategoryView";
import Header from "../../../Components/Header"

const View = () => {

    return (
        <Layout
            header={{
                search: false,
                back: true,
                content: <Header />,
            }}
            content={ <CategoryView/> }
        />
    );

}

export default View;
import Layout from "../../../../../layouts/Template"
import NewChapter from "./Page/index";
import Header from "../../../Components/Header"

const View = () => {

    return (
        <Layout
            header={{
                search: false,
                back: true,
                content: <Header />,
            }}
            content={ <NewChapter /> }
        />
    );

}

export default View;
import Layout from "../../../../../layouts/Template"
import Header from "../../../Components/Header"
import FoamFields from "./Components";

const View = () => {

    return (
        <Layout
            header={{
                search: false,
                back: true,
                content: <Header />,
            }}
            content={ <FoamFields/> }
        />
    );

}

export default View;
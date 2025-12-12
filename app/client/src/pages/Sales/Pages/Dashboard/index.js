import Layout from "../../../../layouts"
import Header from "../../Components/Header"

import View from "./View";

const Dashboard = () => {

    return (
        <Layout
            loading={ false }
            header={{
                content: <Header />
            }}
            content={ <View /> }
        />
    )

}

export default Dashboard;
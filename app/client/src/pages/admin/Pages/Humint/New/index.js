import Layout from "../../../../../layouts"
import View from "./View";
import Header from "../../../Components/Header";

const NewHumint = () => {

    return (
        <Layout
            loading={ false }
            header={{
                back: true,
                search: false,
                title: "Solicitare HUMINT",
                content: <Header />
            }}
            content={ <View /> }
        />
    )

}

export default NewHumint;
import Layout from "../../../../layouts"
import Header from "../../Components/Header"
import View from "./View"

const Categories = () => {

    const categories = [
        { id: 1, name: "Investigații", chapters: 5, tasks: 22, status: "activ" },
        { id: 2, name: "Vânzări", chapters: 3, tasks: 10, status: "inactiv" },
        { id: 3, name: "Analiză", chapters: 8, tasks: 35, status: "activ" },
    ];

    return(
        <Layout
            loading={ false }
            header={{
                search: false,
                back: true,
                content: <Header />
            }}
            content={
                <View
                    data={ categories }
                />
            }
        />
    )

}

export default Categories;
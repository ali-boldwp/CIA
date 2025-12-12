import LayoutHeader from "../../layouts/Component/Header";
import Header from "./Components/Header";

const Layout = ({ children }) => {

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                { children }
            </div>
        </>
    );

}

export default Layout;
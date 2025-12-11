import HeaderLayout from "./Component/Header"

const Layout = ({
        loading = true,
        header = { title: null, logo: true, search: true, back: false, content: <></> },
        content = <></>,
    }) => {

    const {
        title = null,
        logo = true,
        search = true,
        back = false,
        content: headerContent
    } = header;

    if ( loading ) {

        return (
            <div style={{
                height: "100vh",
                width: "100vw",
                background: "linear-gradient(90.5deg, rgba(37, 99, 235, 0.98) 0%, rgba(79, 70, 229, 0.98) 99.89%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <span className="loader"></span>
            </div>
        )

    }

    return (
        <div style={{
            gap: '24px',
            display: "flex",
            flexDirection: "column"
        }}>
            <HeaderLayout search={search} logo={logo} title={title} back={back}>{headerContent}</HeaderLayout>

            <div style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                padding: '20px',
                paddingTop: 0,
                gap: "24px"
            }}>
                { content }
            </div>
        </div>
    );

};

export default Layout;
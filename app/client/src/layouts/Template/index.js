const Template = ({ loading, content }) => {

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
            { content }
        </div>
    );

}

export default  Template;
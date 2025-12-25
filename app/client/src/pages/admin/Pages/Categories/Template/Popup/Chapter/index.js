import Popup from "../../../../../../Components/Popup";

const Chapter = ({ open, onClose }) => {

    const content = () => {

        return (
            <>
                Form here....
            </>
        )

    }

    const footer = () => {

        return (
            <>
                Form here....
            </>
        )

    }

    return (
        <>
            <Popup
                content={ content() }
                header={ "New Chapter" }
                footer={ footer() }
                onClose={ onClose }
            />
        </>
    )

}

export default Chapter;
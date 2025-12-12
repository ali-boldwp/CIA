import HeaderLayout from "./Component/Header"
import {useEffect} from "react";
import socket from "../socket";
import { toast } from "react-toastify";
import {useSelector} from "react-redux";

const Layout = ({
        loading = true,
        header = { title: null, logo: true, search: true, back: false, content: <></> },
        content = <></>,
    }) => {

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {

        const ID = `notification_${ user._id }`;

        socket.on( ID, async (msg) => {

            toast ( "New Notification" );

            // auto-mark seen if user is viewing that chat
            /*if (msg.chatId === chat) {
                try {
                    await markSeen(chat).unwrap();

                    // update UI after marking seen
                    msg.seenBy = [...(msg.seenBy || []), currentUserId];

                } catch (e) {}
            }*/

        });


        return () => {
            socket.off( `notification_${ user._id }` );
        };

    }, []);

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
                padding: '24px',
                paddingTop: 0,
                gap: "24px"
            }}>
                { content }
            </div>
        </div>
    );

};

export default Layout;
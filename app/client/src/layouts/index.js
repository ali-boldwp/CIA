import HeaderLayout from "./Component/Header"
import {useEffect} from "react";
import socket from "../socket";
import { toast } from "react-toastify";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {store} from "../store";
import {notificationApi} from "../services/notificationApi";

const Layout = ({
        loading = true,
        header = { title: null, logo: true, search: true, back: false, content: <></> },
        content = <></>,
    }) => {

    const user = useSelector((state) => state.auth.user);

    socket.emit( "notifications", user?._id );

    useEffect(() => {

        if (!user?._id) return;

        socket.emit( "join_notification", user?._id );

        const handler = (payload) => {
            toast(
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {payload?.title && <div style={{ fontWeight: 700 }}>{payload.title}</div>}
                    {payload?.text && <div style={{ opacity: 0.9 }}>{payload.text}</div>}

                    {payload?.link && (
                        <Link
                            to={payload.link}
                            style={{ textDecoration: "underline", fontWeight: 600 }}
                        >
                            {payload.linkText || "Open"}
                        </Link>
                    )}

                    {payload?.extra && <div style={{ fontSize: 12, opacity: 0.8 }}>{payload.extra}</div>}
                </div>,
                {
                    autoClose: 6000,
                    closeOnClick: false, // so clicking link doesn't instantly close
                }
            );
            store.dispatch( notificationApi.util.invalidateTags(["Notifications"]) );
        };

        socket.on("notification", handler);


        return () => socket.off("notification", handler);

    }, [ user?._id ]);

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
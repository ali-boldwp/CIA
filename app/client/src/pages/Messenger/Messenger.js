import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import MessengerPage from "./components/Header";
import Layout from "../../layouts"
import {useGetAuditLogsQuery, useGetMessagesQuery} from "../../services/messageApi";
import {useGetMyChatsQuery} from "../../services/chatApi";

const Messenger = () => {

    const { id: ChatID = "open"} = useParams();

    const navigation = useNavigate();

    const { data, isLoading } = useGetMessagesQuery( { chatId: ChatID, limit: 100 }, {skip: ChatID === "open"});
    const {data: chats, isLoading: chatsLoading, refetch: refetchChats} = useGetMyChatsQuery();
    const {
        data: auditData,
        isLoading: auditLoading,
        isError: auditError
    } = useGetAuditLogsQuery( ChatID, {
        skip: !ChatID || ChatID === "open"
    });

    return (
        <Layout
            loading={ chatsLoading }
            header={{
                search: false,
                title: "Messenger — Toți / Grupuri / DM",
                back: true,
                content: <>
                    <button className="icon-btn" style={{ width: "130px" }} onClick={ () => navigation( "/messenger/new" ) }>
                        <span className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24" fill="none">
                                <path d="M7 5C5.34315 5 4 6.34315 4 8V16C4 17.6569 5.34315 19 7 19H17C18.6569 19 20 17.6569 20 16V12.5C20 11.9477 20.4477 11.5 21 11.5C21.5523 11.5 22 11.9477 22 12.5V16C22 18.7614 19.7614 21 17 21H7C4.23858 21 2 18.7614 2 16V8C2 5.23858 4.23858 3 7 3H10.5C11.0523 3 11.5 3.44772 11.5 4C11.5 4.55228 11.0523 5 10.5 5H7Z" fill="#FFF"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8431 3.58579C18.0621 2.80474 16.7957 2.80474 16.0147 3.58579L11.6806 7.91992L11.0148 11.9455C10.8917 12.6897 11.537 13.3342 12.281 13.21L16.3011 12.5394L20.6347 8.20582C21.4158 7.42477 21.4158 6.15844 20.6347 5.37739L18.8431 3.58579ZM13.1933 11.0302L13.5489 8.87995L17.4289 5L19.2205 6.7916L15.34 10.6721L13.1933 11.0302Z" fill="#FFF"/>
                            </svg>
                        </span>
                        <span className="text">Creare Nou</span>
                    </button>
                </>
            }}
            content={
                <div style={{ height: "calc( 100vh - 139px )", overflow: "auto" }}>

                    <MessengerPage
                        chatID={ ChatID }
                        data={ data }
                        chats={ chats }
                        refetchChats={ refetchChats }
                    />
                </div>
            }
        />

    );
};

export default Messenger;
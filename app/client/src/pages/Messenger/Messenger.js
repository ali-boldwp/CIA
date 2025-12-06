import React from 'react';
import { useParams } from "react-router-dom";
import MessengerPage from "./components/Header";

const Messenger = () => {

    const { ID = "open" } = useParams();

    return (
        <div>

            <MessengerPage chatID={ ID } />
        </div>
    );
};

export default Messenger;
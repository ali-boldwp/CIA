import NewMessenger from "./NewMessenger";


const NewMessengerConfig = {
    settings: {
        layout: {
            config: {}
        }
    },



    routes: [
        {
            path: '/messenger/new',
            element: <NewMessenger />
        }

    ]
};

export default NewMessengerConfig;
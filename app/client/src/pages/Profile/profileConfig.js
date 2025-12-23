import Profile from "./index";


const  profileConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/profile',
            element:  <Profile/>
        }
    ]
};

export default  profileConfig;

import AnalystProfile from "./index";


const AnalistProfileCon = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],

    routes: [
        {
            path: '/analyst-profile',
            element:  <AnalystProfile/>
        }
    ]
};

export default AnalistProfileCon;
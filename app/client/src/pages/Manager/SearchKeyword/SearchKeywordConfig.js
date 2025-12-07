import SearchKeyword from "./index";

const  SearchKeywordConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin' , 'manager' ],
    routes: [
        {
            path: '/search/:keyword',
            element:  <SearchKeyword/>
        }
    ]
};

export default  SearchKeywordConfig;
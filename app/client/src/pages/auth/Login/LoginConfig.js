import Login from "./Login"

const LoginConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/login',
            element: <Login />
        }
    ]
};

export default LoginConfig;
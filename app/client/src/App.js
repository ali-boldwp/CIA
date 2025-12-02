import './App.css';
import AppContext from '@libs/AppContext';
import routes from "./config/routesConfig"
import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './auth/AuthProvider'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from './store';
import "@fontsource/inter";


function App() {
    return (
        <Provider store={store}>
            <AppContext.Provider
                value={{
                    routes
                }}
            >
                <AuthProvider>
                    <BrowserRouter>
                        <ToastContainer />
                        <AppRoutes/>
                    </BrowserRouter>
                </AuthProvider>

            </AppContext.Provider>
        </Provider>
    );
}

export default App;

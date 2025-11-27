import './App.css';
import AppContext from '@libs/AppContext';
import routes from "./config/routesConfig"
import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '@libs/Authorization'

import { Provider } from 'react-redux';
import store from './store';

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
                        <AppRoutes/>
                    </BrowserRouter>
                </AuthProvider>

            </AppContext.Provider>
        </Provider>
    );
}

export default App;

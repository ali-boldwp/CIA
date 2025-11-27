import React, { createContext } from 'react';

// Create the auth context
const AuthContext = createContext({
    user: null,
    setUser: () => {}
});

export default AuthContext;
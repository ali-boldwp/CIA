// ../../libs/Authorization/index.js

import React, { useState, useMemo } from 'react';
import AuthContext from '@libs/AuthContext';

// AuthProvider component WITHOUT JSX
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const value = useMemo(
        () => ({ user, setUser }),
        [user]
    );

    // Instead of:
    // return (
    //   <AuthContext.Provider value={value}>
    //     {children}
    //   </AuthContext.Provider>
    // );

    return React.createElement(
        AuthContext.Provider,
        { value },
        children
    );
};

export default AuthContext;

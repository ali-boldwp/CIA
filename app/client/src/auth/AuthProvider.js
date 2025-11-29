import React, { useState, useMemo } from 'react';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({ user, setUser }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

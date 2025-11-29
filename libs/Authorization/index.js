import React, { useState, useMemo } from 'react';
import AuthContext from '@libs/AuthContext';

console.log('Same React instance?', React === window.__APP_REACT__); // TEMP debug

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

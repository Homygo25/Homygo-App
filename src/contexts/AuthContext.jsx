import React from 'react';
// This file is intentionally left minimal as part of the application reset.
// Authentication logic will be rebuilt according to the new project specifications.
export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
export const useAuth = () => React.useContext(AuthContext);
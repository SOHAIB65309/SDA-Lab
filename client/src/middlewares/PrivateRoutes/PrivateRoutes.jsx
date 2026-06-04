import React from 'react'
import { Navigate } from 'react-router-dom';
const PrivateRoutes = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('auth-token'); // Example auth logic
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoutes
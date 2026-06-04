// client/src/middlewares/PublicRoutes/PublicRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('auth-token'); // Example auth logic
  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRoutes;

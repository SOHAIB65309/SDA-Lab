import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AdminApp from './Admin/AdminApp';
import reportWebVitals from './reportWebVitals';
import ProtectedRoutes from './middlewares/ProtectedRoutes/ProtectedRoutes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<App />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <AdminApp />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();

import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Admin from './Admin';
import AddProduct from '../AdminComponents/Products/AddProduct';
import EditProduct from '../AdminComponents/Products/EditProduct';
import ViewProducts from '../AdminComponents/Products/ViewProducts';
import Orders from '../AdminComponents/Orders/Orders';
import ManageBanners from '../AdminComponents/Banners/ManageBanners';
import WishlistAnalytics from '../AdminComponents/Wishlist/WishlistAnalytics';
import ManageReturns from '../AdminComponents/Returns/ManageReturns';

const navItems = [
  { to: '/admin',                  label: 'Dashboard',         icon: '⊞' },
  { to: '/admin/add-product',      label: 'Add Product',       icon: '➕' },
  { to: '/admin/view-products',    label: 'Products',          icon: '📋' },
  { to: '/admin/Orders',           label: 'Orders',            icon: '📬' },
  { to: '/admin/returns',          label: 'Returns',           icon: '↩️' },
  { to: '/admin/wishlist',         label: 'Wishlist Stats',    icon: '❤️' },
  { to: '/admin/banners',          label: 'Banners',           icon: '🖼️' },
];

const AdminApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate   = useNavigate();
  const location   = useLocation();
  const user       = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    localStorage.removeItem('user-role');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0d1a', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside
        className="fixed top-0 left-0 h-full flex flex-col transition-all duration-300 z-40"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: '#13132a',
          borderRight: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d4af37, #f5e17a)' }}>
            S
          </div>
          {sidebarOpen && (
            <span className="font-bold text-sm tracking-widest uppercase" style={{ color: '#d4af37' }}>
              Admin Panel
            </span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/admin' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                title={!sidebarOpen ? item.label : ''}
                className="flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background:   isActive ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color:        isActive ? '#d4af37' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  borderLeft:   isActive ? '3px solid #d4af37' : '3px solid transparent',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-2 py-2 mb-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #d4af37, #f5e17a)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: '#f5f5f5' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : ''}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 64 }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6"
          style={{
            height: 64,
            background: 'rgba(13,13,26,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
              ← Back to Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/"                element={<Admin />} />
            <Route path="add-product"      element={<AddProduct />} />
            <Route path="Orders"           element={<Orders />} />
            <Route path="view-products"    element={<ViewProducts />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="banners"          element={<ManageBanners />} />
            <Route path="wishlist"         element={<WishlistAnalytics />} />
            <Route path="returns"          element={<ManageReturns />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;

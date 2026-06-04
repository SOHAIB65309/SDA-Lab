// Sidebar is not used directly — AdminApp.js has its own inline sidebar.
// This file is kept for reference only.
import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/admin',                 label: 'Dashboard',      icon: '⊞' },
  { to: '/admin/add-product',     label: 'Add Product',    icon: '➕' },
  { to: '/admin/view-products',   label: 'Products',       icon: '📋' },
  { to: '/admin/Orders',          label: 'Orders',         icon: '📬' },
  { to: '/admin/returns',         label: 'Returns',        icon: '↩️' },
  { to: '/admin/wishlist',        label: 'Wishlist Stats', icon: '❤️' },
  { to: '/admin/banners',         label: 'Banners',        icon: '🖼️' },
];

const Sidebar = () => (
  <div className="h-screen w-64 flex flex-col" style={{ background: '#13132a' }}>
    <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 className="text-lg font-bold" style={{ color: '#d4af37' }}>Admin Panel</h2>
    </div>
    <nav className="flex-1 py-4">
      {navItems.map((item) => (
        <Link key={item.to} to={item.to}
          className="flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg transition-all"
          style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4af37'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
          <span>{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  </div>
);

export default Sidebar;

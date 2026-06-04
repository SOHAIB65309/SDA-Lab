import API from '../config/api.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color }) => (
  <div className="rounded-xl p-5 flex items-center gap-4"
    style={{ background: '#1e1e2e', border: `1px solid ${color}33` }}>
    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: `${color}22` }}>
      {icon}
    </div>
    <div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  </div>
);

const Admin = () => {
  const [stats, setStats]           = useState({ products: 0, orders: 0, users: 0, revenue: 0, wishlists: 0, pendingReturns: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingReturnsList, setPendingReturnsList] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes, wishlistRes, returnsRes] = await Promise.all([
          fetch(`${API}/api/products`),
          fetch(`${API}/api/orders`),
          fetch(`${API}/api/users`),
          fetch(`${API}/api/admin/wishlists`),
          fetch(`${API}/api/admin/returns`),
        ]);
        const products  = await productsRes.json();
        const orders    = await ordersRes.json();
        const users     = await usersRes.json();
        const wishlists = await wishlistRes.json();
        const returns   = await returnsRes.json();

        const revenue        = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pendingReturns = Array.isArray(returns) ? returns.filter(r => r.status === 'pending') : [];

        setStats({
          products:       products.length,
          orders:         orders.length,
          users:          users.length,
          revenue:        revenue.toFixed(2),
          wishlists:      Array.isArray(wishlists) ? wishlists.length : 0,
          pendingReturns: pendingReturns.length,
        });
        setRecentOrders(orders.slice(0, 5));
        setPendingReturnsList(pendingReturns.slice(0, 3));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    pending:   '#f59e0b',
    processed: '#3b82f6',
    shipped:   '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const quickActions = [
    { to: '/admin/add-product',   label: 'Add Product',       icon: '➕', desc: 'Upload a new product' },
    { to: '/admin/view-products', label: 'Manage Products',   icon: '📋', desc: 'Edit or delete products' },
    { to: '/admin/Orders',        label: 'Manage Orders',     icon: '📬', desc: 'Update order statuses' },
    { to: '/admin/returns',       label: 'Return Requests',   icon: '↩️', desc: `${stats.pendingReturns} pending review` },
    { to: '/admin/wishlist',      label: 'Wishlist Stats',    icon: '❤️', desc: `${stats.wishlists} total saves` },
    { to: '/admin/banners',       label: 'Manage Banners',    icon: '🖼️', desc: 'Home page slider images' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#f5f5f5' }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Welcome back, Admin</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Products"       value={loading ? '…' : stats.products}       icon="📦" color="#d4af37" />
        <StatCard label="Orders"         value={loading ? '…' : stats.orders}         icon="🛒" color="#3b82f6" />
        <StatCard label="Users"          value={loading ? '…' : stats.users}          icon="👥" color="#10b981" />
        <StatCard label="Revenue"        value={loading ? '…' : `$${stats.revenue}`}  icon="💰" color="#8b5cf6" />
        <StatCard label="Wishlist Saves" value={loading ? '…' : stats.wishlists}      icon="❤️" color="#ec4899" />
        <StatCard label="Pending Returns" value={loading ? '…' : stats.pendingReturns} icon="↩️" color="#f59e0b" />
      </div>

      {/* ── Quick Actions ── */}
      <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}
            className="rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all duration-200"
            style={{ background: '#1e1e2e', border: '1px solid rgba(212,175,55,0.2)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)')}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: 'rgba(212,175,55,0.15)' }}>
              {action.icon}
            </div>
            <p className="font-semibold text-xs" style={{ color: '#f5f5f5' }}>{action.label}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* ── Two-column bottom section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders — takes 2 cols */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-bold" style={{ color: '#f5f5f5' }}>Recent Orders</h2>
            <Link to="/admin/Orders" style={{ color: '#d4af37', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div className="p-6 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: '#d4af37' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3" style={{ color: '#f5f5f5' }}>{order.user?.name || 'Unknown'}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: '#f5f5f5' }}>
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{
                            background: `${statusColors[order.status] || '#888'}22`,
                            color: statusColors[order.status] || '#888',
                          }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Returns — takes 1 col */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: '#1e1e2e', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-bold" style={{ color: '#f5f5f5' }}>Pending Returns</h2>
            <Link to="/admin/returns" style={{ color: '#f59e0b', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div className="p-5 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</div>
          ) : pendingReturnsList.length === 0 ? (
            <div className="p-5 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>No pending returns</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {pendingReturnsList.map((r) => (
                <div key={r._id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-xs" style={{ color: '#f5f5f5' }}>{r.productName}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                      Pending
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {r.userId?.name || 'Unknown user'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.reason}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

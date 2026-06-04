import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { FaBox, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTruck, FaHeart, FaUndo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:   { color: '#f59e0b', bg: '#fef3c7', icon: <FaClock size={11} /> },
  processed: { color: '#3b82f6', bg: '#dbeafe', icon: <FaBox size={11} /> },
  shipped:   { color: '#8b5cf6', bg: '#ede9fe', icon: <FaTruck size={11} /> },
  delivered: { color: '#10b981', bg: '#d1fae5', icon: <FaCheckCircle size={11} /> },
  cancelled: { color: '#ef4444', bg: '#fee2e2', icon: '✕' },
};

const Profile = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [returnsCount, setReturnsCount]   = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, wishlistRes, returnsRes] = await Promise.all([
          fetch(`${API}/api/order/${userId}`),
          fetch(`${API}/api/wishlist/${userId}`),
          fetch(`${API}/api/returns/user/${userId}`),
        ]);
        const ordersData   = await ordersRes.json();
        const wishlistData = await wishlistRes.json();
        const returnsData  = await returnsRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0);
        setReturnsCount(Array.isArray(returnsData) ? returnsData.length : 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-4xl mx-auto">

        {/* ── Profile Hero Card ── */}
        <div className="rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 8px 32px rgba(14,165,233,0.25)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold capitalize"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {user?.role || 'Member'}
            </span>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { to: '/profile',  icon: <FaBox size={18} />,   label: 'Orders',   count: orders.length,  color: '#0ea5e9', bg: '#e0f2fe' },
            { to: '/wishlist', icon: <FaHeart size={18} />, label: 'Wishlist', count: wishlistCount,   color: '#ef4444', bg: '#fee2e2' },
            { to: '/returns',  icon: <FaUndo size={18} />,  label: 'Returns',  count: returnsCount,    color: '#f59e0b', bg: '#fef3c7' },
          ].map((item) => (
            <Link key={item.to} to={item.to}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group"
              style={{ background: '#fff', border: `1.5px solid ${item.bg}`, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = item.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = item.bg)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <p className="font-bold text-lg" style={{ color: item.color }}>{item.count}</p>
              <p className="text-xs font-semibold" style={{ color: '#64748b' }}>{item.label}</p>
            </Link>
          ))}
        </div>

        {/* ── Orders Section ── */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="badge mb-1">History</span>
            <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>
              Your <span className="sky-text">Orders</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <Link to="/wishlist" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: '#fee2e2', color: '#ef4444', textDecoration: 'none' }}>
              <FaHeart size={11} /> Wishlist
            </Link>
            <Link to="/returns" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: '#fef3c7', color: '#d97706', textDecoration: 'none' }}>
              <FaUndo size={11} /> Returns
            </Link>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12" style={{ color: '#ef4444' }}>{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 rounded-3xl" style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
            <FaBox size={48} className="mx-auto mb-4" style={{ color: '#bae6fd' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>No orders yet</h3>
            <p className="mb-5" style={{ color: '#64748b' }}>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-primary">Shop Now →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order._id} className="rounded-2xl overflow-hidden fade-in"
                  style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 12px rgba(14,165,233,0.06)' }}>

                  {/* Order Header */}
                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                    style={{ borderBottom: '1px solid #f0f9ff' }}>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: '#94a3b8' }}>
                        Order ID
                      </p>
                      <p className="font-mono text-sm font-bold sky-text">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="font-bold sky-text">${order.totalAmount?.toFixed(2)}</div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize"
                      style={{ background: sc.bg, color: sc.color }}>
                      {sc.icon} {order.status}
                    </div>
                    {/* Return button — only for delivered orders */}
                    {order.status === 'delivered' && (
                      <Link to="/returns"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                        style={{ background: '#fef3c7', color: '#d97706', textDecoration: 'none', border: '1px solid #fde68a' }}>
                        <FaUndo size={9} /> Return
                      </Link>
                    )}
                  </div>

                  {/* Products */}
                  <div className="px-5 py-4">
                    {order.products.map((p) => (
                      <div key={p._id} className="flex justify-between items-center py-1.5">
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1e293b' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>Qty: {p.quantity} × ${p.price}</p>
                        </div>
                        <span className="text-sm font-semibold sky-text">${(p.quantity * p.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="px-5 py-3 flex items-start gap-2"
                    style={{ borderTop: '1px solid #f0f9ff', background: '#f8fbff' }}>
                    <FaMapMarkerAlt size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#0ea5e9' }} />
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

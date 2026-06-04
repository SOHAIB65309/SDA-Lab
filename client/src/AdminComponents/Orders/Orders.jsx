import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';

const statusColors = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  processed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  shipped:   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/api/orders`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`${API}/api/orders/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (response.ok) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filtered = orders.filter((o) =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Orders</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 2 }}>
            {orders.length} total orders
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by order ID or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            color: '#f5f5f5',
            padding: '8px 14px',
            fontSize: 13,
            outline: 'none',
            width: 280,
          }}
        />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Order ID', 'Customer', 'Products', 'Total', 'Status', 'Payment', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const sc = statusColors[order.status] || { color: '#888', bg: 'rgba(136,136,136,0.15)' };
                  return (
                    <tr
                      key={order._id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: '#d4af37' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3">
                        {order.user ? (
                          <div>
                            <p className="font-medium" style={{ color: '#f5f5f5' }}>{order.user.name}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.user.email}</p>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>Unknown</span>
                        )}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 180 }}>
                        {order.products.map((p) => (
                          <div key={p._id} className="text-xs">{p.name} ×{p.quantity}</div>
                        ))}
                      </td>
                      <td className="px-5 py-3 font-bold" style={{ color: '#f5f5f5' }}>
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="rounded-lg text-xs font-semibold px-2 py-1.5 cursor-pointer outline-none"
                          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44` }}
                        >
                          {['pending', 'processed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <option key={s} value={s} style={{ background: '#1e1e2e', color: '#f5f5f5' }}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{
                            background: order.paymentStatus?.toLowerCase() === 'paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: order.paymentStatus?.toLowerCase() === 'paid' ? '#10b981' : '#f59e0b',
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;

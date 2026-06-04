import API from '../../config/api.js';
import React, { useEffect, useState, useCallback } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { FaUndo, FaCheckCircle, FaClock, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

const statusConfig = {
  pending:  { color: '#f59e0b', bg: '#fef3c7', icon: <FaClock size={11} />,        label: 'Pending Review' },
  approved: { color: '#3b82f6', bg: '#dbeafe', icon: <FaCheckCircle size={11} />,  label: 'Approved' },
  rejected: { color: '#ef4444', bg: '#fee2e2', icon: <FaTimesCircle size={11} />,  label: 'Rejected' },
  refunded: { color: '#10b981', bg: '#d1fae5', icon: <FaMoneyBillWave size={11} />, label: 'Refunded' },
};

const ReturnRequest = () => {
  const [orders, setOrders] = useState([]);
  const [myReturns, setMyReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [form, setForm] = useState({
    orderId: '', productId: '', productName: '', reason: '', quantity: 1, refundAmount: 0,
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, returnsRes] = await Promise.all([
        fetch(`${API}/api/order/${user._id}`),
        fetch(`${API}/api/returns/user/${user._id}`),
      ]);
      const ordersData  = await ordersRes.json();
      const returnsData = await returnsRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData.filter(o => o.status === 'delivered') : []);
      setMyReturns(Array.isArray(returnsData) ? returnsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [fetchData, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    setForm((f) => ({ ...f, orderId, productId: '', productName: '', refundAmount: 0 }));
  };

  // Helper: extract the real string ID from a productId field (may be object or string)
  const getProductIdStr = (p) => {
    if (!p.productId) return p._id?.toString() || '';
    if (typeof p.productId === 'object') return p.productId._id?.toString() || '';
    return p.productId.toString();
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedOrder = orders.find(o => o._id === form.orderId);
    const product = selectedOrder?.products.find(p => getProductIdStr(p) === productId);
    setForm((f) => ({
      ...f,
      productId,
      productName: product?.name || (typeof product?.productId === 'object' ? product?.productId?.name : '') || '',
      refundAmount: product ? parseFloat(product.price) * f.quantity : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.reason.length < 10) { setError('Please provide a more detailed reason (min 10 characters)'); return; }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${API}/api/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to submit'); return; }
      setSuccess('Return request submitted successfully! We will review it within 2-3 business days.');
      setForm({ orderId: '', productId: '', productName: '', reason: '', quantity: 1, refundAmount: 0 });
      await fetchData();
      setActiveTab('history');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOrder = orders.find(o => o._id === form.orderId);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="badge mb-2">Returns & Refunds</span>
          <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
            Return <span className="sky-text">Request</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            Only delivered orders are eligible for returns.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'new', label: '📝 New Request' },
            { key: 'history', label: `📋 My Returns (${myReturns.length})` },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={activeTab === tab.key
                ? { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff' }
                : { background: '#fff', color: '#64748b', border: '2px solid #e0f2fe' }
              }>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── NEW REQUEST TAB ── */}
        {activeTab === 'new' && (
          <div className="rounded-3xl p-7"
            style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)' }}>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <FaUndo size={40} className="mx-auto mb-4" style={{ color: '#bae6fd' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>No eligible orders</h3>
                <p style={{ color: '#64748b' }}>You can only return orders with "Delivered" status.</p>
                <Link to="/profile" className="btn-primary mt-4 inline-block">View My Orders</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#1e293b' }}>Submit a Return Request</h2>

                {/* Order select */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
                    Select Order *
                  </label>
                  <select value={form.orderId} onChange={handleOrderChange} required className="input-light"
                    style={{ cursor: 'pointer' }}>
                    <option value="">-- Choose a delivered order --</option>
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>
                        #{o._id.slice(-8).toUpperCase()} — ${o.totalAmount?.toFixed(2)} — {new Date(o.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product select */}
                {selectedOrder && (
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
                      Select Product *
                    </label>
                    <select value={form.productId} onChange={handleProductChange} required className="input-light"
                      style={{ cursor: 'pointer' }}>
                      <option value="">-- Choose a product --</option>
                      {selectedOrder.products.map((p) => {
                        const pid = getProductIdStr(p);
                        const pname = p.name || (typeof p.productId === 'object' ? p.productId?.name : '') || 'Unknown';
                        return (
                          <option key={p._id} value={pid}>
                            {pname} — Qty: {p.quantity} — ${p.price} each
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                {form.productId && (
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
                      Quantity to Return *
                    </label>
                    <input type="number" min="1" value={form.quantity} required className="input-light"
                      onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
                    Reason for Return * <span style={{ color: '#94a3b8', fontWeight: 400 }}>(min 10 characters)</span>
                  </label>
                  <textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                    rows={4} required className="input-light resize-none"
                    placeholder="e.g. The product arrived damaged. The zipper was broken and the color was different from the photo..." />
                  <p className="text-xs mt-1" style={{ color: form.reason.length < 10 ? '#ef4444' : '#10b981' }}>
                    {form.reason.length} / 10 minimum characters
                  </p>
                </div>

                {/* Estimated refund */}
                {form.productId && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                    <FaMoneyBillWave style={{ color: '#0ea5e9' }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#64748b' }}>Estimated Refund</p>
                      <p className="font-bold sky-text">
                        ${(form.refundAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}>
                    ⚠ {error}
                  </div>
                )}
                {success && (
                  <div className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                    ✓ {success}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full py-3"
                  style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Submitting…' : '📤 Submit Return Request'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            {myReturns.length === 0 ? (
              <div className="text-center py-20 rounded-3xl"
                style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
                <FaUndo size={48} className="mx-auto mb-4" style={{ color: '#bae6fd' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>No return requests yet</h3>
                <p style={{ color: '#64748b' }}>Your submitted return requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myReturns.map((r) => {
                  const sc = statusConfig[r.status] || statusConfig.pending;
                  return (
                    <div key={r._id} className="rounded-2xl overflow-hidden fade-in"
                      style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 12px rgba(14,165,233,0.06)' }}>
                      {/* Header */}
                      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                        style={{ borderBottom: '1px solid #f0f9ff' }}>
                        <div>
                          <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: '#94a3b8' }}>
                            Return ID
                          </p>
                          <p className="font-mono text-sm font-bold sky-text">#{r._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </div>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#94a3b8' }}>Product</p>
                          <p className="font-medium text-sm" style={{ color: '#1e293b' }}>{r.productName}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Qty: {r.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#94a3b8' }}>Reason</p>
                          <p className="text-sm" style={{ color: '#475569' }}>{r.reason}</p>
                        </div>
                        {r.refundAmount > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#94a3b8' }}>Refund Amount</p>
                            <p className="font-bold sky-text">${r.refundAmount.toFixed(2)}</p>
                          </div>
                        )}
                        {r.adminNote && (
                          <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#94a3b8' }}>Admin Note</p>
                            <p className="text-sm px-3 py-2 rounded-xl"
                              style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                              {r.adminNote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnRequest;

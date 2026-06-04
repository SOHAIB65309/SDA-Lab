import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';

import { FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const statusConfig = {
  pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: <FaClock size={11} />,         label: 'Pending' },
  approved: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  icon: <FaCheckCircle size={11} />,   label: 'Approved' },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   icon: <FaTimesCircle size={11} />,   label: 'Rejected' },
  refunded: { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  icon: <FaMoneyBillWave size={11} />, label: 'Refunded' },
};

const ManageReturns = () => {
  const [returns, setReturns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [returnsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/admin/returns`),
        fetch(`${API}/api/admin/return-stats`),
      ]);
      const returnsData = await returnsRes.json();
      const statsData = await statsRes.json();
      setReturns(Array.isArray(returnsData) ? returnsData : []);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`${API}/api/admin/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote, refundAmount }),
      });
      if (res.ok) {
        setReturns((prev) =>
          prev.map((r) => r._id === id ? { ...r, status, adminNote, refundAmount } : r)
        );
        setExpandedId(null);
        setAdminNote('');
        setRefundAmount(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? returns : returns.filter(r => r.status === filter);

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f5f5f5',
    padding: '8px 12px',
    width: '100%',
    outline: 'none',
    fontSize: 13,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Return Requests</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          Review and process customer return requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',    value: stats.total,    color: '#94a3b8', icon: '📋' },
          { label: 'Pending',  value: stats.pending,  color: '#f59e0b', icon: '⏳' },
          { label: 'Approved', value: stats.approved, color: '#3b82f6', icon: '✅' },
          { label: 'Refunded', value: stats.refunded, color: '#10b981', icon: '💰' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: '#1e1e2e', border: `1px solid ${s.color}33` }}>
            <span className="text-xl">{s.icon}</span>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: s.color }}>
                {loading ? '…' : (s.value ?? 0)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', 'pending', 'approved', 'rejected', 'refunded'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
            style={filter === f
              ? { background: 'rgba(212,175,55,0.2)', color: '#d4af37', border: '1px solid #d4af37' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
            }>
            {f === 'all' ? `All (${returns.length})` : `${f} (${returns.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Returns list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No return requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const sc = statusConfig[r.status] || statusConfig.pending;
            const isExpanded = expandedId === r._id;
            return (
              <div key={r._id} className="rounded-2xl overflow-hidden"
                style={{ background: '#1e1e2e', border: `1px solid ${r.status === 'pending' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}>

                {/* Header row */}
                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Return ID</p>
                    <p className="font-mono text-sm font-bold" style={{ color: '#d4af37' }}>
                      #{r._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Customer</p>
                    <p className="font-medium text-sm" style={{ color: '#f5f5f5' }}>{r.userId?.name || 'Unknown'}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Product</p>
                    <p className="font-medium text-sm" style={{ color: '#f5f5f5' }}>{r.productName}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Qty: {r.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: sc.bg, color: sc.color }}>
                    {sc.icon} {sc.label}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Reason */}
                <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-xs font-semibold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Reason
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.reason}</p>
                  {r.adminNote && (
                    <div className="mt-2 px-3 py-2 rounded-lg text-xs"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <strong style={{ color: '#d4af37' }}>Admin Note:</strong> {r.adminNote}
                    </div>
                  )}
                </div>

                {/* Action panel */}
                {r.status === 'pending' && (
                  <div className="px-5 py-4">
                    {!isExpanded ? (
                      <button onClick={() => { setExpandedId(r._id); setRefundAmount(r.refundAmount || 0); }}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}>
                        ✏ Review & Respond
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase mb-1"
                            style={{ color: 'rgba(255,255,255,0.45)' }}>Admin Note</label>
                          <input type="text" value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Optional note to customer…" style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase mb-1"
                            style={{ color: 'rgba(255,255,255,0.45)' }}>Refund Amount ($)</label>
                          <input type="number" value={refundAmount} min="0" step="0.01"
                            onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => handleStatusUpdate(r._id, 'approved')}
                            disabled={updating === r._id}
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.4)' }}>
                            ✅ Approve
                          </button>
                          <button onClick={() => handleStatusUpdate(r._id, 'refunded')}
                            disabled={updating === r._id}
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                            💰 Mark Refunded
                          </button>
                          <button onClick={() => handleStatusUpdate(r._id, 'rejected')}
                            disabled={updating === r._id}
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}>
                            ✕ Reject
                          </button>
                          <button onClick={() => setExpandedId(null)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold"
                            style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageReturns;

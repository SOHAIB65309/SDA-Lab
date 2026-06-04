import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';

import { FaHeart } from 'react-icons/fa';

const WishlistAnalytics = () => {
  const [stats, setStats] = useState([]);
  const [allWishlists, setAllWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, allRes] = await Promise.all([
          fetch(`${API}/api/admin/wishlist-stats`),
          fetch(`${API}/api/admin/wishlists`),
        ]);
        const statsData = await statsRes.json();
        const allData = await allRes.json();
        setStats(Array.isArray(statsData) ? statsData : []);
        setAllWishlists(Array.isArray(allData) ? allData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalWishlists = allWishlists.length;
  const uniqueUsers = new Set(allWishlists.map(w => w.userId?._id)).size;
  const uniqueProducts = new Set(allWishlists.map(w => w.productId?._id)).size;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Wishlist Analytics</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          See which products customers are saving and who is saving them.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Saves', value: totalWishlists, color: '#ec4899', icon: '❤️' },
          { label: 'Unique Users', value: uniqueUsers, color: '#0ea5e9', icon: '👥' },
          { label: 'Unique Products', value: uniqueProducts, color: '#8b5cf6', icon: '📦' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: '#1e1e2e', border: `1px solid ${s.color}33` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${s.color}22` }}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {loading ? '…' : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'popular', label: '🔥 Most Wishlisted' },
          { key: 'all', label: '📋 All Saves' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={activeTab === tab.key
              ? { background: 'rgba(212,175,55,0.2)', color: '#d4af37', border: '1px solid #d4af37' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
            }>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
        </div>
      ) : activeTab === 'popular' ? (
        /* Most wishlisted products */
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          {stats.length === 0 ? (
            <div className="p-12 text-center">
              <FaHeart size={40} className="mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>No wishlist data yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Rank', 'Product', 'Category', 'Price', 'Times Saved'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : 'rgba(255,255,255,0.1)',
                          color: i < 3 ? '#000' : 'rgba(255,255,255,0.6)',
                          display: 'inline-flex',
                        }}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.product?.image} alt={s.product?.name}
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/36?text=?'; }} />
                        <span className="font-medium" style={{ color: '#f5f5f5' }}>{s.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                        {s.product?.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold" style={{ color: '#10b981' }}>
                      ${s.product?.new_price}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FaHeart size={11} style={{ color: '#ec4899' }} />
                        <span className="font-bold" style={{ color: '#ec4899' }}>{s.count}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* All wishlist saves */
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          {allWishlists.length === 0 ? (
            <div className="p-12 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No data yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['User', 'Product', 'Saved On'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allWishlists.map((w) => (
                    <tr key={w._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-sm" style={{ color: '#f5f5f5' }}>{w.userId?.name || 'Unknown'}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{w.userId?.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={w.productId?.image} alt={w.productId?.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/32?text=?'; }} />
                          <div>
                            <p className="font-medium text-sm" style={{ color: '#f5f5f5' }}>{w.productId?.name}</p>
                            <p className="text-xs" style={{ color: '#10b981' }}>${w.productId?.new_price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(w.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistAnalytics;

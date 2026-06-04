import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const response = await fetch(`${API}/api/removeproduct/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16" style={{ color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 2 }}>
            {products.length} total products
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search products…"
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
              width: 220,
            }}
          />
          <Link
            to="/admin/add-product"
            className="px-4 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #d4af37, #b8962e)', color: '#0a0a0a', textDecoration: 'none' }}
          >
            ➕ Add Product
          </Link>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Product', 'Category', 'New Price', 'Old Price', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <span className="font-medium" style={{ color: '#f5f5f5' }}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold" style={{ color: '#10b981' }}>
                      ${product.new_price}
                    </td>
                    <td className="px-5 py-3 line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {product.old_price ? `$${product.old_price}` : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: product.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: product.status === 'active' ? '#10b981' : '#ef4444',
                        }}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', textDecoration: 'none' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.3)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.15)')}
                        >
                          ✏ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                        >
                          {deleting === product._id ? '…' : '🗑 Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;

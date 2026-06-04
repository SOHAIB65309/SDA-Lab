import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CATEGORIES = [
  { group: 'Fashion', items: [
    { value: 'mens',        label: "Men's Clothing",     icon: '👔' },
    { value: 'womens',      label: "Women's Clothing",   icon: '👗' },
    { value: 'kids',        label: "Kids' Clothing",     icon: '🧒' },
    { value: 'clothing',    label: 'Clothing (General)', icon: '👕' },
  ]},
  { group: 'Tech', items: [
    { value: 'electronics', label: 'Electronics',        icon: '💻' },
    { value: 'mobiles',     label: 'Mobiles',            icon: '📱' },
    { value: 'gaming',      label: 'Gaming',             icon: '🎮' },
  ]},
  { group: 'Lifestyle', items: [
    { value: 'shoes',       label: 'Shoes',              icon: '👟' },
    { value: 'watches',     label: 'Watches',            icon: '⌚' },
    { value: 'accessories', label: 'Accessories',        icon: '👜' },
  ]},
];

const ALL_CATS = CATEGORIES.flatMap(g => g.items);

const EditProduct = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f5f5f5',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: 14,
  };
  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 6,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.category) { setError('Please select a category'); return; }
    if (product.old_price && Number(product.old_price) < Number(product.new_price)) {
      setError('Old price must be greater than or equal to new price');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/editproducts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      product.name,
          category:  product.category,
          new_price: Number(product.new_price),
          old_price: product.old_price ? Number(product.old_price) : null,
          status:    product.status,
          stars:     Number(product.stars) || 0,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update product');
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/view-products');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
    </div>
  );

  // ── Not found ──
  if (!product) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">⚠️</div>
      <p style={{ color: '#ef4444' }}>{error || 'Product not found'}</p>
      <Link to="/admin/view-products"
        className="inline-block mt-4 px-5 py-2 rounded-xl text-sm font-bold"
        style={{ background: 'rgba(212,175,55,0.2)', color: '#d4af37', textDecoration: 'none' }}>
        ← Back to Products
      </Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Edit Product</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
            Editing: <span style={{ color: '#d4af37' }}>{product.name}</span>
          </p>
        </div>
        <Link to="/admin/view-products"
          className="text-xs px-4 py-2 rounded-lg transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
          ← Back to Products
        </Link>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm font-medium"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
          ✓ Product updated successfully! Redirecting…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Form ── */}
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input type="text" name="name" value={product.name || ''} onChange={handleChange}
                required placeholder="e.g. Classic White Shirt" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            </div>

            {/* Category Picker */}
            <div>
              <label style={labelStyle}>Category *</label>
              <div className="space-y-3">
                {CATEGORIES.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs mb-2"
                      style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em' }}>
                      {group.group.toUpperCase()}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {group.items.map((cat) => {
                        const isSelected = product.category === cat.value;
                        return (
                          <button key={cat.value} type="button"
                            onClick={() => setProduct(prev => ({ ...prev, category: cat.value }))}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                            style={{
                              background: isSelected ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                              border: isSelected ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                              color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.6)',
                            }}>
                            <span className="text-lg flex-shrink-0">{cat.icon}</span>
                            <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {product.category && (
                <p className="text-xs mt-2" style={{ color: '#10b981' }}>
                  ✓ Selected: <strong>{ALL_CATS.find(c => c.value === product.category)?.label || product.category}</strong>
                </p>
              )}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>New Price ($) *</label>
                <input type="number" name="new_price" value={product.new_price || ''} onChange={handleChange}
                  required min="0" step="0.01" placeholder="29.99" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
              </div>
              <div>
                <label style={labelStyle}>
                  Old Price ($) <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>optional</span>
                </label>
                <input type="number" name="old_price" value={product.old_price || ''} onChange={handleChange}
                  min="0" step="0.01" placeholder="49.99" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
              </div>
            </div>

            {/* Status + Stars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={product.status || 'active'} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="active"   style={{ background: '#1e1e2e' }}>✅ Active (visible to customers)</option>
                  <option value="inactive" style={{ background: '#1e1e2e' }}>🚫 Inactive (hidden)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Star Rating (0–5)</label>
                <div className="flex items-center gap-2">
                  <input type="range" name="stars" min="0" max="5" step="0.5"
                    value={product.stars || 0} onChange={handleChange}
                    style={{ flex: 1, accentColor: '#d4af37' }} />
                  <span className="text-sm font-bold w-8 text-center" style={{ color: '#d4af37' }}>
                    {Number(product.stars || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < Math.round(product.stars || 0) ? '#f59e0b' : 'rgba(255,255,255,0.2)', fontSize: 16 }}>★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Image */}
            {product.image && (
              <div>
                <label style={labelStyle}>Current Image</label>
                <div className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={product.image} alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=?'; }} />
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Image is stored on the server. To change the image, delete this product and re-add it with a new image.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300"
              style={{
                background: saving ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #b8962e)',
                color: '#0a0a0a',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>
              {saving ? 'Saving Changes…' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Info Panel ── */}
        <div className="space-y-4">
          {/* Product ID */}
          <div className="rounded-2xl p-5"
            style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold mb-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Product Info</h3>
            <div className="space-y-2">
              {[
                { label: 'ID',      value: product._id?.slice(-12).toUpperCase() },
                { label: 'Created', value: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—' },
                { label: 'Updated', value: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—' },
                { label: 'Reviews', value: product.reviews?.length || 0 },
              ].map(info => (
                <div key={info.label} className="flex justify-between text-xs">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{info.label}</span>
                  <span className="font-mono" style={{ color: '#d4af37' }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-5"
            style={{ background: '#1e1e2e', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h3 className="font-bold mb-3 text-sm" style={{ color: '#d4af37' }}>💡 Tips</h3>
            <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <li>• Set old price higher than new price to show a discount badge</li>
              <li>• Set status to <strong style={{ color: '#f5f5f5' }}>Inactive</strong> to hide from customers</li>
              <li>• Star rating affects product ranking in search</li>
              <li>• Category determines which section the product appears in on the home page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

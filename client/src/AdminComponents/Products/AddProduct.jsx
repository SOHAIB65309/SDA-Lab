import API from '../../config/api.js';
import React, { useState } from 'react';

// All available categories matching the store's category system
const CATEGORIES = [
  { group: 'Fashion',      items: [
    { value: 'mens',        label: "Men's Clothing",  icon: '👔' },
    { value: 'womens',      label: "Women's Clothing", icon: '👗' },
    { value: 'kids',        label: "Kids' Clothing",  icon: '🧒' },
    { value: 'clothing',    label: 'Clothing (General)', icon: '👕' },
  ]},
  { group: 'Tech',         items: [
    { value: 'electronics', label: 'Electronics',     icon: '💻' },
    { value: 'mobiles',     label: 'Mobiles',         icon: '📱' },
    { value: 'gaming',      label: 'Gaming',          icon: '🎮' },
  ]},
  { group: 'Lifestyle',    items: [
    { value: 'shoes',       label: 'Shoes',           icon: '👟' },
    { value: 'watches',     label: 'Watches',         icon: '⌚' },
    { value: 'accessories', label: 'Accessories',     icon: '👜' },
  ]},
];

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (oldPrice && Number(oldPrice) < Number(newPrice)) {
      alert('Old price must be greater than or equal to the new price');
      return;
    }
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('new_price', newPrice);
    formData.append('old_price', oldPrice || '');
    formData.append('status', status);
    formData.append('uploaded_by', user._id);

    try {
      const response = await fetch(`${API}/api/addproduct`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }
      setSuccess(true);
      setProductName(''); setCategory(''); setImage(null);
      setPreview(null); setNewPrice(''); setOldPrice(''); setStatus('active');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Add New Product</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          Fill in the details below to add a product to the store.
        </p>
      </div>

      {success && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
        >
          ✓ Product added successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label style={labelStyle}>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  placeholder="e.g. Classic White Shirt"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>

              <div className="sm:col-span-2">
                <label style={labelStyle}>Category *</label>
                {/* Category card picker */}
                <div className="space-y-3">
                  {CATEGORIES.map((group) => (
                    <div key={group.group}>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em' }}>
                        {group.group.toUpperCase()}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {group.items.map((cat) => {
                          const isSelected = category === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setCategory(cat.value)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                              style={{
                                background: isSelected ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                                border: isSelected ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                                color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.6)',
                              }}
                            >
                              <span className="text-lg flex-shrink-0">{cat.icon}</span>
                              <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Hidden required input to trigger browser validation */}
                <input type="text" value={category} required readOnly style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} tabIndex={-1} />
                {category && (
                  <p className="text-xs mt-2" style={{ color: '#10b981' }}>
                    ✓ Selected: <strong>{CATEGORIES.flatMap(g => g.items).find(c => c.value === category)?.label}</strong>
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="active" style={{ background: '#1e1e2e' }}>Active</option>
                  <option value="inactive" style={{ background: '#1e1e2e' }}>Inactive</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>New Price ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>

              <div>
                <label style={labelStyle}>Old Price ($) <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>optional</span></label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="49.99"
                  min="0"
                  step="0.01"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>

              <div className="sm:col-span-2">
                <label style={labelStyle}>Product Image</label>
                <label
                  className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    border: '2px dashed rgba(212,175,55,0.3)',
                    padding: '24px',
                    background: 'rgba(212,175,55,0.04)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4af37')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)')}
                >
                  <input type="file" accept="image/*" onChange={handleImageChange} required className="hidden" />
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Click to upload image</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300"
              style={{
                background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #b8962e)',
                color: '#0a0a0a',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Adding Product…' : '➕ Add Product'}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl p-6 h-fit"
          style={{ background: '#1e1e2e', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <h3 className="font-bold mb-4" style={{ color: '#d4af37' }}>💡 Tips</h3>
          <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <li>• Use a clear, high-quality product image (square format works best)</li>
            <li>• Set the old price higher than the new price to show a discount badge</li>
            <li>• Set status to <strong style={{ color: '#f5f5f5' }}>Inactive</strong> to hide the product from customers</li>
            <li>• Product names should be descriptive and concise</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

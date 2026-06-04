import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', subtitle: '', order: '0', image: null, preview: null });

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API}/api/banners/all`);
      const data = await res.json();
      setBanners(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, image: file, preview: URL.createObjectURL(file) }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.image) { alert('Please select an image'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', form.image);
      formData.append('title', form.title);
      formData.append('subtitle', form.subtitle);
      formData.append('order', form.order);

      const res = await fetch(`${API}/api/banners`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.message}`);
        return;
      }
      setSuccess('Banner added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setForm({ title: '', subtitle: '', order: '0', image: null, preview: null });
      fetchBanners();
    } catch (e) {
      alert('Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`${API}/api/banners/${id}/toggle`, { method: 'PUT' });
      fetchBanners();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await fetch(`${API}/api/banners/${id}`, { method: 'DELETE' });
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      console.error(e);
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
        <h1 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Manage Banners</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          Upload slider images that appear on the home page. Changes are live immediately.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
          ✓ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="rounded-2xl p-6" style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-bold mb-5" style={{ color: '#f5f5f5' }}>Add New Slide</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Image upload */}
            <div>
              <label style={labelStyle}>Slide Image *</label>
              <label
                className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all"
                style={{ border: '2px dashed rgba(14,165,233,0.4)', padding: 20, background: 'rgba(14,165,233,0.04)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0ea5e9')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)')}
              >
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {form.preview ? (
                  <img src={form.preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Click to upload</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Recommended: 1200×420px</p>
                  </>
                )}
              </label>
            </div>

            <div>
              <label style={labelStyle}>Title <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>optional</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Summer Sale" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#0ea5e9')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            </div>

            <div>
              <label style={labelStyle}>Subtitle <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>optional</span></label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. Up to 50% off" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#0ea5e9')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            </div>

            <div>
              <label style={labelStyle}>Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                min="0" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#0ea5e9')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            </div>

            <button type="submit" disabled={uploading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: uploading ? 'rgba(14,165,233,0.4)' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#fff',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}>
              {uploading ? 'Uploading…' : '🖼️ Add Slide'}
            </button>
          </form>
        </div>

        {/* Banner List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
            </div>
          ) : banners.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-5xl mb-4">🖼️</div>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>No banners yet. Add your first slide!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner, i) => (
                <div key={banner._id} className="rounded-2xl overflow-hidden flex gap-0"
                  style={{ background: '#1e1e2e', border: `1px solid ${banner.active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  {/* Image preview */}
                  <div className="flex-shrink-0" style={{ width: 160 }}>
                    <img src={banner.image} alt={banner.title || `Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 100 }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/160x100?text=Image'; }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Slide {i + 1}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: banner.active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: banner.active ? '#10b981' : '#ef4444' }}>
                          {banner.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      {banner.title && <p className="font-semibold text-sm" style={{ color: '#f5f5f5' }}>{banner.title}</p>}
                      {banner.subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{banner.subtitle}</p>}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleToggle(banner._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: banner.active ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: banner.active ? '#ef4444' : '#10b981' }}>
                        {banner.active ? '👁 Hide' : '👁 Show'}
                      </button>
                      <button onClick={() => handleDelete(banner._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBanners;

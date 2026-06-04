import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';

// Map URL slug → display name + icon
const CATEGORY_META = {
  clothing:    { label: 'Clothing',     icon: '👕', desc: 'Tops, shirts, dresses and more' },
  electronics: { label: 'Electronics',  icon: '💻', desc: 'Gadgets, devices and tech' },
  shoes:       { label: 'Shoes',        icon: '👟', desc: 'Sneakers, boots and sandals' },
  watches:     { label: 'Watches',      icon: '⌚', desc: 'Luxury and casual timepieces' },
  mobiles:     { label: 'Mobiles',      icon: '📱', desc: 'Smartphones and accessories' },
  gaming:      { label: 'Gaming',       icon: '🎮', desc: 'Consoles, games and gear' },
  accessories: { label: 'Accessories',  icon: '👜', desc: 'Bags, belts and more' },
  mens:        { label: "Men's",        icon: '👔', desc: "Men's fashion and apparel" },
  womens:      { label: "Women's",      icon: '👗', desc: "Women's fashion and apparel" },
  kids:        { label: "Kids'",        icon: '🧒', desc: "Children's clothing and toys" },
};

const CategoryPage = () => {
  const { name } = useParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [addedId, setAddedId]     = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const user = JSON.parse(localStorage.getItem('user'));

  const meta = CATEGORY_META[name?.toLowerCase()] || {
    label: name?.charAt(0).toUpperCase() + name?.slice(1),
    icon: '🛍️',
    desc: `Browse all ${name} products`,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();
        // Match category case-insensitively
        const filtered = data.filter(p =>
          p.category?.toLowerCase() === name?.toLowerCase() &&
          (!p.status || p.status === 'active')
        );
        setProducts(filtered);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [name]);

  // Load wishlist
  useEffect(() => {
    if (!user?._id) return;
    fetch(`${API}/api/wishlist/${user._id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data))
          setWishlistIds(new Set(data.map(i => i.productId?._id || i.productId)));
      }).catch(() => {});
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async (productId) => {
    if (!user?._id) { alert('Please log in to add items to cart.'); return; }
    try {
      const res = await fetch(`${API}/api/cart/${user._id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000);
    } catch { alert('Please log in to add items to cart.'); }
  };

  const toggleWishlist = async (productId) => {
    if (!user?._id) { alert('Please log in to save items.'); return; }
    try {
      if (wishlistIds.has(productId)) {
        await fetch(`${API}/api/wishlist/${user._id}/${productId}`, { method: 'DELETE' });
        setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        await fetch(`${API}/api/wishlist`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId }),
        });
        setWishlistIds(prev => new Set(prev).add(productId));
      }
    } catch {}
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: '#f0f7ff' }}>

      {/* Hero banner */}
      <div className="px-6 py-10 mb-6" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>Home</Link>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <Link to="/categories" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>Categories</Link>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span style={{ color: '#fff', fontSize: 13 }}>{meta.label}</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{meta.label}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{meta.desc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search + count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm" style={{ color: '#64748b' }}>
            <strong style={{ color: '#0ea5e9' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} size={12} />
            <input type="text" className="input-light pl-9 text-sm" placeholder={`Search ${meta.label}…`}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shop-card">
                <div className="shimmer h-48 w-full" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-4 w-1/2 rounded" />
                  <div className="shimmer h-9 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 rounded-3xl" style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
            <div className="text-5xl mb-4">{meta.icon}</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>No products found</h3>
            <p className="mb-5" style={{ color: '#64748b' }}>
              {search ? `No results for "${search}"` : `No ${meta.label} products yet.`}
            </p>
            <Link to="/" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const inWishlist = wishlistIds.has(product._id);
              return (
                <div key={product._id} className="shop-card group fade-in relative">
                  <button onClick={() => toggleWishlist(product._id)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: inWishlist ? '#fef2f2' : 'rgba(255,255,255,0.9)',
                      color: inWishlist ? '#ef4444' : '#94a3b8',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      border: inWishlist ? '1.5px solid #fecaca' : '1.5px solid #e2e8f0',
                    }}>
                    {inWishlist ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
                  </button>

                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <Link to={`/products/${product._id}`}>
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
                    </Link>
                    {product.old_price && (
                      <div className="absolute top-2 left-2">
                        <span className="badge-sale">-{Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 truncate" style={{ color: '#1e293b' }}>{product.name}</h3>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar key={i} size={10} className={i < Math.round(product.stars || 0) ? 'star-filled' : 'star-empty'} />
                      ))}
                      <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>({product.reviews?.length || 0})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-base sky-text">${product.new_price}</span>
                      {product.old_price && <span className="text-xs line-through" style={{ color: '#94a3b8' }}>${product.old_price}</span>}
                    </div>
                    <button onClick={() => addToCart(product._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-all"
                      style={addedId === product._id
                        ? { background: '#10b981', color: '#fff' }
                        : { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff' }
                      }>
                      <FaShoppingCart size={11} />
                      {addedId === product._id ? '✓ Added!' : 'Add to Cart'}
                    </button>
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

export default CategoryPage;

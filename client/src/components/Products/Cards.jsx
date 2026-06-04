import API from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';

const Cards = () => {
  const [searchTerm, setSearchTerm]       = useState('');
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [addedId, setAddedId]             = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlistIds, setWishlistIds]     = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(new Set());

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch {
        setError('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user's wishlist IDs so hearts show correctly
  useEffect(() => {
    if (!user?._id) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API}/api/wishlist/${user._id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setWishlistIds(new Set(data.map(item => item.productId?._id || item.productId)));
        }
      } catch {}
    };
    fetchWishlist();
  }, [user?._id]);

  const addToCart = async (productId) => {
    if (!user?._id) { alert('Please log in to add items to cart.'); return; }
    try {
      const res = await fetch(`${API}/api/cart/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000);
    } catch {
      alert('Please log in to add items to cart.');
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user?._id) { alert('Please log in to save items.'); return; }
    setWishlistLoading(prev => new Set(prev).add(productId));
    try {
      if (wishlistIds.has(productId)) {
        // Remove
        await fetch(`${API}/api/wishlist/${user._id}/${productId}`, { method: 'DELETE' });
        setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        // Add
        await fetch(`${API}/api/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId }),
        });
        setWishlistIds(prev => new Set(prev).add(productId));
      }
    } catch {}
    finally {
      setWishlistLoading(prev => { const s = new Set(prev); s.delete(productId); return s; });
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const isVisible       = !p.status || p.status === 'active';
    return matchesSearch && matchesCategory && isVisible;
  });

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shop-card">
          <div className="shimmer h-52 w-full" />
          <div className="p-4 space-y-2">
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="shimmer h-4 w-1/2 rounded" />
            <div className="shimmer h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">⚠️</div>
      <p style={{ color: '#ef4444' }}>{error}</p>
    </div>
  );

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} size={13} />
          <input type="text" className="input-light pl-10" placeholder="Search products…"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200"
              style={activeCategory === cat
                ? { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }
                : { background: '#fff', color: '#64748b', border: '2px solid #e0f2fe' }
              }>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm mb-5" style={{ color: '#64748b' }}>
        Showing <strong style={{ color: '#0ea5e9' }}>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p style={{ color: '#94a3b8' }}>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const inWishlist = wishlistIds.has(product._id);
            const wishlistBusy = wishlistLoading.has(product._id);
            return (
              <div key={product._id} className="shop-card group fade-in relative">

                {/* ── Wishlist heart button ── */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  disabled={wishlistBusy}
                  title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: inWishlist ? '#fef2f2' : 'rgba(255,255,255,0.9)',
                    color: inWishlist ? '#ef4444' : '#94a3b8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    border: inWishlist ? '1.5px solid #fecaca' : '1.5px solid #e2e8f0',
                  }}
                >
                  {wishlistBusy
                    ? <span style={{ fontSize: 9 }}>…</span>
                    : inWishlist
                      ? <FaHeart size={12} />
                      : <FaRegHeart size={12} />
                  }
                </button>

                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 230 }}>
                  <Link to={`/products/${product._id}`}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x230?text=No+Image'; }} />
                  </Link>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(14,165,233,0.15)' }}>
                    <Link to={`/products/${product._id}`}
                      className="px-4 py-2 rounded-full text-xs font-bold"
                      style={{ background: '#fff', color: '#0ea5e9', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      Quick View
                    </Link>
                  </div>
                  {/* Sale badge */}
                  {product.old_price && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-sale">
                        -{Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="badge capitalize mb-1" style={{ fontSize: 10 }}>{product.category}</span>
                  <h3 className="font-semibold text-sm mb-1 truncate mt-1" style={{ color: '#1e293b' }}>
                    {product.name}
                  </h3>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} size={10} className={i < Math.round(product.stars || 0) ? 'star-filled' : 'star-empty'} />
                    ))}
                    <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>({product.reviews?.length || 0})</span>
                  </div>
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-base sky-text">${product.new_price}</span>
                    {product.old_price && (
                      <span className="text-xs line-through" style={{ color: '#94a3b8' }}>${product.old_price}</span>
                    )}
                  </div>
                  {/* Add to Cart */}
                  <button onClick={() => addToCart(product._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-all duration-300"
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
  );
};

export default Cards;

import API from '../../config/api.js';
import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaArrowRight } from 'react-icons/fa';

const CategorySection = ({ categoryName, products, icon }) => {
  const [addedId, setAddedId]         = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const user = JSON.parse(localStorage.getItem('user'));

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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId }),
        });
        setWishlistIds(prev => new Set(prev).add(productId));
      }
    } catch {}
  };

  if (!products || products.length === 0) return null;

  // Show max 4 on home page
  const displayed = products.slice(0, 4);

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #e0f2fe, #ddd6fe)' }}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}>{categoryName}</h2>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{products.length} item{products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Link
          to={`/category/${categoryName.toLowerCase()}`}
          className="flex items-center gap-1.5 text-sm font-semibold transition-all"
          style={{ color: '#0ea5e9', textDecoration: 'none' }}
        >
          View All <FaArrowRight size={11} />
        </Link>
      </div>

      {/* Divider line */}
      <div className="mb-5" style={{ height: 2, background: 'linear-gradient(90deg, #0ea5e9, #6366f1, transparent)', borderRadius: 2 }} />

      {/* Product Grid — 4 per row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayed.map((product) => {
          const inWishlist = wishlistIds.has(product._id);
          return (
            <div key={product._id} className="shop-card group fade-in relative">
              {/* Wishlist heart */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: inWishlist ? '#fef2f2' : 'rgba(255,255,255,0.9)',
                  color: inWishlist ? '#ef4444' : '#94a3b8',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  border: inWishlist ? '1.5px solid #fecaca' : '1.5px solid #e2e8f0',
                }}
              >
                {inWishlist ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
              </button>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: 180 }}>
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                  />
                </Link>
                {product.old_price && (
                  <div className="absolute top-2 left-2">
                    <span className="badge-sale" style={{ fontSize: 9 }}>
                      -{Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-xs mb-1 truncate" style={{ color: '#1e293b' }}>
                  {product.name}
                </h3>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} size={9} className={i < Math.round(product.stars || 0) ? 'star-filled' : 'star-empty'} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>({product.reviews?.length || 0})</span>
                </div>
                {/* Price */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="font-bold text-sm sky-text">${product.new_price}</span>
                  {product.old_price && (
                    <span className="text-xs line-through" style={{ color: '#94a3b8' }}>${product.old_price}</span>
                  )}
                </div>
                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all"
                  style={addedId === product._id
                    ? { background: '#10b981', color: '#fff' }
                    : { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff' }
                  }
                >
                  <FaShoppingCart size={9} />
                  {addedId === product._id ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;

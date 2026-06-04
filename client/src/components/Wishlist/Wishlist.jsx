import API from '../../config/api.js';
import React, { useEffect, useState, useCallback } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/wishlist/${user._id}`);
      const data = await res.json();
      setWishlist(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchWishlist();
  }, [fetchWishlist, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFromWishlist = async (productId) => {
    setRemovingId(productId);
    try {
      await fetch(`${API}/api/wishlist/${user._id}/${productId}`, { method: 'DELETE' });
      setWishlist((prev) => prev.filter((item) => item.productId?._id !== productId));
    } catch (e) {
      console.error(e);
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (productId) => {
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
      alert('Failed to add to cart.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="badge mb-2">Saved Items</span>
            <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
              My <span className="sky-text">Wishlist</span>
            </h1>
          </div>
          {wishlist.length > 0 && (
            <span className="text-sm font-semibold px-4 py-2 rounded-full"
              style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 rounded-3xl"
            style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
            <FaHeart size={56} className="mx-auto mb-5" style={{ color: '#fecdd3' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>Your wishlist is empty</h2>
            <p className="mb-6" style={{ color: '#64748b' }}>
              Browse products and click the ♡ heart to save items here.
            </p>
            <Link to="/products" className="btn-primary">Browse Products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id} className="shop-card group fade-in relative">
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    disabled={removingId === product._id}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    title="Remove from wishlist"
                  >
                    {removingId === product._id
                      ? <span className="text-xs">…</span>
                      : <FaHeart size={13} />
                    }
                  </button>

                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 210 }}>
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x210?text=No+Image'; }}
                      />
                    </Link>
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
                        <FaStar key={i} size={10}
                          className={i < Math.round(product.stars || 0) ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-base sky-text">${product.new_price}</span>
                      {product.old_price && (
                        <span className="text-xs line-through" style={{ color: '#94a3b8' }}>
                          ${product.old_price}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-all"
                        style={
                          addedId === product._id
                            ? { background: '#10b981', color: '#fff' }
                            : { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff' }
                        }
                      >
                        <FaShoppingCart size={10} />
                        {addedId === product._id ? '✓ Added!' : 'Add to Cart'}
                      </button>
                    </div>

                    {/* Saved date */}
                    <p className="text-xs mt-2 text-center" style={{ color: '#94a3b8' }}>
                      Saved {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
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

export default Wishlist;

import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';

const ProductDetails = () => {
  const { ProductId } = useParams();
  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [added, setAdded]             = useState(false);
  const [inWishlist, setInWishlist]   = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [reviewForm, setReviewForm]   = useState({ username: '', comment: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${ProductId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [ProductId]);

  // Check wishlist status
  useEffect(() => {
    if (!user?._id || !ProductId) return;
    const checkWishlist = async () => {
      try {
        const res = await fetch(`${API}/api/wishlist/check/${user._id}/${ProductId}`);
        const data = await res.json();
        setInWishlist(data.inWishlist);
      } catch {}
    };
    checkWishlist();
  }, [ProductId, user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async () => {
    if (!user?._id) { alert('Please log in to add items to cart.'); return; }
    try {
      const res = await fetch(`${API}/api/cart/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: ProductId, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      alert('Please log in to add items to cart.');
    }
  };

  const toggleWishlist = async () => {
    if (!user?._id) { alert('Please log in to save items.'); return; }
    setWishlistBusy(true);
    try {
      if (inWishlist) {
        await fetch(`${API}/api/wishlist/${user._id}/${ProductId}`, { method: 'DELETE' });
        setInWishlist(false);
      } else {
        await fetch(`${API}/api/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId: ProductId }),
        });
        setInWishlist(true);
      }
    } catch {}
    finally { setWishlistBusy(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user?._id) { alert('Please log in to submit a review.'); return; }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API}/api/products/${ProductId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewForm({ username: '', comment: '', rating: 5 });
        // Refresh product to show new review
        const updated = await fetch(`${API}/api/products/${ProductId}`);
        const data = await updated.json();
        setProduct(data);
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch {}
    finally { setSubmittingReview(false); }
  };

  const renderStars = (count, total = 5) =>
    Array.from({ length: total }, (_, i) =>
      i < count
        ? <FaStar key={i} size={14} className="star-filled" />
        : <FaRegStar key={i} size={14} className="star-empty" />
    );

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  // ── Not found ──
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>Product not found</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">← Back to Products</Link>
      </div>
    </div>
  );

  const discountPct = product.old_price
    ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
    : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: '#94a3b8' }}>
          <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span className="truncate" style={{ color: '#1e293b', maxWidth: 200 }}>{product.name}</span>
        </div>

        {/* ── Main Product Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 8px 32px rgba(14,165,233,0.1)' }}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover"
                style={{ maxHeight: 480 }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/480?text=No+Image'; }}
              />
            </div>
            {/* Discount badge */}
            {discountPct && (
              <div className="absolute top-4 left-4">
                <span className="badge-sale text-sm px-3 py-1">-{discountPct}% OFF</span>
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-4 right-4">
              <span className="badge capitalize">{product.category}</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Title */}
              <h1 className="text-3xl font-bold mb-3" style={{ color: '#1e293b' }}>
                {product.name}
              </h1>

              {/* Stars + review count */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {renderStars(Math.round(product.stars || 0))}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#0ea5e9' }}>
                  {(product.stars || 0).toFixed(1)}
                </span>
                <span className="text-sm" style={{ color: '#94a3b8' }}>
                  ({product.reviews?.length || 0} review{product.reviews?.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold sky-text">${product.new_price}</span>
                {product.old_price && (
                  <span className="text-xl line-through" style={{ color: '#94a3b8' }}>
                    ${product.old_price}
                  </span>
                )}
                {discountPct && (
                  <span className="text-sm font-bold px-2 py-1 rounded-full"
                    style={{ background: '#fef3c7', color: '#d97706' }}>
                    Save {discountPct}%
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full"
                  style={{ background: product.status === 'active' ? '#10b981' : '#ef4444' }} />
                <span className="text-sm font-medium capitalize"
                  style={{ color: product.status === 'active' ? '#10b981' : '#ef4444' }}>
                  {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Rating',   value: `${(product.stars || 0).toFixed(1)} / 5.0` },
                  { label: 'Reviews',  value: product.reviews?.length || 0 },
                  { label: 'Status',   value: product.status === 'active' ? 'Available' : 'Unavailable' },
                ].map((info) => (
                  <div key={info.label} className="rounded-xl p-3"
                    style={{ background: '#f8fbff', border: '1px solid #e0f2fe' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#94a3b8' }}>
                      {info.label}
                    </p>
                    <p className="text-sm font-semibold capitalize" style={{ color: '#1e293b' }}>
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addToCart}
                disabled={product.status !== 'active'}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-300"
                style={
                  added
                    ? { background: '#10b981', color: '#fff' }
                    : product.status !== 'active'
                      ? { background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }
                      : { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }
                }
              >
                <FaShoppingCart size={18} />
                {added ? '✓ Added to Cart!' : product.status !== 'active' ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={toggleWishlist}
                disabled={wishlistBusy}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
                style={
                  inWishlist
                    ? { background: '#fef2f2', color: '#ef4444', border: '2px solid #fecaca' }
                    : { background: '#fff', color: '#64748b', border: '2px solid #e0f2fe' }
                }
              >
                {wishlistBusy
                  ? <span>…</span>
                  : inWishlist
                    ? <><FaHeart size={15} /> Saved to Wishlist</>
                    : <><FaRegHeart size={15} /> Save to Wishlist</>
                }
              </button>

              <Link to="/products"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{ background: '#f0f9ff', color: '#0ea5e9', textDecoration: 'none', border: '1px solid #bae6fd' }}>
                <FaArrowLeft size={12} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Existing Reviews */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>
                Customer <span className="sky-text">Reviews</span>
              </h2>
              <span className="badge">{product.reviews?.length || 0} reviews</span>
            </div>

            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-12 rounded-2xl"
                style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
                <div className="text-4xl mb-3">💬</div>
                <p style={{ color: '#94a3b8' }}>No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review, i) => (
                  <div key={i} className="rounded-2xl p-5 fade-in"
                    style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 8px rgba(14,165,233,0.05)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                          {review.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#1e293b' }}>
                            {review.username}
                          </p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: '#475569', lineHeight: 1.6 }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div>
            <h2 className="text-2xl font-bold mb-5" style={{ color: '#1e293b' }}>
              Write a <span className="sky-text">Review</span>
            </h2>
            <div className="rounded-2xl p-6"
              style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)' }}>

              {reviewSuccess && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                  ✓ Review submitted successfully!
                </div>
              )}

              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5"
                    style={{ color: '#64748b' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.username}
                    onChange={(e) => setReviewForm(f => ({ ...f, username: e.target.value }))}
                    className="input-light"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5"
                    style={{ color: '#64748b' }}>Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        {star <= reviewForm.rating
                          ? <FaStar className="star-filled" />
                          : <FaRegStar className="star-empty" />
                        }
                      </button>
                    ))}
                    <span className="text-sm font-semibold ml-2" style={{ color: '#0ea5e9' }}>
                      {reviewForm.rating}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5"
                    style={{ color: '#64748b' }}>Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    className="input-light resize-none"
                    placeholder="Share your experience with this product…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary w-full py-3"
                  style={{ opacity: submittingReview ? 0.6 : 1, cursor: submittingReview ? 'not-allowed' : 'pointer' }}
                >
                  {submittingReview ? 'Submitting…' : '⭐ Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

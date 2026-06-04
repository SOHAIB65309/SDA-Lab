import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        if (!u) throw new Error('User not logged in');
        setUser(u);
        const res = await fetch(`${API}/api/cart/${u._id}`);
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, newQty, productId) => {
    if (newQty < 1 || !user) return;
    try {
      await fetch(`${API}/api/cart/update/${user._id}/${productId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      setCartItems(prev => prev.map(item => item._id === itemId ? { ...item, quantity: newQty } : item));
    } catch {}
  };

  const removeItem = async (itemId, productId) => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      await fetch(`${API}/api/cart/delete/${u._id}/${productId}`, { method: 'DELETE' });
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    } catch {}
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="text-center">
        <p style={{ color: '#ef4444' }}>{error}</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="badge mb-2">Your Cart</span>
          <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
            Shopping <span className="sky-text">Cart</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 rounded-3xl" style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
            <FaShoppingBag size={56} className="mx-auto mb-5" style={{ color: '#bae6fd' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>Your cart is empty</h2>
            <p className="mb-6" style={{ color: '#64748b' }}>Add some products to get started!</p>
            <Link to="/" className="btn-primary">Browse Products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 rounded-2xl fade-in"
                  style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 8px rgba(14,165,233,0.06)' }}>
                  <img src={item.productId.image} alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=?'; }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate mb-0.5" style={{ color: '#1e293b' }}>{item.productId.name}</h3>
                    <p className="text-xs capitalize mb-3" style={{ color: '#94a3b8' }}>{item.productId.category}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {/* Qty */}
                      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '2px solid #e0f2fe' }}>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1, item.productId._id)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: '#0ea5e9' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f9ff')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <FaMinus size={9} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold" style={{ color: '#1e293b' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1, item.productId._id)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: '#0ea5e9' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f9ff')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <FaPlus size={9} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold sky-text">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(item._id, item.productId._id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                          style={{ background: '#fef2f2', color: '#ef4444' }}>
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-6 sticky top-20" style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)' }}>
                <h2 className="text-lg font-bold mb-5" style={{ color: '#1e293b' }}>Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm" style={{ color: '#64748b' }}>
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#64748b' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                  </div>
                </div>
                <div className="divider" />
                <div className="flex justify-between font-bold text-lg mb-5">
                  <span style={{ color: '#1e293b' }}>Total</span>
                  <span className="sky-text">${total.toFixed(2)}</span>
                </div>
                <button onClick={() => navigate('/checkout')} className="btn-primary w-full text-center py-3">
                  Checkout →
                </button>
                <Link to="/" className="block text-center text-sm mt-3" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

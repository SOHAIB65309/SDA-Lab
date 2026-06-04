import API from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { FaLock, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';

const Checkout = () => {
  const [cartItems, setCartItems]       = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: '',
  });
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser]           = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const userFromStorage = JSON.parse(localStorage.getItem('user'));
        if (!userFromStorage) throw new Error('User not logged in');
        setUser(userFromStorage);
        const response = await fetch(`${API}/api/cart/${userFromStorage._id}`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        setCartItems(data.cart || []);
      } catch (err) {
        console.error('Cart fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, shippingAddress, products: cartItems }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }
      const data = await response.json();
      if (data.sessionId) {
        const stripe = await loadStripe('pk_test_51QYRXlE3JNgEVNcoMUqOQzaEThK4CMOHycKNtXJ63i9dcf7UtzVggP8l0bWJvpl3Uyi1jPb72D17Z3oZmD1tUzPN00gPZjvL7w');
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (error) throw new Error(error.message);
      } else {
        throw new Error('Session ID not received.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="text-center">
        <p style={{ color: '#64748b' }}>Please log in to checkout.</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">Sign In</Link>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#f0f7ff' }}>
      <div className="text-center">
        <FaShoppingBag size={48} className="mx-auto mb-4" style={{ color: '#bae6fd' }} />
        <p className="font-semibold mb-2" style={{ color: '#1e293b' }}>Your cart is empty</p>
        <Link to="/products" className="btn-primary mt-2 inline-block">Browse Products</Link>
      </div>
    </div>
  );

  const addressFields = [
    { name: 'street',     placeholder: '123 Main Street',  label: 'Street Address' },
    { name: 'city',       placeholder: 'New York',          label: 'City' },
    { name: 'state',      placeholder: 'NY',                label: 'State / Province' },
    { name: 'postalCode', placeholder: '10001',             label: 'Postal Code' },
    { name: 'country',    placeholder: 'United States',     label: 'Country' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="badge mb-2">Secure Checkout</span>
          <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
            Complete Your <span className="sky-text">Order</span>
          </h1>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Shipping + Items ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping Address */}
              <div className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 12px rgba(14,165,233,0.06)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e0f2fe' }}>
                    <FaMapMarkerAlt style={{ color: '#0ea5e9' }} size={14} />
                  </div>
                  <h2 className="text-lg font-bold" style={{ color: '#1e293b' }}>Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addressFields.map((f) => (
                    <div key={f.name} className={f.name === 'street' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5"
                        style={{ color: '#64748b' }}>
                        {f.label}
                      </label>
                      <input
                        type="text"
                        name={f.name}
                        placeholder={f.placeholder}
                        value={shippingAddress[f.name]}
                        onChange={handleInputChange}
                        className="input-light"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Items Preview */}
              <div className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#1e293b' }}>
                  Items ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img
                        src={item.productId?.image}
                        alt={item.productId?.name}
                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=?'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: '#1e293b' }}>
                          {item.productId?.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm sky-text">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-6 sticky top-24"
                style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)' }}>
                <h2 className="text-lg font-bold mb-5" style={{ color: '#1e293b' }}>Order Summary</h2>

                {/* Line items */}
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="truncate mr-2" style={{ color: '#64748b' }}>
                        {item.productId?.name} ×{item.quantity}
                      </span>
                      <span className="flex-shrink-0 font-medium" style={{ color: '#1e293b' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#64748b' }}>Shipping</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                </div>

                <div className="flex justify-between font-bold text-xl mb-6">
                  <span style={{ color: '#1e293b' }}>Total</span>
                  <span className="sky-text">${totalAmount.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 btn-primary transition-all duration-300"
                  style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  <FaLock size={12} />
                  {submitting ? 'Processing…' : 'Pay Securely →'}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <FaLock size={10} style={{ color: '#94a3b8' }} />
                  <span className="text-xs" style={{ color: '#94a3b8' }}>256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

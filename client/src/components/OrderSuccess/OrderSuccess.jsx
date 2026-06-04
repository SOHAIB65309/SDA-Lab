import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f7ff 100%)' }}>
      <div className="text-center max-w-md w-full rounded-3xl p-10 fade-in"
        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(14,165,233,0.15)', border: '1px solid #e0f2fe',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease' }}>

        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <path d="M10 24L20 34L38 14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 50, strokeDashoffset: visible ? 0 : 50, transition: 'stroke-dashoffset 0.8s ease 0.3s' }} />
          </svg>
        </div>

        <span className="badge mb-4">Order Confirmed</span>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e293b' }}>Thank You!</h1>
        <p className="font-semibold mb-2 sky-text">Your order was placed successfully</p>
        <p className="text-sm mb-8" style={{ color: '#64748b' }}>
          We've received your order and will begin processing it shortly.
        </p>

        <div className="divider" />
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile" className="btn-outline text-sm text-center">View Orders</Link>
          <Link to="/" className="btn-primary text-sm text-center">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

import API from '../../config/api.js';
import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';

// Helper — where should this role go after auth?
const roleHome = (role) => (role === 'admin' ? '/admin' : '/');

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect immediately based on role
  const existingUser = JSON.parse(localStorage.getItem('user'));
  if (existingUser && localStorage.getItem('auth-token')) {
    return <Navigate to={roleHome(existingUser.role)} replace />;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user-role', data.user.role);
        // New signups are always 'user' role → go to home
        navigate(roleHome(data.user.role), { replace: true });
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f7ff 100%)' }}
    >
      <div
        className="fixed rounded-full pointer-events-none opacity-30"
        style={{ width: 350, height: 350, background: 'radial-gradient(circle, #ddd6fe, transparent)', bottom: '5%', left: '5%' }}
      />

      <div
        className="w-full max-w-md rounded-3xl p-8 fade-in"
        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(14,165,233,0.15)', border: '1px solid #e0f2fe' }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
          >
            S
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Join ShopEase and start shopping</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-light"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-light"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-light"
              placeholder="Min. 6 characters"
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-3"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center text-sm" style={{ color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

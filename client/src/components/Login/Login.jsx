import { apiFetch } from '../../config/api.js';
import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';

const roleHome = (role) => (role === 'admin' ? '/admin' : '/');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const existingUser = JSON.parse(localStorage.getItem('user'));
  if (existingUser && localStorage.getItem('auth-token')) {
    return <Navigate to={roleHome(existingUser.role)} replace />;
  }

  const from = location.state?.from || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-role', data.user.role);
        navigate(from || roleHome(data.user.role), { replace: true });
      } else if (response.status === 503) {
        setError('Database connect nahi hai. Server terminal check karein — MongoDB Atlas + internet.');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('is ke maa ka aaaaaaaaaaaaaaaaaaaaa');
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
        className="absolute rounded-full pointer-events-none opacity-30"
        style={{ width: 400, height: 400, background: 'radial-gradient(circle, #bae6fd, transparent)', top: '5%', right: '5%' }}
      />

      <div
        className="w-full max-w-md rounded-3xl p-8 fade-in relative z-10"
        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(14,165,233,0.15)', border: '1px solid #e0f2fe' }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
          >
            S
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Welcome Back!</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to your ShopEase account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}
            >
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs" style={{ color: '#94a3b8' }}>
          🛡️ Admins are redirected to the Admin Panel automatically
        </p>
        <p className="text-center mt-3 text-sm" style={{ color: '#64748b' }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaCog, FaHeart, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api.js';
const CATEGORIES = [
  { slug: 'clothing',    label: 'Clothing',     icon: '👕' },
  { slug: 'electronics', label: 'Electronics',  icon: '💻' },
  { slug: 'shoes',       label: 'Shoes',        icon: '👟' },
  { slug: 'watches',     label: 'Watches',      icon: '⌚' },
  { slug: 'mobiles',     label: 'Mobiles',      icon: '📱' },
  { slug: 'gaming',      label: 'Gaming',       icon: '🎮' },
  { slug: 'accessories', label: 'Accessories',  icon: '👜' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [catOpen, setCatOpen]               = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || cancelled) return;
        const response = await apiFetch(`/api/cart/${user._id}`, {}, 5000);
        if (!response.ok || cancelled) return;
        const data = await response.json();
        setCartItemsCount(data.cart?.length || 0);
      } catch {}
    };

    fetchCartItems();
    return () => { cancelled = true; };
  }, []);

  const isLoggedIn = !!localStorage.getItem('auth-token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    localStorage.removeItem('user-role');
    navigate('/login');
  };

  const navStyle = {
    background: scrolled ? 'rgba(255,255,255,0.97)' : '#ffffff',
    boxShadow: scrolled ? '0 2px 20px rgba(14,165,233,0.12)' : '0 1px 0 #e0f2fe',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300" style={navStyle}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: 'none' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
              S
            </div>
            <span className="font-bold text-lg sky-text">ShopEase</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">

            <Link to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
              Home
            </Link>

            <Link to="/products"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
              Products
            </Link>

            {/* ── Categories Dropdown ── */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: catOpen ? '#0ea5e9' : '#475569', background: catOpen ? '#f0f9ff' : 'transparent' }}
              >
                Categories
                <FaChevronDown size={10} style={{
                  transform: catOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }} />
              </button>

              {catOpen && (
                <div
                  className="absolute top-full left-0 mt-2 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: '#fff',
                    border: '1px solid #e0f2fe',
                    boxShadow: '0 16px 40px rgba(14,165,233,0.15)',
                    minWidth: 280,
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0f9ff', background: '#f8fbff' }}>
                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>
                      Browse Categories
                    </p>
                  </div>

                  {/* Category list */}
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                        style={{ textDecoration: 'none', color: '#475569' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0f9ff';
                          e.currentTarget.style.color = '#0ea5e9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm font-medium">{cat.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="px-4 py-3" style={{ borderTop: '1px solid #f0f9ff' }}>
                    <Link
                      to="/categories"
                      onClick={() => setCatOpen(false)}
                      className="flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-xl transition-all"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', textDecoration: 'none' }}
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/contact"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
              Contact
            </Link>

            <Link to="/about"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
              About
            </Link>
          </div>

          {/* ── Right Side ── */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm" style={{ color: '#64748b' }}>
                  Hi, <strong style={{ color: '#0ea5e9' }}>{user?.name?.split(' ')[0]}</strong>
                </span>

                <Link to="/cart"
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: '#0ea5e9', background: '#f0f9ff', border: '1.5px solid #bae6fd', textDecoration: 'none' }}>
                  <FaShoppingCart size={13} />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                      style={{ background: '#ef4444', fontSize: 9 }}>
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <Link to="/wishlist"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
                  <FaHeart size={12} /> Wishlist
                </Link>

                <Link to="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
                  <FaUser size={12} /> Profile
                </Link>

                {user?.role === 'admin' && (
                  <a href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', textDecoration: 'none' }}>
                    <FaCog size={12} /> Admin
                  </a>
                )}

                <button onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm" style={{ padding: '9px 20px' }}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button className="md:hidden text-lg" style={{ color: '#0ea5e9' }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-5 pt-2 space-y-1"
          style={{ background: '#fff', borderTop: '1px solid #e0f2fe' }}>

          {[
            { to: '/',         label: 'Home' },
            { to: '/products', label: 'Products' },
            { to: '/contact',  label: 'Contact' },
            { to: '/about',    label: 'About' },
          ].map((link) => (
            <Link key={link.to} to={link.to}
              className="block text-sm font-medium py-2"
              style={{ color: '#475569', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          {/* Mobile Categories */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase py-2" style={{ color: '#94a3b8' }}>
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} to={`/category/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{ color: '#475569', textDecoration: 'none', background: '#f8fbff' }}
                  onClick={() => setMenuOpen(false)}>
                  <span>{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </Link>
              ))}
            </div>
            <Link to="/categories"
              className="block text-center text-xs font-bold py-2 mt-1 rounded-xl"
              style={{ color: '#0ea5e9', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}>
              All Categories →
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #e0f2fe', paddingTop: 8 }}>
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="block py-2 text-sm font-semibold"
                  style={{ color: '#0ea5e9', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  🛒 Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Link>
                <Link to="/wishlist" className="block py-2 text-sm"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  ❤️ Wishlist
                </Link>
                <Link to="/profile" className="block py-2 text-sm"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  👤 Profile
                </Link>
                <Link to="/returns" className="block py-2 text-sm"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  📦 Returns
                </Link>
                {user?.role === 'admin' && (
                  <a href="/admin" className="block py-2 text-sm font-bold"
                    style={{ color: '#0ea5e9' }}
                    onClick={() => setMenuOpen(false)}>
                    ⚙ Admin Panel
                  </a>
                )}
                <button onClick={handleLogout} className="block py-2 text-sm w-full text-left"
                  style={{ color: '#ef4444' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-sm"
                  style={{ color: '#475569', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary block text-center text-sm mt-1"
                  onClick={() => setMenuOpen(false)}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

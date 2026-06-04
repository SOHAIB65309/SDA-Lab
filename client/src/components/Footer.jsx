import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#fff', borderTop: '1px solid #e0f2fe' }}>
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>S</div>
            <span className="font-bold text-lg sky-text">ShopEase</span>
          </div>
          <p className="text-sm" style={{ color: '#64748b', lineHeight: 1.7 }}>
            Your one-stop shop for premium fashion at unbeatable prices.
          </p>
        </div>

        {/* Links */}
        {[
          { title: 'Shop', links: [
              { label: 'All Products',  to: '/products' },
              { label: 'Categories',    to: '/categories' },
              { label: 'New Arrivals',  to: '/products' },
              { label: 'Sale',          to: '/products' },
            ]},
          { title: 'Company', links: [{ label: 'About Us', to: '/about' }, { label: 'Contact', to: '/contact' }] },
          { title: 'Account', links: [
              { label: 'Sign Up',   to: '/signup' },
              { label: 'Login',     to: '/login' },
              { label: 'My Orders', to: '/profile' },
              { label: 'Wishlist',  to: '/wishlist' },
              { label: 'Returns',   to: '/returns' },
              { label: 'Cart',      to: '/cart' },
            ]},
        ].map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-sm mb-4 sky-text tracking-wide">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm transition-colors"
                    style={{ color: '#64748b', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.color = '#0ea5e9')}
                    onMouseLeave={(e) => (e.target.style.color = '#64748b')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid #e0f2fe' }}>
        <p className="text-xs" style={{ color: '#94a3b8' }}>
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Cookies'].map((t) => (
            <button key={t}
              className="text-xs transition-colors bg-transparent border-none cursor-pointer p-0"
              style={{ color: '#94a3b8' }}
              onMouseEnter={(e) => (e.target.style.color = '#0ea5e9')}
              onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

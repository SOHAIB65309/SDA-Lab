import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { slug: 'clothing',    label: 'Clothing',     icon: '👕', color: '#0ea5e9', bg: '#e0f2fe', desc: 'Tops, shirts, dresses & more' },
  { slug: 'electronics', label: 'Electronics',  icon: '💻', color: '#6366f1', bg: '#ede9fe', desc: 'Gadgets, devices & tech' },
  { slug: 'shoes',       label: 'Shoes',        icon: '👟', color: '#f59e0b', bg: '#fef3c7', desc: 'Sneakers, boots & sandals' },
  { slug: 'watches',     label: 'Watches',      icon: '⌚', color: '#10b981', bg: '#d1fae5', desc: 'Luxury & casual timepieces' },
  { slug: 'mobiles',     label: 'Mobiles',      icon: '📱', color: '#ef4444', bg: '#fee2e2', desc: 'Smartphones & accessories' },
  { slug: 'gaming',      label: 'Gaming',       icon: '🎮', color: '#8b5cf6', bg: '#ede9fe', desc: 'Consoles, games & gear' },
  { slug: 'accessories', label: 'Accessories',  icon: '👜', color: '#ec4899', bg: '#fce7f3', desc: 'Bags, belts & more' },
  { slug: 'mens',        label: "Men's",        icon: '👔', color: '#0284c7', bg: '#e0f2fe', desc: "Men's fashion & apparel" },
  { slug: 'womens',      label: "Women's",      icon: '👗', color: '#db2777', bg: '#fce7f3', desc: "Women's fashion & apparel" },
  { slug: 'kids',        label: "Kids'",        icon: '🧒', color: '#d97706', bg: '#fef3c7', desc: "Children's clothing & toys" },
];

const CategoriesPage = () => (
  <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="badge mb-3">Browse By</span>
        <h1 className="text-4xl font-bold" style={{ color: '#1e293b' }}>
          Shop by <span className="sky-text">Category</span>
        </h1>
        <p className="mt-3 text-sm" style={{ color: '#64748b' }}>
          Find exactly what you're looking for
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="shop-card p-5 flex flex-col items-center text-center gap-3 transition-all duration-200 group"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200 group-hover:scale-110"
              style={{ background: cat.bg }}
            >
              {cat.icon}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#1e293b' }}>{cat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{cat.desc}</p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: cat.bg, color: cat.color }}
            >
              Browse →
            </span>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default CategoriesPage;

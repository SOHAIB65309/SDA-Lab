import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaUndo, FaShieldAlt, FaShoppingBag } from 'react-icons/fa';
import HeroSlider from './HeroSlider';
import CategorySection from './Products/CategorySection';
import { apiJson } from '../config/api.js';
// All supported categories with display info
const CATEGORY_CONFIG = [
  { slug: 'clothing',    label: 'Clothing',     icon: '👕' },
  { slug: 'electronics', label: 'Electronics',  icon: '💻' },
  { slug: 'shoes',       label: 'Shoes',        icon: '👟' },
  { slug: 'watches',     label: 'Watches',      icon: '⌚' },
  { slug: 'mobiles',     label: 'Mobiles',      icon: '📱' },
  { slug: 'gaming',      label: 'Gaming',       icon: '🎮' },
  { slug: 'accessories', label: 'Accessories',  icon: '👜' },
  { slug: 'mens',        label: "Men's",        icon: '👔' },
  { slug: 'womens',      label: "Women's",      icon: '👗' },
  { slug: 'kids',        label: "Kids'",        icon: '🧒' },
];

const Home = () => {
  const [allProducts, setAllProducts]   = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const features = [
    { icon: <FaTruck />,       title: 'Free Shipping',  desc: 'On all orders over $50' },
    { icon: <FaUndo />,        title: 'Easy Returns',   desc: '30-day return policy' },
    { icon: <FaShieldAlt />,   title: 'Secure Payment', desc: '100% protected checkout' },
    { icon: <FaShoppingBag />, title: 'Best Prices',    desc: 'Guaranteed lowest prices' },
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const data = await apiJson('/api/products', {}, 8000);
        if (cancelled) return;
        const active = data.filter((p) => p.status === 'active' || !p.status);
        setAllProducts(active);
      } catch (e) {
        console.warn('Products unavailable:', e.message);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  // Group products by category
  const productsByCategory = {};
  allProducts.forEach(p => {
    const cat = p.category?.toLowerCase() || 'other';
    if (!productsByCategory[cat]) productsByCategory[cat] = [];
    productsByCategory[cat].push(p);
  });

  // Build sections: first use CATEGORY_CONFIG order, then any extra categories from DB
  const knownSlugs = CATEGORY_CONFIG.map(c => c.slug);
  const extraCategories = Object.keys(productsByCategory)
    .filter(cat => !knownSlugs.includes(cat) && productsByCategory[cat].length > 0)
    .map(cat => ({ slug: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1), icon: '🛍️' }));

  const allSections = [
    ...CATEGORY_CONFIG.filter(c => productsByCategory[c.slug]?.length > 0),
    ...extraCategories,
  ];

  return (
    <main style={{ background: '#f0f7ff' }}>

      {/* ── HERO SLIDER ── */}
      <HeroSlider />

      {/* ── FEATURES STRIP ── */}
      <section className="py-5 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: '#f0f9ff' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #e0f2fe, #ddd6fe)', color: '#0ea5e9' }}>
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-xs" style={{ color: '#1e293b' }}>{f.title}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY QUICK LINKS ── */}
      <section className="py-6 px-6" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1e293b' }}>
              Shop by <span className="sky-text">Category</span>
            </h2>
            <Link to="/categories" className="text-sm font-semibold" style={{ color: '#0ea5e9', textDecoration: 'none' }}>
              All Categories →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {CATEGORY_CONFIG.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 px-4 py-3 rounded-2xl transition-all duration-200 group"
                style={{ background: '#f0f9ff', border: '1.5px solid #e0f2fe', textDecoration: 'none', minWidth: 72 }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0ea5e9')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e0f2fe')}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-center" style={{ color: '#475569' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS BY CATEGORY ── */}
      <section className="py-8 px-6" style={{ background: '#f0f7ff' }}>
        <div className="max-w-7xl mx-auto">

          {loadingProducts ? (
            /* Skeleton */
            <div>
              {[1, 2].map(s => (
                <div key={s} className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="shimmer w-10 h-10 rounded-xl" />
                    <div className="shimmer h-6 w-32 rounded" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="shop-card">
                        <div className="shimmer h-44 w-full" />
                        <div className="p-3 space-y-2">
                          <div className="shimmer h-3 w-3/4 rounded" />
                          <div className="shimmer h-3 w-1/2 rounded" />
                          <div className="shimmer h-8 w-full rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : allSections.length === 0 ? (
            <div className="text-center py-20 rounded-3xl" style={{ background: '#fff', border: '1px solid #e0f2fe' }}>
              <FaShoppingBag size={48} className="mx-auto mb-4" style={{ color: '#bae6fd' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>No products yet</h3>
              <p style={{ color: '#64748b' }}>Products added by admin will appear here grouped by category.</p>
            </div>
          ) : (
            allSections.map((cat) => (
              <CategorySection
                key={cat.slug}
                categoryName={cat.label}
                products={productsByCategory[cat.slug] || []}
                icon={cat.icon}
              />
            ))
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-12 px-6 mx-4 mb-10 rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <div className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 300, height: 300, background: '#fff', top: -80, right: -60, borderRadius: '50%' }} />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Get 20% Off Your First Order</h2>
          <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Sign up today and unlock exclusive deals and early access to new arrivals.
          </p>
          <Link to="/signup" className="btn-white">Join Free →</Link>
        </div>
      </section>
    </main>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const values = [
    { icon: '✦', title: 'Quality First',   desc: 'We source only the finest materials for lasting style.' },
    { icon: '♻', title: 'Sustainability',  desc: 'Eco-friendly packaging and ethical supply chains.' },
    { icon: '❤', title: 'Customer Love',   desc: 'Every customer matters. We go above and beyond.' },
    { icon: '✶', title: 'Innovation',      desc: 'Blending timeless style with modern design.' },
  ];
  const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO',      initial: 'S' },
    { name: 'Marcus Chen',   role: 'Head of Design',     initial: 'M' },
    { name: 'Aisha Patel',   role: 'Creative Director',  initial: 'A' },
    { name: 'James Wilson',  role: 'Head of Operations', initial: 'J' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: '#f0f7ff' }}>

      {/* Hero */}
      <section className="px-6 py-14 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <div className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 400, height: 400, background: '#fff', top: -100, right: -80, borderRadius: '50%' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Crafting Style Since 2018</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.85)' }}>
            ShopEase was born from a simple belief: everyone deserves to feel extraordinary. We make premium fashion accessible.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['2018', 'Founded'], ['10K+', 'Customers'], ['500+', 'Products'], ['4.9★', 'Rating']].map(([n, l]) => (
            <div key={l} className="text-center py-6 rounded-2xl" style={{ background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
              <div className="text-2xl font-bold sky-text mb-1">{n}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: '#94a3b8' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-6" style={{ background: '#f0f7ff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="badge mb-3">What We Stand For</span>
            <h2 className="text-3xl font-bold" style={{ color: '#1e293b' }}>Our <span className="sky-text">Values</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="shop-card p-5 text-center">
                <div className="text-3xl mb-3" style={{ color: '#0ea5e9' }}>{v.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#1e293b' }}>{v.title}</h3>
                <p className="text-sm" style={{ color: '#64748b', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 px-6" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="badge mb-3">The People Behind ShopEase</span>
            <h2 className="text-3xl font-bold" style={{ color: '#1e293b' }}>Meet Our <span className="sky-text">Team</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((m) => (
              <div key={m.name} className="shop-card p-5 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>{m.initial}</div>
                <p className="font-semibold text-sm" style={{ color: '#1e293b' }}>{m.name}</p>
                <p className="text-xs mt-0.5 sky-text">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 mx-4 rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <div className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 300, height: 300, background: '#fff', bottom: -80, left: -60, borderRadius: '50%' }} />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Shop?</h2>
          <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Explore our latest collection and find your perfect style.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-white">Browse Collection →</Link>
            <Link to="/contact" className="btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

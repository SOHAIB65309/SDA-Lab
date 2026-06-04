import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge mb-3">Get In Touch</span>
          <h1 className="text-4xl font-bold" style={{ color: '#1e293b' }}>
            Contact <span className="sky-text">Us</span>
          </h1>
          <p className="mt-3 text-sm" style={{ color: '#64748b', maxWidth: 400, margin: '12px auto 0' }}>
            Have a question? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: <FaEnvelope />, label: 'Email', value: 'support@shopease.com' },
              { icon: <FaPhone />,   label: 'Phone', value: '+1 (800) 123-4567' },
              { icon: <FaMapMarkerAlt />, label: 'Address', value: '123 Fashion Ave, New York' },
            ].map((info) => (
              <div key={info.label} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 2px 8px rgba(14,165,233,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #e0f2fe, #ddd6fe)', color: '#0ea5e9' }}>
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#94a3b8' }}>{info.label}</p>
                  <p className="text-sm font-medium" style={{ color: '#1e293b' }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-3xl p-7"
            style={{ background: '#fff', border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)' }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ background: '#d1fae5', color: '#10b981' }}>✓</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>Message Sent!</h3>
                <p style={{ color: '#64748b' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="input-light" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="input-light" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} className="input-light" placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                    className="input-light resize-none" placeholder="Tell us more…" required />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <FaPaperPlane size={12} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/api/leads/submit', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800/60 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">GigFlow</span>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-white text-gray-950 font-medium hover:bg-gray-100 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1 text-xs text-gray-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Smart lead management for modern teams
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            Turn interest into
            <br />
            <span className="text-gray-400">opportunity.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
            GigFlow helps sales teams capture, track, and close leads without the noise.
            One dashboard. Every lead. Zero friction.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="px-6 py-3 bg-white text-gray-950 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Get in touch
            </a>
            <Link
              to="/register"
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-900 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-gray-800/60 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">About</p>
              <h2 className="text-3xl font-bold mb-6 leading-snug">
                Built for teams that move fast
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                GigFlow was built as a focused internship project to solve a real problem:
                sales leads get lost. They sit in spreadsheets, email threads, and group chats
                until someone follows up too late or not at all.
              </p>
              <p className="text-gray-400 leading-relaxed">
                This platform gives sales teams a single place to manage every lead from first
                contact to close, with role-based access so everyone sees exactly what they need to.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Lead sources', value: '3 channels' },
                { label: 'Pipeline stages', value: '4 statuses' },
                { label: 'Access roles', value: 'Admin + Sales' },
                { label: 'Export format', value: 'CSV ready' },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-800/60 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-3xl font-bold mb-12">Three steps to a cleaner pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Lead comes in',
                desc: 'A visitor fills the contact form on your site. Their info lands directly in the dashboard as a new lead — source tracked automatically.',
              },
              {
                step: '02',
                title: 'Sales team takes over',
                desc: 'Sales users log in, see their leads, update statuses, and work the pipeline. Admins get the full view with filters and search.',
              },
              {
                step: '03',
                title: 'Close and export',
                desc: 'Mark leads as qualified or lost. Admins can export the full lead list to CSV any time for reporting or handoff.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <p className="text-xs text-gray-600 font-mono mb-4">{item.step}</p>
                <h3 className="text-base font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Lead form */}
      <section id="contact" className="border-t border-gray-800/60 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Contact</p>
              <h2 className="text-3xl font-bold mb-4">Interested in GigFlow?</h2>
              <p className="text-gray-400 leading-relaxed">
                Fill in your details and our team will follow up shortly. This form feeds
                directly into our lead dashboard — so you'll see exactly how it works from
                the other side.
              </p>
            </div>
            <div>
              {status === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-green-400">
                  <p className="font-medium mb-1">Thanks for reaching out!</p>
                  <p className="text-sm opacity-80">We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                      Something went wrong. Please try again.
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you're looking for..."
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-white text-gray-950 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <span>GigFlow</span>
          <span>Built for ServiceHive internship assignment</span>
          <Link to="/login" className="hover:text-gray-400 transition-colors">
            Staff login
          </Link>
        </div>
      </footer>

    </div>
  );
};

export default Home;
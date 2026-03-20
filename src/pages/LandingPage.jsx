import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Shield, Zap, Brain, Eye, Banknote, Clock, ArrowRight, ChevronRight, LogIn } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAppContext();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <span style={{ fontSize: 28 }}>⚡</span>
          <h2>TriggerPay</h2>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { loginAdmin(); navigate('/nerve-center'); }} className="btn btn-ghost" style={{ border: 'none' }}>Admin Login</button>
          <Link to="/login" className="btn btn-primary">Worker Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} /> AI-Powered Parametric Insurance
          </div>
          <h1>
            Your Earnings,<br />
            <span className="gradient-text">Always Protected.</span>
          </h1>
          <p>
            India's first AI-powered income protection for gig delivery workers.
            Zero-touch claims. Instant payouts. Powered by real-time weather triggers.
          </p>
          <div className="hero-cta" style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary btn-xl" style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' }}>
                <Shield size={20} /> Worker Access
              </Link>
              <button onClick={() => { loginAdmin(); navigate('/nerve-center'); }} className="btn btn-ghost btn-xl" style={{ backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.2)' }}>
                👨‍💼 Admin Demo
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">₹2.3Cr+</div>
              <div className="hero-stat-label">Income Protected</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">12,000+</div>
              <div className="hero-stat-label">Workers Covered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">&lt; 5 min</div>
              <div className="hero-stat-label">Avg Payout Time</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">98.5%</div>
              <div className="hero-stat-label">Auto-Claim Rate</div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `shieldFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Why TriggerPay?</h2>
        <p>Built specifically for India's gig delivery heroes</p>
        <div className="features-grid">
          {[
            {
              icon: '🌧️', title: 'Parametric Triggers',
              desc: 'Real-time weather, AQI, and event monitoring. Claims auto-initiate when thresholds breach — no forms, no calls.',
              gradient: 'linear-gradient(135deg, #4FC3F7, #29B6F6)', bg: 'rgba(79, 195, 247, 0.12)'
            },
            {
              icon: '🧠', title: 'AI Risk Scoring',
              desc: 'ML-powered premium calculation adapts to your city, zone, and risk profile. Pay only for your actual exposure.',
              gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', bg: 'rgba(139, 92, 246, 0.12)'
            },
            {
              icon: '⚡', title: 'Instant Payouts',
              desc: 'Lost income payouts hit your UPI or bank account within minutes. No waiting, no paperwork.',
              gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', bg: 'rgba(16, 185, 129, 0.12)'
            },
            {
              icon: '🛡️', title: 'Zero-Touch Claims',
              desc: 'Our AI monitors conditions in your zone. When a disruption happens, your claim is auto-filed and processed instantly.',
              gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', bg: 'rgba(245, 158, 11, 0.12)'
            },
            {
              icon: '🔍', title: 'Fraud Detection',
              desc: 'Advanced anomaly detection validates every claim using GPS, weather correlation, and pattern analysis.',
              gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', bg: 'rgba(239, 68, 68, 0.12)'
            },
            {
              icon: '📊', title: 'Smart Dashboard',
              desc: 'Track your protection, earnings saved, and disruption exposure with beautiful real-time analytics.',
              gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', bg: 'rgba(6, 182, 212, 0.12)'
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ '--feature-gradient': f.gradient, '--feature-bg': f.bg }}>
              <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-timeline">
          {[
            { num: '1', title: 'Sign Up in 2 Minutes', desc: 'Select your delivery platform, enter your city and zone. Our AI profiles your risk instantly.' },
            { num: '2', title: 'Get Your Weekly Policy', desc: 'See your personalized weekly premium powered by AI risk scoring. Coverage starts immediately.' },
            { num: '3', title: 'We Monitor 24/7', desc: 'Our Disruption Nerve Center watches weather, AQI, curfews, and events in real-time in your zone.' },
            { num: '4', title: 'Auto-Claim & Instant Payout', desc: 'When a parametric trigger breaches its threshold, a claim is auto-filed, verified by our fraud AI, and payout hits your UPI within minutes.' },
          ].map((s, i) => (
            <div key={i} className="step-item animate-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="step-number">{s.num}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.05))',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
          Ready to Protect Your Earnings?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Join thousands of delivery partners who never worry about weather disruptions again.
        </p>
        <Link to="/onboarding" className="btn btn-primary btn-xl">
          <Shield size={20} /> Start Your Coverage <ChevronRight size={18} />
        </Link>
      </section>
    </div>
  );
}

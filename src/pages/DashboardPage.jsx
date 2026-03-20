import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, FileText, TrendingUp, AlertTriangle, IndianRupee } from 'lucide-react';
import { useAppContext } from '../App';
import { sampleWorkers, samplePolicies, formatCurrency, disruptionTypes } from '../services/mockData';
import { getRiskLevel } from '../services/riskEngine';

export default function DashboardPage() {
  const { currentWorker, claims } = useAppContext();
  const worker = currentWorker || {
    id: '001', name: 'Rajesh Kumar', city: 'Mumbai', platform: 'zomato',
    avgWeeklyEarnings: 5200, riskScore: 72, premiumWeekly: 89,
    maxWeeklyCoverage: 3640,
  };

  const riskLevel = getRiskLevel(worker.riskScore || 72);
  const allMyClaims = (claims || []).filter(c => c.workerId === worker.id);
  const recentClaims = allMyClaims.slice(0, 3);
  const activePolicy = samplePolicies[0];
  const totalProtected = allMyClaims.filter(c => ['paid', 'approved'].includes(c.status)).reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {worker.name?.split(' ')[0]} 👋</h2>
        <p>Here's your income protection overview for this week</p>
      </div>

      {/* Noticeboard */}
      <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.05)' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <div>
            <div className="card-title">📢 Noticeboard & Govt Updates</div>
            <div className="card-subtitle">Approved areas and latest alerts</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-green)', marginBottom: '8px' }}>✅ Approved Coverage Areas</h4>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Central Business District - Full Coverage Active</li>
              <li>Tech Park Area - Full Coverage Active</li>
              <li>Airport Zone - Conditional (Wind excluded)</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-amber)', marginBottom: '8px' }}>🏛️ Govt & System News</h4>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>IMD Alert: Heavy rainfall expected in Western suburbs over next 48h.</li>
              <li>New parametric thresholds synced with Govt AQI nodes.</li>
              <li>Claims &lt; ₹1000 now processed in under 2 minutes.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-primary)', '--stat-bg': 'rgba(59, 130, 246, 0.12)' }}>
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <div className="stat-label">Active Coverage</div>
            <div className="stat-value">{formatCurrency(worker.maxWeeklyCoverage || 3640)}</div>
            <div className="stat-change positive">✓ Active this week</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-success)', '--stat-bg': 'rgba(16, 185, 129, 0.12)' }}>
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Income Protected</div>
            <div className="stat-value">{formatCurrency(totalProtected)}</div>
            <div className="stat-change positive">↑ 24% this month</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-warning)', '--stat-bg': 'rgba(245, 158, 11, 0.12)' }}>
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Total Claims</div>
            <div className="stat-value">{allMyClaims.length}</div>
            <div className="stat-change positive">{allMyClaims.filter(c => c.fraudStatus === 'verified').length} auto-approved</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-purple)', '--stat-bg': 'rgba(139, 92, 246, 0.12)' }}>
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Weekly Premium</div>
            <div className="stat-value">{formatCurrency(worker.premiumWeekly || 89)}</div>
            <div className="stat-change positive">AI optimized</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Active Policy Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><Shield size={16} style={{ color: 'var(--accent-blue)', marginRight: 6, verticalAlign: 'middle' }} /> Active Policy</div>
              <div className="card-subtitle">{activePolicy?.id || 'POL-2026-001'}</div>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="policy-coverage-grid">
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(worker.premiumWeekly || 89)}</div>
              <div className="label">Weekly Premium</div>
            </div>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-green)' }}>{formatCurrency(worker.maxWeeklyCoverage || 3640)}</div>
              <div className="label">Max Coverage</div>
            </div>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-purple)' }}>6</div>
              <div className="label">Trigger Types</div>
            </div>
          </div>
          <Link to="/policy" className="btn btn-ghost btn-sm" style={{ marginTop: 16, width: '100%' }}>
            View Full Policy →
          </Link>
        </div>

        {/* Risk Score Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🧠 AI Risk Profile</div>
              <div className="card-subtitle">{worker.city} • {worker.zone || 'Central Business District'}</div>
            </div>
            <span className={`badge ${worker.riskScore > 60 ? 'badge-warning' : 'badge-success'}`}>
              {riskLevel.emoji} {riskLevel.level}
            </span>
          </div>
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `conic-gradient(${riskLevel.color} ${(worker.riskScore || 72) * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              boxShadow: `0 0 30px ${riskLevel.color}22`,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'var(--bg-card)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: riskLevel.color }}>{worker.riskScore || 72}</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{
              width: `${worker.riskScore || 72}%`,
              background: worker.riskScore > 60 ? 'var(--gradient-warning)' : 'var(--gradient-success)',
            }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            Risk score determines your personalized premium
          </p>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📋 Recent Claims</div>
            <div className="card-subtitle">Auto-filed by TriggerPay AI</div>
          </div>
          <Link to="/claims" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Trigger</th>
                <th>Severity</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Fraud Check</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.map(claim => {
                const dtype = disruptionTypes[claim.triggerType] || {};
                return (
                  <tr key={claim.id}>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{claim.id}</td>
                    <td>
                      <span style={{ marginRight: 6 }}>{dtype.icon}</span>
                      {dtype.label || claim.triggerType}
                    </td>
                    <td>
                      <span className={`badge ${claim.severity === 'critical' ? 'badge-danger' : claim.severity === 'high' ? 'badge-warning' : 'badge-info'}`}>
                        {claim.severity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(claim.amount)}</td>
                    <td>
                      <span className={`badge ${claim.status === 'paid' ? 'badge-success' : claim.status === 'processing' ? 'badge-warning' : 'badge-danger'}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${claim.fraudStatus === 'verified' ? 'badge-success' : claim.fraudStatus === 'flagged' ? 'badge-danger' : 'badge-warning'}`}>
                        {claim.fraudStatus === 'verified' ? '✅' : claim.fraudStatus === 'flagged' ? '🚨' : '⚠️'} {claim.fraudStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

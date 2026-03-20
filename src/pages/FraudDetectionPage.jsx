import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { sampleClaims } from '../services/mockData';
import { analyzeFraud, generateFraudAnalytics, getFraudStatusInfo } from '../services/fraudDetector';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function FraudDetectionPage() {
  const fa = generateFraudAnalytics(sampleClaims);
  const analyzed = useMemo(() => sampleClaims.map(c => ({ ...c, analysis: analyzeFraud(c, sampleClaims, { city: 'Mumbai' }) })), []);
  const heatmap = useMemo(() => Array.from({ length: 49 }, () => Math.random() > 0.85 ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 30)), []);
  const sc = s => s > 60 ? 'var(--accent-red)' : s > 30 ? 'var(--accent-amber)' : 'var(--accent-green)';
  const chartOpts = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#1e293b' } }, scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } } } };

  return (
    <div>
      <div className="page-header"><h2>🔍 Fraud Detection</h2><p>AI-powered anomaly detection across all claims</p></div>
      <div className="stats-grid">
        {[
          { icon: '✅', label: 'Verified', value: fa.verified, accent: 'var(--gradient-success)', change: `${fa.verifiedRate}% rate` },
          { icon: '⚠️', label: 'Under Review', value: fa.reviewed, accent: 'var(--gradient-warning)' },
          { icon: '🚨', label: 'Flagged', value: fa.flagged, accent: 'var(--gradient-danger)', change: `${fa.flaggedRate}% rate` },
          { icon: '🧠', label: 'Avg Fraud Score', value: `${fa.avgFraudScore}/100`, accent: 'var(--gradient-purple)' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-accent': s.accent }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              {s.change && <div className="stat-change positive">{s.change}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card">
          <h3>Verification Status</h3>
          <div style={{ maxWidth: 260, margin: '0 auto' }}>
            <Doughnut data={{ labels: ['Verified', 'Review', 'Flagged'], datasets: [{ data: [fa.verified, fa.reviewed, fa.flagged], backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'], borderWidth: 0, cutout: '70%' }] }} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16 } } } }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Fraud Score by Claim</h3>
          <Bar data={{ labels: sampleClaims.map(c => c.id), datasets: [{ label: 'Score', data: sampleClaims.map(c => c.fraudScore), backgroundColor: sampleClaims.map(c => c.fraudScore > 60 ? 'rgba(239,68,68,0.7)' : c.fraudScore > 30 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)'), borderRadius: 6 }] }} options={chartOpts} />
        </div>
      </div>

      {/* GPS Heatmap */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><div className="card-title">📍 GPS Activity Heatmap</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 8 }}>
          <div /><div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, textAlign: 'center' }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d}</span>)}</div>
          {[0,1,2,3,4,5,6].map(r => (
            <React.Fragment key={r}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', paddingRight: 8 }}>{(r*3+6).toString().padStart(2,'0')}:00</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                {heatmap.slice(r*7, r*7+7).map((v, i) => (
                  <div key={i} className="heatmap-cell" style={{ background: v > 60 ? 'rgba(239,68,68,0.6)' : v > 30 ? 'rgba(245,158,11,0.4)' : v > 10 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.04)', color: v > 30 ? 'white' : 'var(--text-muted)' }}>{v}</div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Analysis Table */}
      <div className="card">
        <div className="card-header"><div className="card-title">🧾 Claim Analysis</div></div>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Score</th><th>Freq</th><th>Location</th><th>Timing</th><th>Weather</th><th>Dup</th><th>Verdict</th></tr></thead>
            <tbody>
              {analyzed.map(c => { const a = c.analysis; const si = getFraudStatusInfo(a.status); return (
                <tr key={c.id}>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{c.id}</td>
                  <td><span style={{ fontWeight: 800, color: sc(a.fraudScore), fontSize: 18 }}>{a.fraudScore}</span><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span></td>
                  <td style={{ color: sc(a.breakdown.claimFrequency) }}>{a.breakdown.claimFrequency}</td>
                  <td style={{ color: sc(a.breakdown.locationMismatch) }}>{a.breakdown.locationMismatch}</td>
                  <td style={{ color: sc(a.breakdown.timingAnomaly) }}>{a.breakdown.timingAnomaly}</td>
                  <td style={{ color: sc(a.breakdown.weatherCorrelation) }}>{a.breakdown.weatherCorrelation}</td>
                  <td style={{ color: sc(a.breakdown.duplicatePattern) }}>{a.breakdown.duplicatePattern}</td>
                  <td><span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600, background: si.bg, color: si.color }}>{si.icon} {si.label}</span></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

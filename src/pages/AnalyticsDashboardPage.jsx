import React, { useState } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';
import { useAppContext } from '../App';
import { weeklyAnalytics, riskDistribution, disruptionBreakdown, formatCurrency, sampleClaims } from '../services/mockData';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler);

const darkChartOpts = {
  responsive: true, maintainAspectRatio: true,
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } }, tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
  scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } } },
};

export default function AnalyticsDashboardPage() {
  const [view, setView] = useState('worker');
  const { currentWorker } = useAppContext();
  const w = currentWorker || { name: 'Rajesh Kumar', avgWeeklyEarnings: 5200, premiumWeekly: 89 };
  const wa = weeklyAnalytics;

  const totalPremiums = wa.premiumsCollected.reduce((a, b) => a + b, 0);
  const totalClaims = wa.claimsPaid.reduce((a, b) => a + b, 0);
  const lossRatio = Math.round((totalClaims / totalPremiums) * 100);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h2>📊 Analytics Dashboard</h2><p>Insights & performance metrics</p></div>
        <div className="analytics-toggle">
          <button className={`analytics-toggle-btn ${view === 'worker' ? 'active' : ''}`} onClick={() => setView('worker')}>👷 Worker View</button>
          <button className={`analytics-toggle-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>🏢 Admin View</button>
        </div>
      </div>

      {view === 'worker' ? (
        <>
          <div className="stats-grid">
            {[
              { icon: '🛡️', label: 'Earnings Protected', value: '₹18,200', accent: 'var(--gradient-primary)', change: '↑ 32% vs last month', pos: true },
              { icon: '💰', label: 'Claims Received', value: formatCurrency(totalClaims), accent: 'var(--gradient-success)', change: '3 this month', pos: true },
              { icon: '📅', label: 'Weeks Covered', value: '12', accent: 'var(--gradient-purple)' },
              { icon: '⭐', label: 'Coverage Score', value: '94/100', accent: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ '--stat-accent': s.accent }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-content">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  {s.change && <div className={`stat-change ${s.pos ? 'positive' : ''}`}>{s.change}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Weekly Earnings Protected</h3>
              <Line data={{ labels: wa.weeks, datasets: [
                { label: 'Premium Paid', data: wa.avgPremium, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
                { label: 'Claims Received', data: wa.claimsPaid.map(v => v / 10), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 },
              ] }} options={darkChartOpts} />
            </div>
            <div className="chart-card">
              <h3>Your Disruption Exposure</h3>
              <Radar data={{ labels: ['Rain', 'Heat', 'AQI', 'Flood', 'Wind', 'Curfew'], datasets: [
                { label: 'Your Risk', data: [72, 58, 85, 40, 30, 15], backgroundColor: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6', pointBackgroundColor: '#3b82f6' },
                { label: 'City Average', data: [55, 65, 70, 50, 35, 20], backgroundColor: 'rgba(139,92,246,0.1)', borderColor: '#8b5cf6', pointBackgroundColor: '#8b5cf6' },
              ] }} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { r: { angleLines: { color: 'rgba(255,255,255,0.08)' }, grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } } }} />
            </div>
            <div className="chart-card">
              <h3>Claims by Disruption Type</h3>
              <Doughnut data={{ labels: disruptionBreakdown.labels, datasets: [{ data: disruptionBreakdown.data, backgroundColor: disruptionBreakdown.colors.map(c => c + 'cc'), borderWidth: 0, cutout: '65%' }] }} options={{ plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12 } } } }} />
            </div>
            <div className="chart-card">
              <h3>Weekly Coverage Timeline</h3>
              <Bar data={{ labels: wa.weeks, datasets: [
                { label: 'Disruption Events', data: wa.disruptionEvents, backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 6 },
                { label: 'Claims Filed', data: wa.fraudDetected.map(v => v + 2), backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 6 },
              ] }} options={darkChartOpts} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="stats-grid">
            {[
              { icon: '💼', label: 'Total Premiums', value: formatCurrency(totalPremiums), accent: 'var(--gradient-primary)', change: '↑ 18% MoM', pos: true },
              { icon: '💸', label: 'Total Payouts', value: formatCurrency(totalClaims), accent: 'var(--gradient-success)' },
              { icon: '📉', label: 'Loss Ratio', value: `${lossRatio}%`, accent: lossRatio > 70 ? 'var(--gradient-danger)' : 'var(--gradient-success)', change: lossRatio > 70 ? 'Above target' : 'Healthy', pos: lossRatio <= 70 },
              { icon: '👥', label: 'Active Workers', value: wa.activeWorkers[wa.activeWorkers.length - 1], accent: 'var(--gradient-purple)', change: '↑ 84% growth', pos: true },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ '--stat-accent': s.accent }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-content">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  {s.change && <div className={`stat-change ${s.pos ? 'positive' : 'negative'}`}>{s.change}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Premiums vs Payouts</h3>
              <Line data={{ labels: wa.weeks, datasets: [
                { label: 'Premiums Collected', data: wa.premiumsCollected, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
                { label: 'Claims Paid', data: wa.claimsPaid, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
              ] }} options={darkChartOpts} />
            </div>
            <div className="chart-card">
              <h3>Worker Growth</h3>
              <Bar data={{ labels: wa.weeks, datasets: [{ label: 'Active Workers', data: wa.activeWorkers, backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 8 }] }} options={darkChartOpts} />
            </div>
            <div className="chart-card">
              <h3>Risk Distribution</h3>
              <Doughnut data={{ labels: riskDistribution.labels, datasets: [{ data: riskDistribution.data, backgroundColor: riskDistribution.colors.map(c => c + 'cc'), borderWidth: 0, cutout: '65%' }] }} options={{ plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12 } } } }} />
            </div>
            <div className="chart-card">
              <h3>Fraud Detection Rate</h3>
              <Bar data={{ labels: wa.weeks, datasets: [
                { label: 'Disruption Events', data: wa.disruptionEvents, backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 6 },
                { label: 'Fraud Detected', data: wa.fraudDetected, backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 6 },
              ] }} options={darkChartOpts} />
            </div>
          </div>

          {/* Predictive Section */}
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header"><div className="card-title">🔮 Next Week Prediction (AI Forecast)</div></div>
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              {[
                { icon: '🌧️', label: 'Rain Probability', value: '68%', desc: 'Mumbai, Chennai zones' },
                { icon: '🔥', label: 'Heat Risk', value: '45%', desc: 'Delhi, Jaipur likely' },
                { icon: '😷', label: 'AQI Alert', value: '72%', desc: 'Delhi NCR region' },
                { icon: '💰', label: 'Expected Payouts', value: '₹14.2K', desc: 'Based on weather models' },
              ].map((p, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{p.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

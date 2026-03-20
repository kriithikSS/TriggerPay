import React from 'react';
import { Shield, Calendar, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../App';
import { samplePolicies, formatCurrency, formatDate, disruptionTypes } from '../services/mockData';
import { calculateWeeklyPremium, getRiskLevel } from '../services/riskEngine';

export default function PolicyPage() {
  const { currentWorker } = useAppContext();
  const worker = currentWorker || {
    name: 'Rajesh Kumar', city: 'Mumbai', zone: 'Central Business District',
    platform: 'zomato', avgWeeklyEarnings: 5200, riskScore: 72, premiumWeekly: 89,
    maxWeeklyCoverage: 3640, joinedDate: '2024-06-15',
  };

  const policy = samplePolicies[0];
  const riskLevel = getRiskLevel(worker.riskScore || 72);
  const premiumResult = calculateWeeklyPremium(worker);

  const triggers = ['heavy_rain', 'extreme_heat', 'flood', 'aqi_hazardous', 'high_wind', 'curfew'];

  return (
    <div>
      <div className="page-header">
        <h2>My Policy</h2>
        <p>Your active income protection coverage</p>
      </div>

      {/* Policy Hero */}
      <div className="policy-hero">
        <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <div style={{
            width: 100, height: 100, borderRadius: 'var(--radius-xl)',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, boxShadow: 'var(--shadow-glow-blue)',
          }}>🛡️</div>
        </div>
        <div className="policy-hero-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h3>Comprehensive Gig Shield</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <p className="policy-id">{policy?.id || 'POL-2026-001'}</p>
          <div className="policy-coverage-grid" style={{ marginTop: 16 }}>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-blue)', fontSize: 24 }}>{formatCurrency(worker.premiumWeekly || 89)}</div>
              <div className="label">Weekly Premium</div>
            </div>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-green)', fontSize: 24 }}>{formatCurrency(worker.maxWeeklyCoverage || 3640)}</div>
              <div className="label">Max Weekly Payout</div>
            </div>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-purple)', fontSize: 24 }}>{policy?.renewalCount || 12}</div>
              <div className="label">Weeks Renewed</div>
            </div>
            <div className="coverage-item">
              <div className="value" style={{ color: 'var(--accent-cyan)', fontSize: 24 }}>{triggers.length}</div>
              <div className="label">Active Triggers</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Premium Breakdown */}
        <div className="premium-breakdown">
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            🧠 AI Premium Breakdown
          </h4>
          {[
            { label: 'Base Premium (1.8% of ₹' + (worker.avgWeeklyEarnings || 5200) + '/week)', value: `₹${premiumResult.breakdown.basePremium}` },
            { label: 'City Risk Adjustment (' + (worker.city || 'Mumbai') + ')', value: `${premiumResult.breakdown.cityRiskAdj >= 0 ? '+' : ''}₹${premiumResult.breakdown.cityRiskAdj}`, cls: premiumResult.breakdown.cityRiskAdj >= 0 ? 'negative' : 'positive' },
            { label: 'Zone Risk Adjustment', value: `${premiumResult.breakdown.zoneRiskAdj >= 0 ? '+' : ''}₹${premiumResult.breakdown.zoneRiskAdj}`, cls: premiumResult.breakdown.zoneRiskAdj >= 0 ? 'negative' : 'positive' },
            { label: 'Historical Disruption Factor', value: `${premiumResult.breakdown.historicalAdj >= 0 ? '+' : ''}₹${premiumResult.breakdown.historicalAdj}`, cls: premiumResult.breakdown.historicalAdj >= 0 ? 'negative' : 'positive' },
            { label: 'AI Loyalty Discount', value: `₹${premiumResult.breakdown.aiDiscount}`, cls: 'positive' },
          ].map((item, i) => (
            <div key={i} className="premium-line">
              <span className="label">{item.label}</span>
              <span className={`value ${item.cls || ''}`}>{item.value}</span>
            </div>
          ))}
          <div className="premium-line total">
            <span className="label">Total Weekly Premium</span>
            <span className="value">{formatCurrency(premiumResult.weeklyPremium)}</span>
          </div>
        </div>

        {/* Covered Disruptions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚡ Covered Disruptions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {triggers.map(t => {
              const dtype = disruptionTypes[t];
              return (
                <div key={t} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{dtype?.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{dtype?.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Threshold: {dtype?.threshold}</div>
                    </div>
                  </div>
                  <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Policy Details */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">📄 Policy Details</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: <Calendar size={18} />, label: 'Start Date', value: formatDate(policy?.startDate || '2026-03-10') },
            { icon: <Calendar size={18} />, label: 'End Date', value: formatDate(policy?.endDate || '2026-06-10') },
            { icon: <RefreshCw size={18} />, label: 'Auto-Renewal', value: 'Enabled' },
            { icon: <Clock size={18} />, label: 'Billing Cycle', value: 'Weekly (Every Monday)' },
            { icon: <Shield size={18} />, label: 'Coverage Type', value: 'Comprehensive' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: 'var(--accent-blue)' }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

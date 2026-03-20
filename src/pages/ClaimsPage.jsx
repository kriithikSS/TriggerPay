import React, { useState } from 'react';
import { useAppContext } from '../App';
import { formatCurrency, formatDate, disruptionTypes } from '../services/mockData';
import { getFraudStatusInfo } from '../services/fraudDetector';
import { processPayoutUPI } from '../services/payoutService';

export default function ClaimsPage() {
  const { currentWorker, claims: contextClaims, addClaim, updateClaim } = useAppContext();
  const worker = currentWorker || { name: 'Rajesh Kumar' };
  const [payoutProcessing, setPayoutProcessing] = useState(null);
  const [payoutResult, setPayoutResult] = useState(null);
  
  const [showManual, setShowManual] = useState(false);
  const [manualType, setManualType] = useState('heavy_rain');
  const [manualAmount, setManualAmount] = useState('');

  const allClaims = worker.role === 'admin' 
    ? [...contextClaims] 
    : contextClaims.filter(c => c.workerId === worker.id);

  const totalPaid = allClaims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const totalClaims = allClaims.length;
  const autoApproved = allClaims.filter(c => c.fraudStatus === 'verified').length;

  const handleProcessPayout = async (claim) => {
    setPayoutProcessing(claim.id);
    const result = await processPayoutUPI(claim, worker);
    if (result.success) {
      updateClaim(claim.id, { status: 'paid', payoutRef: result.transactionId });
    }
    setPayoutResult(result);
    setPayoutProcessing(null);
    setTimeout(() => setPayoutResult(null), 5000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${Date.now().toString(36).toUpperCase()}`,
      policyId: `POL-${worker.id}`,
      workerId: worker.id,
      triggerType: manualType,
      status: 'under_review',
      amount: Number(manualAmount) || 850,
      triggeredAt: new Date().toISOString(),
      severity: 'medium',
      fraudStatus: 'under_review',
      fraudScore: Math.floor(Math.random() * 20) + 40,
      payoutMethod: 'UPI',
      lostHours: Math.floor((Number(manualAmount) || 850) / 120),
    };
    addClaim(newClaim);
    setShowManual(false);
    setManualAmount('');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Claims</h2>
        <p>Auto-filed claims powered by parametric triggers</p>
      </div>

      {worker.role !== 'admin' && (
        <div style={{ marginBottom: 24 }}>
          {!showManual ? (
            <button className="btn btn-ghost" onClick={() => setShowManual(true)}>
              📝 Request Manual Claim
            </button>
          ) : (
            <div className="card" style={{ border: '1px solid var(--accent-blue)' }}>
              <h4 style={{ marginBottom: 16 }}>File a Manual Claim</h4>
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                  <label className="form-label">Disruption Type</label>
                  <select className="form-select" value={manualType} onChange={e => setManualType(e.target.value)}>
                    {Object.keys(disruptionTypes).filter(t => t !== 'coverage_request').map(k => (
                      <option key={k} value={k}>{disruptionTypes[k].label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                  <label className="form-label">Estimated Loss (₹)</label>
                  <input className="form-input" type="number" required placeholder="e.g. 500" value={manualAmount} onChange={e => setManualAmount(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowManual(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-success)' }}>
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Payouts</div>
            <div className="stat-value">{formatCurrency(totalPaid)}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-primary)' }}>
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Total Claims</div>
            <div className="stat-value">{totalClaims}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-purple)' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Auto-Approved</div>
            <div className="stat-value">{autoApproved}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Avg Resolution</div>
            <div className="stat-value">&lt; 5 min</div>
          </div>
        </div>
      </div>

      {/* Processing Claim Animation */}
      {allClaims.some(c => c.status === 'processing') && (
        <div className="claim-processing" style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            Claim in Progress
          </h4>
          <div className="claim-processing-steps">
            {['Trigger Detected', 'Data Validated', 'Fraud Check', 'AI Approval', 'Payout'].map((step, i) => (
              <div key={i} className={`processing-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>
                {i < 3 ? '✅' : i === 3 ? '🔄' : '⏳'} {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claims List */}
      <div className="claims-timeline">
        {allClaims.map((claim, idx) => {
          const dtype = disruptionTypes[claim.triggerType] || {};
          const fraudInfo = getFraudStatusInfo(claim.fraudStatus);

          return (
            <div key={claim.id || idx} className="claim-card animate-in" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="claim-trigger-icon">{dtype.icon || '⚠️'}</div>
              <div className="claim-details">
                <h4>{dtype.label || claim.triggerType} Disruption</h4>
                <div className="claim-meta">
                  <span>🆔 {claim.id}</span>
                  {worker.role === 'admin' && <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>👤 EMP ID: {claim.workerId}</span>}
                  <span>📅 {claim.triggeredAt ? new Date(claim.triggeredAt).toLocaleString('en-IN') : 'N/A'}</span>
                  <span>⏱️ {claim.lostHours || 0} hrs lost</span>
                  <span className={`badge ${claim.severity === 'critical' ? 'badge-danger' : claim.severity === 'high' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: 10 }}>
                    {claim.severity}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                  <span className={`badge ${['paid', 'approved'].includes(claim.status) ? 'badge-success' : ['processing', 'under_review'].includes(claim.status) ? 'badge-warning' : 'badge-danger'}`}>
                    {claim.status}
                  </span>
                  <span style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: 11, fontWeight: 600,
                    background: fraudInfo.bg, color: fraudInfo.color,
                  }}>
                    {fraudInfo.icon} {fraudInfo.label}
                  </span>
                  {claim.payoutRef && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      Ref: {claim.payoutRef}
                    </span>
                  )}
                </div>
              </div>
              <div className="claim-amount">
                <div className="amount" style={{
                  color: ['paid', 'approved'].includes(claim.status) ? 'var(--accent-green)' : claim.status === 'flagged' ? 'var(--accent-red)' : 'var(--accent-amber)',
                }}>
                  {formatCurrency(claim.amount)}
                </div>
                <div className="method">{claim.payoutMethod || 'UPI'}</div>
                {claim.status === 'processing' && worker.role === 'admin' && (
                  <button
                    className="btn btn-success btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => handleProcessPayout(claim)}
                    disabled={payoutProcessing === claim.id}
                  >
                    {payoutProcessing === claim.id ? '⏳ Processing...' : '⚡ Process Payout'}
                  </button>
                )}
                {claim.status === 'under_review' && worker.role === 'admin' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
                      onClick={() => updateClaim(claim.id, { status: 'processing', fraudStatus: 'verified' })}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ flex: 1, padding: '4px 8px', fontSize: 12, color: 'var(--accent-red)', border: '1px solid rgba(244, 67, 54, 0.2)' }}
                      onClick={() => updateClaim(claim.id, { status: 'flagged' })}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
                {['processing', 'under_review'].includes(claim.status) && worker.role !== 'admin' && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    ⏳ Auto-processing...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payout Result Notification */}
      {payoutResult && (
        <div className="auto-claim-notification">
          <h4>✅ Payout Successful!</h4>
          <p>Amount: <strong>{formatCurrency(payoutResult.amount)}</strong></p>
          <p>Method: {payoutResult.method}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
            Txn: {payoutResult.transactionId}
          </p>
          <p style={{ fontSize: 11, marginTop: 4 }}>Arrival: {payoutResult.estimatedArrival}</p>
        </div>
      )}
    </div>
  );
}

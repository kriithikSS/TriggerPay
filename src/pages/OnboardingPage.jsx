import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useAppContext } from '../App';
import { platforms, indianCities, deliveryZones, sampleWorkers } from '../services/mockData';
import { calculateWeeklyPremium, calculateRiskScore, getRiskLevel } from '../services/riskEngine';

export default function OnboardingPage() {
  const { loginWorker, addClaim, registeredWorkers } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    platform: '', empId: '', phone: '', city: '', zone: '',
    avgWeeklyEarnings: '', avgDeliveriesPerWeek: '',
  });
  const [riskResult, setRiskResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 4;

  const handlePlatformSelect = (platformId) => {
    setFormData(prev => ({ ...prev, platform: platformId }));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goNext = () => {
    if (step === 2) {
      // Check if user already exists
      const existingWorker = sampleWorkers.find(w => w.id === formData.empId) || (registeredWorkers || []).find(w => w.id === formData.empId);
      if (existingWorker) {
        loginWorker(existingWorker);
        navigate('/dashboard');
        return;
      }

      // Start AI risk calculation
      setStep(3);
      setIsCalculating(true);
      setTimeout(() => {
        const result = calculateWeeklyPremium({
          ...formData,
          avgWeeklyEarnings: Number(formData.avgWeeklyEarnings) || 4000,
        });
        setRiskResult(result);
        setIsCalculating(false);
      }, 2500);
    } else if (step === 4) {
      // Complete onboarding
      const worker = {
        id: formData.empId || `WRK-${Date.now()}`,
        name: formData.empId ? `EMP ${formData.empId}` : 'Worker',
        ...formData,
        avgWeeklyEarnings: Number(formData.avgWeeklyEarnings) || 4000,
        avgDeliveriesPerWeek: Number(formData.avgDeliveriesPerWeek) || 80,
        riskScore: riskResult?.riskScore || 50,
        premiumWeekly: riskResult?.weeklyPremium || 75,
        maxWeeklyCoverage: riskResult?.maxWeeklyCoverage || 3000,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      
      addClaim({
        id: `REQ-${Date.now().toString(36).toUpperCase()}`,
        policyId: `POL-${Date.now().toString(36).toUpperCase()}`,
        workerId: formData.empId,
        triggerType: 'coverage_request',
        status: 'approved',
        amount: riskResult?.maxWeeklyCoverage || 3000,
        triggeredAt: new Date().toISOString(),
        severity: 'info',
        fraudStatus: 'verified',
        fraudScore: parseInt(riskResult?.riskScore) || 30,
        payoutMethod: 'System',
        lostHours: 0
      });

      loginWorker(worker);
      navigate('/dashboard');
    } else {
      setStep(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const goBack = () => setStep(prev => Math.max(1, prev - 1));

  const canProceed = () => {
    if (step === 1) return formData.platform !== '';
    if (step === 2) return formData.empId && formData.city;
    return true;
  };

  const riskLevel = riskResult ? getRiskLevel(riskResult.riskScore) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px' }}>
      <div className="onboarding-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>⚡</span>
            <h1 style={{ fontSize: 28, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TriggerPay
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Get covered in under 2 minutes</p>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="wizard-steps">
          {['Platform', 'Details', 'AI Risk', 'Confirm'].map((label, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={`wizard-connector ${step > i ? 'completed' : ''}`} />}
              <div className={`wizard-step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`}>
                <div className="wizard-step-dot">
                  {step > i + 1 ? <Check size={16} /> : i + 1}
                </div>
                <span className="wizard-step-label">{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="wizard-card animate-in">
          {/* Step 1: Platform Selection */}
          {step === 1 && (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Choose Your Delivery Platform</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Select the platform you deliver for. This helps us optimize your coverage.
              </p>
              <div className="platform-grid">
                {platforms.map(p => (
                  <div
                    key={p.id}
                    className={`platform-card ${formData.platform === p.id ? 'selected' : ''}`}
                    onClick={() => handlePlatformSelect(p.id)}
                  >
                    <div className="icon">{p.icon}</div>
                    <div className="name">{p.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Worker Details */}
          {step === 2 && (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your Details</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Help us personalize your coverage plan.
              </p>
              <div className="form-group">
                <label className="form-label">EMP ID (Platform ID)</label>
                <input className="form-input" name="empId" value={formData.empId} onChange={handleInputChange} placeholder="e.g. 003" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <select className="form-select" name="city" value={formData.city} onChange={handleInputChange}>
                    <option value="">Select City</option>
                    {indianCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Zone</label>
                  <select className="form-select" name="zone" value={formData.zone} onChange={handleInputChange}>
                    <option value="">Select Zone</option>
                    {deliveryZones.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Avg Weekly Earnings (₹)</label>
                  <input className="form-input" name="avgWeeklyEarnings" type="number" value={formData.avgWeeklyEarnings} onChange={handleInputChange} placeholder="e.g., 5000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg Deliveries/Week</label>
                  <input className="form-input" name="avgDeliveriesPerWeek" type="number" value={formData.avgDeliveriesPerWeek} onChange={handleInputChange} placeholder="e.g., 90" />
                </div>
              </div>
            </>
          )}

          {/* Step 3: AI Risk Profile */}
          {step === 3 && (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} /> AI Risk Assessment
              </h3>
              {isCalculating ? (
                <div className="page-loading" style={{ minHeight: 300 }}>
                  <div className="spinner" />
                  <p>AI is analyzing your risk profile...</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Evaluating city risk, zone exposure, weather history, platform data...
                  </p>
                </div>
              ) : riskResult ? (
                <div style={{ marginTop: 16 }}>
                  {/* Risk Score */}
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                      width: 120, height: 120, borderRadius: '50%',
                      background: `conic-gradient(${riskLevel.color} ${riskResult.riskScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 12px',
                      boxShadow: `0 0 40px ${riskLevel.color}33`,
                    }}>
                      <div style={{
                        width: 96, height: 96, borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: riskLevel.color }}>{riskResult.riskScore}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>RISK SCORE</span>
                      </div>
                    </div>
                    <span className={`badge ${riskResult.riskScore > 60 ? 'badge-warning' : 'badge-success'}`}>
                      {riskLevel.emoji} {riskLevel.level} Risk
                    </span>
                  </div>

                  {/* Risk Factors */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Risk Factor Breakdown</h4>
                    {riskResult.riskFactors.map((f, i) => (
                      <div key={i} className="risk-factor-item">
                        <span className="risk-factor-label">{f.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="risk-factor-value" style={{ color: f.score > 60 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                            {f.value}
                          </span>
                          <div className="risk-factor-bar">
                            <div className="risk-factor-bar-fill" style={{
                              width: `${f.score}%`,
                              background: f.score > 70 ? 'var(--accent-red)' : f.score > 40 ? 'var(--accent-amber)' : 'var(--accent-green)',
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Step 4: Policy Preview */}
          {step === 4 && riskResult && (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your Weekly Policy</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Review and activate your personalized coverage plan.
              </p>

              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.08))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                textAlign: 'center',
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Weekly Premium</p>
                <div style={{ fontSize: 48, fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{riskResult.weeklyPremium}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>per week</p>
              </div>

              <div className="premium-breakdown">
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Premium Breakdown (AI Calculated)</h4>
                {[
                  { label: 'Base Premium (1.8% of earnings)', value: `₹${riskResult.breakdown.basePremium}`, cls: '' },
                  { label: 'City Risk Adjustment', value: `${riskResult.breakdown.cityRiskAdj >= 0 ? '+' : ''}₹${riskResult.breakdown.cityRiskAdj}`, cls: riskResult.breakdown.cityRiskAdj >= 0 ? 'negative' : 'positive' },
                  { label: 'Zone Risk Adjustment', value: `${riskResult.breakdown.zoneRiskAdj >= 0 ? '+' : ''}₹${riskResult.breakdown.zoneRiskAdj}`, cls: riskResult.breakdown.zoneRiskAdj >= 0 ? 'negative' : 'positive' },
                  { label: 'Historical Disruption Adj', value: `${riskResult.breakdown.historicalAdj >= 0 ? '+' : ''}₹${riskResult.breakdown.historicalAdj}`, cls: riskResult.breakdown.historicalAdj >= 0 ? 'negative' : 'positive' },
                  { label: 'AI Loyalty Discount', value: `₹${riskResult.breakdown.aiDiscount}`, cls: 'positive' },
                ].map((item, i) => (
                  <div key={i} className="premium-line">
                    <span className="label">{item.label}</span>
                    <span className={`value ${item.cls}`}>{item.value}</span>
                  </div>
                ))}
                <div className="premium-line total">
                  <span className="label">Weekly Premium</span>
                  <span className="value">₹{riskResult.weeklyPremium}</span>
                </div>
              </div>

              <div style={{ marginTop: 20, padding: 16, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <p style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 600 }}>
                  ✅ Max Weekly Coverage: ₹{riskResult.maxWeeklyCoverage?.toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Covers lost income from: Heavy Rain, Extreme Heat, Floods, Hazardous AQI, High Wind, Curfews
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="wizard-actions">
          {step > 1 ? (
            <button className="btn btn-ghost" onClick={goBack}><ArrowLeft size={16} /> Back</button>
          ) : (
            <div />
          )}
          <button
            className={step === 4 ? 'btn btn-success' : 'btn btn-primary'}
            onClick={goNext}
            disabled={!canProceed() || isCalculating}
          >
            {step === 4 ? (
              <>Activate Coverage <Check size={16} /></>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

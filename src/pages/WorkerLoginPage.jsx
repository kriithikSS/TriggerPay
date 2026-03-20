import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { sampleWorkers } from '../services/mockData';
import { Shield, ArrowRight, UserCheck, UserPlus } from 'lucide-react';

export default function WorkerLoginPage() {
  const navigate = useNavigate();
  const { loginWorker, registeredWorkers } = useAppContext();
  const [empId, setEmpId] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('existing'); // 'existing' or 'new'

  const handleLogin = (e) => {
    e.preventDefault();
    if (mode === 'new') {
      navigate('/onboarding');
      return;
    }

    const worker = sampleWorkers.find(w => w.id === empId) || registeredWorkers?.find(w => w.id === empId);
    if (worker) {
      loginWorker(worker);
      navigate('/dashboard');
    } else {
      setError('EMP ID not found. Would you like to switch to "New" and register?');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <h2 style={{ marginBottom: 4 }}>Worker Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Login or get covered in minutes.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg-secondary)', padding: 4, borderRadius: 8 }}>
          <button 
            className={`btn ${mode === 'existing' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1 }} 
            onClick={(e) => { e.preventDefault(); setMode('existing'); setError(''); }}
          >
            <UserCheck size={16} style={{ marginRight: 6 }} /> Existing
          </button>
          <button 
            className={`btn ${mode === 'new' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1 }} 
            onClick={(e) => { e.preventDefault(); setMode('new'); setError(''); }}
          >
            <UserPlus size={16} style={{ marginRight: 6 }} /> New
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'existing' ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Employee ID</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 001, 779" 
                value={empId} 
                onChange={(e) => { setEmpId(e.target.value); setError(''); }}
                required={mode === 'existing'}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <Shield size={42} style={{ color: 'var(--accent-blue)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 0 }}>
                Join India's first AI parametric insurance for gig workers. Get auto-paid for weather disruptions!
              </p>
            </div>
          )}

          {error && <div style={{ color: 'var(--accent-red)', fontSize: 13, background: 'rgba(244, 67, 54, 0.1)', padding: '8px 12px', borderRadius: 4 }}>{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 48, fontSize: 16 }}>
            {mode === 'existing' ? 'Login Securely' : 'Start Onboarding'} <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

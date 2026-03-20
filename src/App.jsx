import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shield, Zap, FileText, AlertTriangle,
  BarChart3, User, LogOut, Bell, Search, Radio
} from 'lucide-react';

import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import PolicyPage from './pages/PolicyPage';
import DisruptionNerveCenterPage from './pages/DisruptionNerveCenterPage';
import ClaimsPage from './pages/ClaimsPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import WorkerLoginPage from './pages/WorkerLoginPage';
import { sampleClaims } from './services/mockData';

// ============= APP CONTEXT =============
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

function AppProvider({ children }) {
  const [currentWorker, setCurrentWorker] = useState(null);
  const [claims, setClaims] = useState(sampleClaims);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredWorkers, setRegisteredWorkers] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('triggerPayWorker');
    if (saved) {
      try {
        setCurrentWorker(JSON.parse(saved));
        setIsLoggedIn(true);
      } catch (e) { /* ignore */ }
    }
    const savedWorkers = localStorage.getItem('triggerPayRegisteredWorkers');
    if (savedWorkers) {
      try {
        setRegisteredWorkers(JSON.parse(savedWorkers));
      } catch (e) { /* ignore */ }
    }
  }, []);

  const loginWorker = (worker) => {
    setCurrentWorker(worker);
    setIsLoggedIn(true);
    localStorage.setItem('triggerPayWorker', JSON.stringify(worker));

    setRegisteredWorkers(prev => {
      if (!prev.find(w => w.id === worker.id)) {
        const updated = [...prev, worker];
        localStorage.setItem('triggerPayRegisteredWorkers', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const loginAdmin = () => {
    const admin = { id: 'ADM-001', name: 'TriggerPay Admin', role: 'admin' };
    setCurrentWorker(admin);
    setIsLoggedIn(true);
    localStorage.setItem('triggerPayWorker', JSON.stringify(admin));
  };

  const logoutWorker = () => {
    setCurrentWorker(null);
    setIsLoggedIn(false);
    localStorage.removeItem('triggerPayWorker');
  };

  const addClaim = (claim) => {
    setClaims(prev => [claim, ...prev]);
    setNotifications(prev => [{
      id: Date.now(),
      message: `Auto-claim initiated: ${claim.triggerType}`,
      amount: claim.amount,
      time: new Date().toLocaleTimeString(),
    }, ...prev]);
  };

  const updateClaim = (id, updates) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <AppContext.Provider value={{
      currentWorker, isLoggedIn, claims, notifications, registeredWorkers,
      loginWorker, logoutWorker, loginAdmin, addClaim, updateClaim, setNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ============= SIDEBAR =============
function Sidebar() {
  const { currentWorker, logoutWorker, notifications } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = currentWorker?.role === 'admin' 
    ? [
        { path: '/nerve-center', icon: Radio, label: 'Nerve Center', badge: '🔴' },
        { path: '/claims', icon: FileText, label: 'All Claims' },
        { path: '/fraud-detection', icon: AlertTriangle, label: 'Fraud Detection' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
      ]
    : [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/policy', icon: Shield, label: 'My Policy' },
        { path: '/claims', icon: FileText, label: 'My Claims' },
      ];

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="sidebar-logo-icon">⚡</div>
        <div>
          <h1>TriggerPay</h1>
          <span>Gig Shield AI</span>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon />
            {item.label}
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {currentWorker ? (
          <div className="sidebar-user" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="sidebar-avatar">
                {currentWorker.name?.[0] || 'U'}
              </div>
              <div className="sidebar-user-info">
                <h4>{currentWorker.name || 'Worker'}</h4>
                <p>{currentWorker.role === 'admin' ? 'Administrator' : (currentWorker.city || 'India')}</p>
              </div>
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => { logoutWorker(); navigate('/'); }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavLink to="/onboarding" className="btn btn-primary" style={{ width: '100%' }}>
              Get Covered
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}

// ============= APP LAYOUT =============
function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isOnboarding = location.pathname === '/onboarding';
  const isLogin = location.pathname === '/login';

  return (
    <div className="app-layout">
      {!isLanding && !isOnboarding && !isLogin && <Sidebar />}
      <main className={`main-content ${isLanding || isOnboarding || isLogin ? 'landing-page' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<WorkerLoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/nerve-center" element={<DisruptionNerveCenterPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/fraud-detection" element={<FraudDetectionPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

// ============= ROOT =============
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

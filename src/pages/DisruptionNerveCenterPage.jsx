import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import { useAppContext } from '../App';
import { indianCities, disruptionTypes, formatCurrency } from '../services/mockData';
import { fetchWeatherData, fetchAQI, checkTriggers, simulateDisruption, calculatePayoutAmount, TRIGGER_THRESHOLDS } from '../services/disruptionMonitor';
import 'leaflet/dist/leaflet.css';

export default function DisruptionNerveCenterPage() {
  const { currentWorker, addClaim } = useAppContext();
  const worker = currentWorker || { name: 'Rajesh Kumar', city: 'Mumbai', avgWeeklyEarnings: 5200 };
  const workerCity = indianCities.find(c => c.name === worker.city) || indianCities[0];

  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [activeDisruptions, setActiveDisruptions] = useState([]);
  const [showClaimNotif, setShowClaimNotif] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeatherData = useCallback(async () => {
    const weather = await fetchWeatherData(workerCity.lat, workerCity.lng);
    const aqi = await fetchAQI(workerCity.lat, workerCity.lng);
    setWeatherData(weather);
    setAqiData(aqi);
    const disruptions = checkTriggers(weather, aqi);
    setActiveDisruptions(disruptions);
    setIsLoading(false);
  }, [workerCity]);

  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 60000);
    return () => clearInterval(interval);
  }, [loadWeatherData]);

  const handleSimulate = (type) => {
    const simWeather = simulateDisruption(type);
    setWeatherData(simWeather);
    if (type === 'aqi_hazardous') {
      setAqiData({ aqi: 380, pm25: 180, pm10: 250, isReal: false });
    }

    const simAqi = type === 'aqi_hazardous' ? { aqi: 380 } : aqiData;
    const disruptions = checkTriggers(simWeather, simAqi);

    if (type === 'curfew') {
      disruptions.push({
        type: 'curfew', severity: 'critical', currentValue: 'Active',
        threshold: 'Active', message: 'Curfew declared in your zone — all deliveries halted',
      });
    }

    setActiveDisruptions(disruptions);

    if (disruptions.length > 0) {
      const hourlyRate = (worker.avgWeeklyEarnings || 5200) / 42;
      const payout = calculatePayoutAmount(disruptions[0].type, disruptions[0].severity, hourlyRate);

      const newClaim = {
        id: `CLM-${Date.now().toString(36).toUpperCase()}`,
        triggerType: disruptions[0].type,
        severity: disruptions[0].severity,
        amount: payout.amount,
        lostHours: payout.lostHours,
        triggeredAt: new Date().toISOString(),
        status: 'processing',
        fraudStatus: 'verified',
        fraudScore: Math.floor(Math.random() * 15),
        weatherData: simWeather,
      };

      addClaim(newClaim);
      setShowClaimNotif(newClaim);
      setTimeout(() => setShowClaimNotif(null), 6000);
    }
  };

  const getTriggerStatus = (type) => {
    if (!weatherData) return { value: 0, percent: 0, status: 'safe' };

    const threshold = TRIGGER_THRESHOLDS[type];
    let currentVal = 0;

    if (type === 'heavy_rain') currentVal = weatherData.rainfall || 0;
    else if (type === 'extreme_heat') currentVal = weatherData.temp || 0;
    else if (type === 'high_wind') currentVal = weatherData.windSpeed || 0;
    else if (type === 'aqi_hazardous') currentVal = aqiData?.aqi || 0;
    else if (type === 'flood') currentVal = weatherData.waterLevel || 0;

    const percent = Math.min(100, (currentVal / threshold.value) * 100);
    const status = percent >= 100 ? 'critical' : percent >= 75 ? 'danger' : percent >= 50 ? 'warning' : 'safe';

    return { value: currentVal, percent, status };
  };

  if (isLoading) {
    return (
      <div>
        <div className="page-header"><h2>🔴 Disruption Nerve Center</h2><p>Loading real-time data...</p></div>
        <div className="page-loading"><div className="spinner" /><p>Connecting to weather stations...</p></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>🔴 Disruption Nerve Center</h2>
        <p>Real-time parametric trigger monitoring for {worker.city || 'Mumbai'} • {weatherData?.isReal ? '🟢 Live Data' : '🟡 Simulated Data'}</p>
      </div>

      {/* Current Conditions Bar */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ '--stat-accent': 'var(--gradient-primary)' }}>
          <div className="stat-icon">🌡️</div>
          <div className="stat-content">
            <div className="stat-label">Temperature</div>
            <div className="stat-value">{weatherData?.temp || '--'}°C</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'linear-gradient(135deg, #4FC3F7, #29B6F6)' }}>
          <div className="stat-icon">🌧️</div>
          <div className="stat-content">
            <div className="stat-label">Rainfall</div>
            <div className="stat-value">{weatherData?.rainfall || 0} mm/hr</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'linear-gradient(135deg, #AB47BC, #8b5cf6)' }}>
          <div className="stat-icon">😷</div>
          <div className="stat-content">
            <div className="stat-label">Air Quality</div>
            <div className="stat-value">{aqiData?.aqi || '--'} AQI</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'linear-gradient(135deg, #78909C, #607D8B)' }}>
          <div className="stat-icon">💨</div>
          <div className="stat-content">
            <div className="stat-label">Wind Speed</div>
            <div className="stat-value">{weatherData?.windSpeed || 0} km/h</div>
          </div>
        </div>
      </div>

      <div className="nerve-center">
        {/* Map */}
        <div className="nerve-center-map">
          <MapContainer
            center={[workerCity.lat, workerCity.lng]}
            zoom={12}
            style={{ height: '100%', width: '100%', minHeight: 500 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {/* Worker Zone */}
            <Circle
              center={[workerCity.lat, workerCity.lng]}
              radius={3000}
              pathOptions={{
                color: activeDisruptions.length > 0 ? '#ef4444' : '#3b82f6',
                fillColor: activeDisruptions.length > 0 ? '#ef4444' : '#3b82f6',
                fillOpacity: 0.15,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ color: '#000', fontWeight: 600 }}>
                  {worker.name}'s Delivery Zone<br />
                  <small>{activeDisruptions.length > 0 ? `⚠️ ${activeDisruptions.length} active disruption(s)` : '✅ All clear'}</small>
                </div>
              </Popup>
            </Circle>

            {/* Nearby cities */}
            {indianCities.filter(c => c.name !== workerCity.name).slice(0, 4).map(city => (
              <Circle
                key={city.name}
                center={[city.lat, city.lng]}
                radius={5000}
                pathOptions={{
                  color: city.riskZone === 'high' ? '#f59e0b' : '#4CAF50',
                  fillOpacity: 0.05, weight: 1,
                }}
              >
                <Popup><div style={{ color: '#000' }}>{city.name} — {city.riskZone} risk</div></Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="nerve-center-sidebar">
          {/* Active Disruption Alerts */}
          {activeDisruptions.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              animation: 'pulseGlow 2s ease infinite',
            }}>
              <h4 style={{ color: 'var(--accent-red)', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                🚨 ACTIVE DISRUPTIONS ({activeDisruptions.length})
              </h4>
              {activeDisruptions.map((d, i) => (
                <div key={i} style={{
                  padding: '8px 12px', marginBottom: 6,
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12, color: 'var(--accent-red)',
                }}>
                  {d.message}
                </div>
              ))}
            </div>
          )}

          {/* Trigger Meters */}
          {['heavy_rain', 'extreme_heat', 'high_wind', 'aqi_hazardous'].map(type => {
            const dtype = disruptionTypes[type];
            const triggerData = getTriggerStatus(type);
            return (
              <div key={type} className={`disruption-card ${triggerData.status === 'critical' ? 'breached' : triggerData.status === 'danger' ? 'active' : ''}`}>
                <div className="disruption-card-header">
                  <span className="disruption-icon">{dtype.icon}</span>
                  <div>
                    <div className="disruption-type">{dtype.label}</div>
                    <div className="disruption-status" style={{
                      color: triggerData.status === 'critical' ? 'var(--accent-red)' :
                        triggerData.status === 'danger' ? 'var(--accent-amber)' : 'var(--accent-green)',
                    }}>
                      {triggerData.status === 'critical' ? '⚠️ THRESHOLD BREACHED' :
                        triggerData.status === 'danger' ? '⚡ Approaching Threshold' : '✅ Normal'}
                    </div>
                  </div>
                </div>
                <div className="trigger-meter">
                  <div
                    className={`trigger-meter-fill ${triggerData.status}`}
                    style={{ width: `${Math.min(100, triggerData.percent)}%` }}
                  />
                </div>
                <div className="disruption-values">
                  <span className="disruption-current" style={{
                    color: triggerData.status === 'critical' ? 'var(--accent-red)' : 'var(--text-primary)',
                  }}>
                    {triggerData.value} {dtype.unit}
                  </span>
                  <span className="disruption-threshold">Trigger: {dtype.threshold}</span>
                </div>
              </div>
            );
          })}

          {/* Simulate Controls */}
          {worker.role === 'admin' && (
          <div className="simulate-controls">
            <h4>🎮 Simulate Disruption (Demo)</h4>
            <div className="simulate-btn-grid">
              {[
                { type: 'heavy_rain', label: '🌧️ Rainstorm' },
                { type: 'extreme_heat', label: '🔥 Heatwave' },
                { type: 'aqi_hazardous', label: '😷 AQI Spike' },
                { type: 'high_wind', label: '💨 Storm' },
                { type: 'flood', label: '🌊 Flash Flood' },
                { type: 'curfew', label: '🚫 Curfew' },
              ].map(sim => (
                <button key={sim.type} className="simulate-btn" onClick={() => handleSimulate(sim.type)}>
                  {sim.label}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={loadWeatherData}>
              🔄 Reset to Real Data
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Auto-Claim Notification */}
      {showClaimNotif && (
        <div className="auto-claim-notification">
          <h4>⚡ Auto-Claim Initiated!</h4>
          <p>
            Parametric trigger breached: <strong>{disruptionTypes[showClaimNotif.triggerType]?.label}</strong>
          </p>
          <p>Lost hours: {showClaimNotif.lostHours} hrs • Fraud check: ✅ Verified</p>
          <div className="amount">{formatCurrency(showClaimNotif.amount)}</div>
          <p style={{ fontSize: 11, marginTop: 4 }}>Payout processing via UPI...</p>
        </div>
      )}
    </div>
  );
}

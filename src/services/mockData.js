// ============= INDIAN CITIES & RISK ZONES =============
export const indianCities = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, riskZone: 'high', floodProne: true, heatProne: false, avgAQI: 180 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, riskZone: 'high', floodProne: false, heatProne: true, avgAQI: 320 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, riskZone: 'medium', floodProne: true, heatProne: false, avgAQI: 120 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, riskZone: 'high', floodProne: true, heatProne: true, avgAQI: 140 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, riskZone: 'medium', floodProne: true, heatProne: true, avgAQI: 130 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, riskZone: 'low', floodProne: false, heatProne: false, avgAQI: 100 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, riskZone: 'high', floodProne: true, heatProne: true, avgAQI: 200 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, riskZone: 'medium', floodProne: false, heatProne: true, avgAQI: 160 },
];

export const platforms = [
  { id: 'zomato', name: 'Zomato', icon: '🍕', color: '#E23744', avgOrderValue: 350, avgDeliveriesPerDay: 18 },
  { id: 'swiggy', name: 'Swiggy', icon: '🍔', color: '#FC8019', avgOrderValue: 300, avgDeliveriesPerDay: 20 },
];

export const deliveryZones = [
  'Central Business District', 'Residential Suburbs', 'Tech Park Area',
  'Market/Commercial Zone', 'University Area', 'Industrial Zone',
  'Old City / Heritage Area', 'Airport Zone', 'Highway Corridor'
];

// ============= SAMPLE WORKERS =============
export const sampleWorkers = [
  {
    id: '001', name: 'Rajesh Kumar', phone: '+91 98765 43210',
    city: 'Mumbai', zone: 'Central Business District', platform: 'zomato',
    avgWeeklyEarnings: 5200, avgDeliveriesPerWeek: 90,
    joinedDate: '2024-06-15', riskScore: 72, premiumWeekly: 89,
    totalClaimsPaid: 3200, activeSince: '2024-06-15'
  },
  {
    id: '002', name: 'Priya Sharma', phone: '+91 98765 43211',
    city: 'Delhi', zone: 'Tech Park Area', platform: 'swiggy',
    avgWeeklyEarnings: 4800, avgDeliveriesPerWeek: 85,
    joinedDate: '2024-08-20', riskScore: 85, premiumWeekly: 105,
    totalClaimsPaid: 5600, activeSince: '2024-08-20'
  },
  {
    id: '003', name: 'Mohammed Afzal', phone: '+91 98765 43212',
    city: 'Bangalore', zone: 'Residential Suburbs', platform: 'zepto',
    avgWeeklyEarnings: 5500, avgDeliveriesPerWeek: 110,
    joinedDate: '2024-03-10', riskScore: 58, premiumWeekly: 72,
    totalClaimsPaid: 1800, activeSince: '2024-03-10'
  },
];

// ============= SAMPLE POLICIES =============
export const samplePolicies = [
  {
    id: 'POL-2026-001', workerId: '001', status: 'active',
    coverageType: 'comprehensive', weeklyPremium: 89,
    maxWeeklyCoverage: 3500, startDate: '2026-03-10', endDate: '2026-06-10',
    triggers: ['heavy_rain', 'flood', 'extreme_heat', 'aqi_hazardous'],
    renewalCount: 12
  },
  {
    id: 'POL-2026-002', workerId: '002', status: 'active',
    coverageType: 'premium', weeklyPremium: 105,
    maxWeeklyCoverage: 4200, startDate: '2026-03-01', endDate: '2026-06-01',
    triggers: ['heavy_rain', 'extreme_heat', 'aqi_hazardous', 'curfew', 'strike'],
    renewalCount: 8
  },
];

// ============= SAMPLE CLAIMS =============
export const sampleClaims = [
  {
    id: 'CLM-001', policyId: 'POL-2026-001', workerId: '001',
    triggerType: 'heavy_rain', status: 'paid', amount: 680,
    triggeredAt: '2026-03-15T14:30:00', resolvedAt: '2026-03-15T14:35:00',
    severity: 'high', weatherData: { rainfall: 45, temp: 26, windSpeed: 35 },
    fraudScore: 8, fraudStatus: 'verified', lostHours: 4,
    payoutMethod: 'UPI', payoutRef: 'UPI-TRG-20260315-001'
  },
  {
    id: 'CLM-002', policyId: 'POL-2026-002', workerId: '002',
    triggerType: 'aqi_hazardous', status: 'paid', amount: 520,
    triggeredAt: '2026-03-12T09:00:00', resolvedAt: '2026-03-12T09:08:00',
    severity: 'medium', weatherData: { aqi: 380, temp: 18, windSpeed: 5 },
    fraudScore: 5, fraudStatus: 'verified', lostHours: 3,
    payoutMethod: 'UPI', payoutRef: 'UPI-TRG-20260312-002'
  },
  {
    id: 'CLM-003', policyId: 'POL-2026-001', workerId: '001',
    triggerType: 'extreme_heat', status: 'paid', amount: 850,
    triggeredAt: '2026-03-08T12:00:00', resolvedAt: '2026-03-08T12:04:00',
    severity: 'critical', weatherData: { temp: 44, humidity: 25, windSpeed: 10 },
    fraudScore: 3, fraudStatus: 'verified', lostHours: 5,
    payoutMethod: 'Bank Transfer', payoutRef: 'NEFT-TRG-20260308-003'
  },
  {
    id: 'CLM-004', policyId: 'POL-2026-002', workerId: '002',
    triggerType: 'curfew', status: 'processing', amount: 960,
    triggeredAt: '2026-03-18T18:00:00', resolvedAt: null,
    severity: 'critical', weatherData: {},
    fraudScore: 15, fraudStatus: 'under_review', lostHours: 6,
    payoutMethod: 'UPI', payoutRef: null
  },
  {
    id: 'CLM-005', policyId: 'POL-2026-001', workerId: '001',
    triggerType: 'flood', status: 'flagged', amount: 1200,
    triggeredAt: '2026-03-05T16:00:00', resolvedAt: null,
    severity: 'critical', weatherData: { rainfall: 82, waterLevel: 1.2 },
    fraudScore: 68, fraudStatus: 'flagged', lostHours: 8,
    payoutMethod: 'UPI', payoutRef: null
  },
];

// ============= DISRUPTION TYPES =============
export const disruptionTypes = {
  heavy_rain: { label: 'Heavy Rain', icon: '🌧️', color: '#4FC3F7', threshold: '> 30mm/hr', unit: 'mm/hr' },
  extreme_heat: { label: 'Extreme Heat', icon: '🔥', color: '#FF7043', threshold: '> 42°C', unit: '°C' },
  flood: { label: 'Flood', icon: '🌊', color: '#29B6F6', threshold: '> 0.5m water', unit: 'm' },
  aqi_hazardous: { label: 'Hazardous AQI', icon: '😷', color: '#AB47BC', threshold: '> 300 AQI', unit: 'AQI' },
  high_wind: { label: 'High Wind', icon: '💨', color: '#78909C', threshold: '> 60 km/h', unit: 'km/h' },
  curfew: { label: 'Curfew / Strike', icon: '🚫', color: '#EF5350', threshold: 'Active', unit: '' },
  strike: { label: 'Local Strike', icon: '✊', color: '#FFA726', threshold: 'Active', unit: '' },
  coverage_request: { label: 'Coverage Request', icon: '📝', color: '#10B981', threshold: 'Approved', unit: '' },
};

// ============= ANALYTICS DATA =============
export const weeklyAnalytics = {
  weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  premiumsCollected: [12500, 14200, 13800, 15600, 16200, 14900, 17800, 18500],
  claimsPaid: [4200, 8900, 5600, 12300, 7800, 6200, 9800, 11200],
  activeWorkers: [145, 168, 182, 195, 210, 225, 248, 267],
  disruptionEvents: [3, 7, 4, 9, 6, 5, 8, 10],
  fraudDetected: [0, 2, 1, 3, 1, 0, 2, 1],
  avgPremium: [85, 88, 87, 92, 90, 86, 95, 93],
};

export const riskDistribution = {
  labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
  data: [35, 40, 20, 5],
  colors: ['#4CAF50', '#FFC107', '#FF9800', '#F44336'],
};

export const disruptionBreakdown = {
  labels: ['Heavy Rain', 'Extreme Heat', 'AQI Hazardous', 'Floods', 'Curfew/Strike', 'High Wind'],
  data: [35, 25, 18, 12, 7, 3],
  colors: ['#4FC3F7', '#FF7043', '#AB47BC', '#29B6F6', '#EF5350', '#78909C'],
};

// ============= HELPER FUNCTIONS =============
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getStatusColor(status) {
  const colors = { active: '#4CAF50', paid: '#4CAF50', processing: '#FFC107', flagged: '#F44336', expired: '#9E9E9E', under_review: '#FF9800', verified: '#4CAF50' };
  return colors[status] || '#9E9E9E';
}

import { indianCities, platforms } from './mockData';

// ============= AI RISK SCORING ENGINE =============

const RISK_WEIGHTS = {
  cityRisk: 0.30,
  platformRisk: 0.15,
  zoneRisk: 0.20,
  earningsRisk: 0.15,
  historicalDisruptions: 0.20,
};

const CITY_RISK_SCORES = { high: 85, medium: 55, low: 30 };

const ZONE_RISK_MAP = {
  'Central Business District': 40,
  'Residential Suburbs': 25,
  'Tech Park Area': 30,
  'Market/Commercial Zone': 55,
  'University Area': 35,
  'Industrial Zone': 60,
  'Old City / Heritage Area': 65,
  'Airport Zone': 45,
  'Highway Corridor': 50,
};

const BASE_PREMIUM_RATE = 0.018; // 1.8% of weekly earnings
const MIN_PREMIUM = 35;
const MAX_PREMIUM = 250;

export function calculateRiskScore(workerProfile) {
  const city = indianCities.find(c => c.name === workerProfile.city);
  const cityRisk = city ? CITY_RISK_SCORES[city.riskZone] : 50;
  const zoneRisk = ZONE_RISK_MAP[workerProfile.zone] || 40;

  const platform = platforms.find(p => p.id === workerProfile.platform);
  const platformRisk = platform ? Math.min(100, platform.avgDeliveriesPerDay * 3.5) : 50;

  const earnings = workerProfile.avgWeeklyEarnings || 4000;
  const earningsRisk = Math.min(100, (earnings / 8000) * 100);

  const historicalRisk = city ? (city.floodProne ? 30 : 0) + (city.heatProne ? 25 : 0) + Math.min(45, city.avgAQI / 7) : 40;

  const weightedScore = Math.round(
    cityRisk * RISK_WEIGHTS.cityRisk +
    platformRisk * RISK_WEIGHTS.platformRisk +
    zoneRisk * RISK_WEIGHTS.zoneRisk +
    earningsRisk * RISK_WEIGHTS.earningsRisk +
    historicalRisk * RISK_WEIGHTS.historicalDisruptions
  );

  return Math.min(100, Math.max(10, weightedScore));
}

export function calculateWeeklyPremium(workerProfile) {
  const riskScore = calculateRiskScore(workerProfile);
  const earnings = workerProfile.avgWeeklyEarnings || 4000;

  const riskMultiplier = 0.7 + (riskScore / 100) * 0.8; // 0.7x to 1.5x
  let premium = Math.round(earnings * BASE_PREMIUM_RATE * riskMultiplier);

  premium = Math.max(MIN_PREMIUM, Math.min(MAX_PREMIUM, premium));

  const city = indianCities.find(c => c.name === workerProfile.city);

  return {
    weeklyPremium: premium,
    riskScore,
    maxWeeklyCoverage: Math.round(earnings * 0.7),
    breakdown: {
      basePremium: Math.round(earnings * BASE_PREMIUM_RATE),
      cityRiskAdj: city ? (CITY_RISK_SCORES[city.riskZone] > 60 ? Math.round(premium * 0.15) : -Math.round(premium * 0.08)) : 0,
      zoneRiskAdj: (ZONE_RISK_MAP[workerProfile.zone] || 40) > 50 ? Math.round(premium * 0.10) : -Math.round(premium * 0.05),
      historicalAdj: city && (city.floodProne || city.heatProne) ? Math.round(premium * 0.12) : -Math.round(premium * 0.06),
      aiDiscount: -Math.round(premium * 0.05),
      finalPremium: premium,
    },
    riskFactors: [
      { label: 'City Risk Zone', value: city?.riskZone || 'medium', score: city ? CITY_RISK_SCORES[city.riskZone] : 50 },
      { label: 'Delivery Zone', value: workerProfile.zone, score: ZONE_RISK_MAP[workerProfile.zone] || 40 },
      { label: 'Flood Exposure', value: city?.floodProne ? 'High' : 'Low', score: city?.floodProne ? 80 : 20 },
      { label: 'Heat Exposure', value: city?.heatProne ? 'High' : 'Low', score: city?.heatProne ? 75 : 15 },
      { label: 'AQI Risk', value: city ? (city.avgAQI > 200 ? 'Severe' : city.avgAQI > 100 ? 'Moderate' : 'Low') : 'Unknown', score: city ? Math.min(100, city.avgAQI / 4) : 30 },
      { label: 'Earnings Level', value: earnings > 5000 ? 'Above Avg' : 'Average', score: Math.min(100, (earnings / 8000) * 100) },
    ],
  };
}

export function getRiskLevel(score) {
  if (score >= 80) return { level: 'Critical', color: '#F44336', emoji: '🔴' };
  if (score >= 60) return { level: 'High', color: '#FF9800', emoji: '🟠' };
  if (score >= 40) return { level: 'Medium', color: '#FFC107', emoji: '🟡' };
  return { level: 'Low', color: '#4CAF50', emoji: '🟢' };
}

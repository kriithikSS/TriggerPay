// ============= AI FRAUD DETECTION ENGINE =============

const FRAUD_WEIGHTS = {
  claimFrequency: 0.25,
  locationMismatch: 0.20,
  timingAnomaly: 0.20,
  weatherCorrelation: 0.20,
  duplicatePattern: 0.15,
};

export function analyzeFraud(claim, historicalClaims = [], workerProfile = {}) {
  const scores = {};

  // 1. Claim frequency analysis
  const recentClaims = historicalClaims.filter(c => {
    const diff = new Date(claim.triggeredAt) - new Date(c.triggeredAt);
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });
  scores.claimFrequency = Math.min(100, recentClaims.length * 25);

  // 2. Location mismatch detection (simulated GPS validation)
  const expectedCity = workerProfile.city || 'Mumbai';
  const claimCity = claim.city || expectedCity;
  scores.locationMismatch = claimCity !== expectedCity ? 90 : Math.round(Math.random() * 15);

  // 3. Timing anomaly (claims outside typical working hours)
  const claimHour = new Date(claim.triggeredAt).getHours();
  const isOddHour = claimHour < 6 || claimHour > 23;
  scores.timingAnomaly = isOddHour ? 70 : Math.round(Math.random() * 20);

  // 4. Weather correlation (does the claim match actual weather data?)
  if (claim.weatherData) {
    const wd = claim.weatherData;
    if (claim.triggerType === 'heavy_rain' && (!wd.rainfall || wd.rainfall < 15)) {
      scores.weatherCorrelation = 85;
    } else if (claim.triggerType === 'extreme_heat' && (!wd.temp || wd.temp < 38)) {
      scores.weatherCorrelation = 80;
    } else {
      scores.weatherCorrelation = Math.round(Math.random() * 10);
    }
  } else {
    scores.weatherCorrelation = 50;
  }

  // 5. Duplicate pattern detection
  const duplicates = historicalClaims.filter(c =>
    c.triggerType === claim.triggerType &&
    Math.abs(new Date(c.triggeredAt) - new Date(claim.triggeredAt)) < 2 * 60 * 60 * 1000
  );
  scores.duplicatePattern = duplicates.length > 0 ? 95 : Math.round(Math.random() * 10);

  // Weighted fraud score
  const totalScore = Math.round(
    scores.claimFrequency * FRAUD_WEIGHTS.claimFrequency +
    scores.locationMismatch * FRAUD_WEIGHTS.locationMismatch +
    scores.timingAnomaly * FRAUD_WEIGHTS.timingAnomaly +
    scores.weatherCorrelation * FRAUD_WEIGHTS.weatherCorrelation +
    scores.duplicatePattern * FRAUD_WEIGHTS.duplicatePattern
  );

  return {
    fraudScore: totalScore,
    status: totalScore > 60 ? 'flagged' : totalScore > 30 ? 'under_review' : 'verified',
    confidence: 100 - Math.abs(50 - totalScore),
    breakdown: scores,
    recommendations: getRecommendations(totalScore, scores),
  };
}

function getRecommendations(totalScore, scores) {
  const recs = [];
  if (totalScore > 60) {
    recs.push('🚨 Claim flagged for manual review — high fraud probability');
    if (scores.locationMismatch > 50) recs.push('📍 GPS location does not match registered delivery zone');
    if (scores.duplicatePattern > 50) recs.push('🔁 Duplicate claim pattern detected within 2-hour window');
    if (scores.weatherCorrelation > 50) recs.push('🌡️ Weather data inconsistent with claimed disruption');
  } else if (totalScore > 30) {
    recs.push('⚠️ Moderate anomaly detected — automated secondary check triggered');
    if (scores.claimFrequency > 50) recs.push('📊 Above-average claim frequency this week');
  } else {
    recs.push('✅ All parameters within normal range — claim auto-approved');
  }
  return recs;
}

export function getFraudStatusInfo(status) {
  const map = {
    verified: { label: 'Verified', color: '#4CAF50', icon: '✅', bg: 'rgba(76, 175, 80, 0.15)' },
    under_review: { label: 'Under Review', color: '#FF9800', icon: '⚠️', bg: 'rgba(255, 152, 0, 0.15)' },
    flagged: { label: 'Flagged', color: '#F44336', icon: '🚨', bg: 'rgba(244, 67, 54, 0.15)' },
  };
  return map[status] || map.under_review;
}

// Generate fraud analysis for historical data visualization
export function generateFraudAnalytics(claims) {
  const total = claims.length;
  const verified = claims.filter(c => c.fraudStatus === 'verified').length;
  const reviewed = claims.filter(c => c.fraudStatus === 'under_review').length;
  const flagged = claims.filter(c => c.fraudStatus === 'flagged').length;

  return {
    total, verified, reviewed, flagged,
    verifiedRate: total > 0 ? Math.round((verified / total) * 100) : 0,
    flaggedRate: total > 0 ? Math.round((flagged / total) * 100) : 0,
    avgFraudScore: total > 0 ? Math.round(claims.reduce((s, c) => s + (c.fraudScore || 0), 0) / total) : 0,
  };
}

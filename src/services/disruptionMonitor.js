// ============= PARAMETRIC DISRUPTION MONITOR =============
// Integrates with OpenWeatherMap + simulated triggers

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Parametric trigger thresholds
export const TRIGGER_THRESHOLDS = {
  heavy_rain: { field: 'rainfall', operator: '>', value: 30, unit: 'mm/hr' },
  extreme_heat: { field: 'temp', operator: '>', value: 42, unit: '°C' },
  flood: { field: 'waterLevel', operator: '>', value: 0.5, unit: 'm' },
  aqi_hazardous: { field: 'aqi', operator: '>', value: 300, unit: 'AQI' },
  high_wind: { field: 'windSpeed', operator: '>', value: 60, unit: 'km/h' },
  curfew: { field: 'active', operator: '==', value: true, unit: '' },
  strike: { field: 'active', operator: '==', value: true, unit: '' },
};

// Fetch real weather from OpenWeatherMap (falls back to simulated)
export async function fetchWeatherData(lat, lng) {
  if (WEATHER_API_KEY) {
    try {
      const res = await fetch(`${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainfall: data.rain ? data.rain['1h'] || 0 : 0,
        windSpeed: Math.round(data.wind.speed * 3.6),
        description: data.weather[0]?.description || '',
        icon: data.weather[0]?.icon || '01d',
        isReal: true,
      };
    } catch (e) {
      console.warn('Weather API failed, using simulated data', e);
    }
  }
  return generateSimulatedWeather();
}

export async function fetchAQI(lat, lng) {
  if (WEATHER_API_KEY) {
    try {
      const res = await fetch(`${WEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`);
      const data = await res.json();
      const components = data.list?.[0]?.components || {};
      const aqi = Math.round((components.pm2_5 || 50) * 2 + (components.pm10 || 40));
      return { aqi, pm25: components.pm2_5, pm10: components.pm10, isReal: true };
    } catch (e) {
      console.warn('AQI API failed, using simulated data', e);
    }
  }
  return { aqi: Math.round(100 + Math.random() * 250), pm25: 55, pm10: 80, isReal: false };
}

function generateSimulatedWeather() {
  return {
    temp: Math.round(28 + Math.random() * 18),
    humidity: Math.round(40 + Math.random() * 50),
    rainfall: Math.random() > 0.6 ? Math.round(Math.random() * 60) : 0,
    windSpeed: Math.round(5 + Math.random() * 55),
    description: ['clear sky', 'scattered clouds', 'heavy rain', 'thunderstorm', 'haze'][Math.floor(Math.random() * 5)],
    icon: '02d',
    isReal: false,
  };
}

// Check if a parametric trigger is breached
export function checkTriggers(weatherData, aqiData) {
  const activeDisruptions = [];

  if (weatherData.rainfall > TRIGGER_THRESHOLDS.heavy_rain.value) {
    activeDisruptions.push({
      type: 'heavy_rain', severity: weatherData.rainfall > 60 ? 'critical' : 'high',
      currentValue: weatherData.rainfall, threshold: TRIGGER_THRESHOLDS.heavy_rain.value,
      message: `Heavy rainfall detected: ${weatherData.rainfall}mm/hr (threshold: ${TRIGGER_THRESHOLDS.heavy_rain.value}mm/hr)`,
    });
  }

  if (weatherData.temp > TRIGGER_THRESHOLDS.extreme_heat.value) {
    activeDisruptions.push({
      type: 'extreme_heat', severity: weatherData.temp > 46 ? 'critical' : 'high',
      currentValue: weatherData.temp, threshold: TRIGGER_THRESHOLDS.extreme_heat.value,
      message: `Extreme heat detected: ${weatherData.temp}°C (threshold: ${TRIGGER_THRESHOLDS.extreme_heat.value}°C)`,
    });
  }

  if (weatherData.windSpeed > TRIGGER_THRESHOLDS.high_wind.value) {
    activeDisruptions.push({
      type: 'high_wind', severity: weatherData.windSpeed > 80 ? 'critical' : 'high',
      currentValue: weatherData.windSpeed, threshold: TRIGGER_THRESHOLDS.high_wind.value,
      message: `High wind detected: ${weatherData.windSpeed}km/h (threshold: ${TRIGGER_THRESHOLDS.high_wind.value}km/h)`,
    });
  }

  if (aqiData && aqiData.aqi > TRIGGER_THRESHOLDS.aqi_hazardous.value) {
    activeDisruptions.push({
      type: 'aqi_hazardous', severity: aqiData.aqi > 400 ? 'critical' : 'high',
      currentValue: aqiData.aqi, threshold: TRIGGER_THRESHOLDS.aqi_hazardous.value,
      message: `Hazardous AQI detected: ${aqiData.aqi} (threshold: ${TRIGGER_THRESHOLDS.aqi_hazardous.value})`,
    });
  }

  return activeDisruptions;
}

// Simulate a specific disruption for demo purposes
export function simulateDisruption(type) {
  const simulations = {
    heavy_rain: { temp: 24, humidity: 92, rainfall: 55, windSpeed: 30, description: 'heavy intensity rain', icon: '10d', isReal: false },
    extreme_heat: { temp: 46, humidity: 18, rainfall: 0, windSpeed: 8, description: 'extreme heat warning', icon: '01d', isReal: false },
    flood: { temp: 26, humidity: 95, rainfall: 85, windSpeed: 25, waterLevel: 1.2, description: 'urban flooding', icon: '10d', isReal: false },
    high_wind: { temp: 30, humidity: 45, rainfall: 0, windSpeed: 75, description: 'storm warning', icon: '50d', isReal: false },
    aqi_hazardous: { temp: 16, humidity: 60, rainfall: 0, windSpeed: 4, description: 'severe smog', icon: '50d', isReal: false },
    curfew: { temp: 30, humidity: 50, rainfall: 0, windSpeed: 10, description: 'clear sky', icon: '01d', isReal: false },
  };
  return simulations[type] || generateSimulatedWeather();
}

export function calculatePayoutAmount(triggerType, severity, avgHourlyRate) {
  const lostHoursMap = { low: 2, medium: 3, high: 5, critical: 8 };
  const lostHours = lostHoursMap[severity] || 4;
  return { amount: Math.round(lostHours * avgHourlyRate), lostHours };
}

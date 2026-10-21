import { CurrentWeatherView, DailyForecastView, TemperatureUnit } from '../models/weather.types';

export type WeatherGlyphKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-day'
  | 'partly-night'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherPresentation {
  description: string;
  shortLabel: string;
  headline: string;
  subtitle: string;
  icon: string;
  glyphDay: WeatherGlyphKind;
  glyphNight: WeatherGlyphKind;
}

const WMO: Record<number, WeatherPresentation> = {
  0: {
    description: 'Clear sky',
    shortLabel: 'Clear Sky',
    headline: 'Clear',
    subtitle: 'with unbroken sunshine',
    icon: '☀️',
    glyphDay: 'clear-day',
    glyphNight: 'clear-night',
  },
  1: {
    description: 'Mainly clear',
    shortLabel: 'Mostly Clear',
    headline: 'Mostly Clear',
    subtitle: 'with light fair-weather clouds',
    icon: '🌤️',
    glyphDay: 'clear-day',
    glyphNight: 'clear-night',
  },
  2: {
    description: 'Partly cloudy',
    shortLabel: 'Partly Cloudy',
    headline: 'Partly Cloudy',
    subtitle: 'with scattered cloud cover',
    icon: '⛅',
    glyphDay: 'partly-day',
    glyphNight: 'partly-night',
  },
  3: {
    description: 'Overcast',
    shortLabel: 'Overcast',
    headline: 'Cloudy',
    subtitle: 'with overcast sky layer',
    icon: '☁️',
    glyphDay: 'overcast',
    glyphNight: 'overcast',
  },
  45: {
    description: 'Atmospheric fog',
    shortLabel: 'Foggy',
    headline: 'Misty',
    subtitle: 'with reduced surface visibility',
    icon: '🌫️',
    glyphDay: 'fog',
    glyphNight: 'fog',
  },
  48: {
    description: 'Depositing rime fog',
    shortLabel: 'Rime Fog',
    headline: 'Dense Fog',
    subtitle: 'with freezing mist conditions',
    icon: '🌫️',
    glyphDay: 'fog',
    glyphNight: 'fog',
  },
  51: {
    description: 'Light drizzle',
    shortLabel: 'Light Drizzle',
    headline: 'Drizzle',
    subtitle: 'with light passing mist',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  53: {
    description: 'Moderate drizzle',
    shortLabel: 'Drizzle',
    headline: 'Drizzle',
    subtitle: 'with steady light moisture',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  55: {
    description: 'Dense drizzle',
    shortLabel: 'Dense Drizzle',
    headline: 'Rainy',
    subtitle: 'with dense overcast drizzle',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  56: {
    description: 'Freezing drizzle',
    shortLabel: 'Freezing Drizzle',
    headline: 'Icy Drizzle',
    subtitle: 'with sub-zero surface mist',
    icon: '🌧️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  57: {
    description: 'Heavy freezing drizzle',
    shortLabel: 'Freezing Drizzle',
    headline: 'Freezing Rain',
    subtitle: 'with glazed surface conditions',
    icon: '🌧️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  61: {
    description: 'Slight rain',
    shortLabel: 'Light Rain',
    headline: 'Light Rain',
    subtitle: 'with partly cloudy intervals',
    icon: '🌧️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  63: {
    description: 'Moderate rain',
    shortLabel: 'Rain',
    headline: 'Rainy',
    subtitle: 'with steady rainfall across area',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  65: {
    description: 'Heavy rain',
    shortLabel: 'Heavy Rain',
    headline: 'Heavy Rain',
    subtitle: 'with dense storm clouds',
    icon: '🌧️',
    glyphDay: 'heavy-rain',
    glyphNight: 'heavy-rain',
  },
  66: {
    description: 'Freezing rain',
    shortLabel: 'Freezing Rain',
    headline: 'Sleet',
    subtitle: 'with winter precipitation',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  67: {
    description: 'Heavy freezing rain',
    shortLabel: 'Freezing Rain',
    headline: 'Winter Storm',
    subtitle: 'with heavy freezing rain',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  71: {
    description: 'Slight snowfall',
    shortLabel: 'Light Snow',
    headline: 'Snowy',
    subtitle: 'with light snow flurries',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  73: {
    description: 'Moderate snowfall',
    shortLabel: 'Snow',
    headline: 'Snowfall',
    subtitle: 'with steady winter accumulation',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  75: {
    description: 'Heavy snowfall',
    shortLabel: 'Heavy Snow',
    headline: 'Heavy Snow',
    subtitle: 'withlow-visibility squalls',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  77: {
    description: 'Snow grains',
    shortLabel: 'Snow Grains',
    headline: 'Flurries',
    subtitle: 'with fine crystalline snow',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  80: {
    description: 'Passing rain showers',
    shortLabel: 'Rain Showers',
    headline: 'Showers',
    subtitle: 'with partly cloudy breaks',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  81: {
    description: 'Moderate rain showers',
    shortLabel: 'Rain Showers',
    headline: 'Rain Showers',
    subtitle: 'with gusty overcast skies',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  82: {
    description: 'Violent rain showers',
    shortLabel: 'Heavy Showers',
    headline: 'Stormy',
    subtitle: 'with heavy downpours',
    icon: '⛈️',
    glyphDay: 'heavy-rain',
    glyphNight: 'heavy-rain',
  },
  85: {
    description: 'Snow showers',
    shortLabel: 'Snow Showers',
    headline: 'Snow Showers',
    subtitle: 'with brisk alpine winds',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  86: {
    description: 'Heavy snow showers',
    shortLabel: 'Heavy Snow',
    headline: 'Blizzard',
    subtitle: 'with heavy blowing snow',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  95: {
    description: 'Thunderstorm',
    shortLabel: 'Rain/Thunder',
    headline: 'Stormy',
    subtitle: 'with partly cloudy',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
  96: {
    description: 'Thunderstorm with hail',
    shortLabel: 'Storm & Hail',
    headline: 'Stormy',
    subtitle: 'with thunder and hail',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
  99: {
    description: 'Severe thunderstorm with hail',
    shortLabel: 'Severe Storm',
    headline: 'Severe Storm',
    subtitle: 'with intense lightning activity',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
};

export function weatherFromCode(code: number): WeatherPresentation {
  return (
    WMO[code] ?? {
      description: 'Variable conditions',
      shortLabel: 'Partly Cloudy',
      headline: 'Variable',
      subtitle: 'with shifting cloud cover',
      icon: '🌡️',
      glyphDay: 'partly-day',
      glyphNight: 'partly-night',
    }
  );
}

export function glyphForWeather(code: number, isDay = true): WeatherGlyphKind {
  const meta = weatherFromCode(code);
  return isDay ? meta.glyphDay : meta.glyphNight;
}

export function formatTemp(celsius: number, unit: TemperatureUnit): number {
  const val = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return Math.round(val);
}

export function compassDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return dirs[idx];
}

export function fullCompassDirection(degrees: number): string {
  const dirs = [
    'North',
    'North-Northeast',
    'Northeast',
    'East-Northeast',
    'East',
    'East-Southeast',
    'Southeast',
    'South-Southeast',
    'South',
    'South-Southwest',
    'Southwest',
    'West-Southwest',
    'West',
    'West-Northwest',
    'Northwest',
    'North-Northwest',
  ];
  const idx = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return dirs[idx];
}

export function beaufortLabel(kmh: number): { scale: number; label: string; detail: string } {
  if (kmh < 2) return { scale: 0, label: 'Calm', detail: 'Still air, smoke rises vertically' };
  if (kmh < 6) return { scale: 1, label: 'Light Air', detail: 'Subtle thermal drift' };
  if (kmh < 12) return { scale: 2, label: 'Light Breeze', detail: 'Leaves rustle gently' };
  if (kmh < 20) return { scale: 3, label: 'Gentle Breeze', detail: 'Steady coastal or valley flow' };
  if (kmh < 29) return { scale: 4, label: 'Moderate Breeze', detail: 'Small branches in motion' };
  if (kmh < 39) return { scale: 5, label: 'Fresh Breeze', detail: 'Crested wavelets on inland water' };
  if (kmh < 50) return { scale: 6, label: 'Strong Breeze', detail: 'Large branches sway noticeably' };
  return { scale: 7, label: 'High Wind', detail: 'Turbulent surface gusts' };
}

export function uvRiskMeta(uv: number): {
  level: string;
  advice: string;
  accentClass: string;
  percent: number;
} {
  const clamped = Math.max(0, Math.min(11, uv));
  const percent = Math.round((clamped / 11) * 100);
  if (uv < 3) {
    return {
      level: 'Low',
      advice: 'Minimal solar radiation. No special protection needed.',
      accentClass: 'text-emerald-300',
      percent,
    };
  }
  if (uv < 6) {
    return {
      level: 'Moderate',
      advice: 'SPF 30+ recommended during midday sun.',
      accentClass: 'text-amber-300',
      percent,
    };
  }
  if (uv < 8) {
    return {
      level: 'High',
      advice: 'Reduce direct exposure between 11 AM and 3 PM.',
      accentClass: 'text-orange-300',
      percent,
    };
  }
  if (uv < 11) {
    return {
      level: 'Very High',
      advice: 'Shade and sunglasses strongly advised.',
      accentClass: 'text-rose-300',
      percent,
    };
  }
  return {
    level: 'Extreme',
    advice: 'Avoid prolonged midday sun exposure.',
    accentClass: 'text-fuchsia-300',
    percent: 100,
  };
}

export function humidityComfortMeta(humidity: number, dewPointC: number): {
  status: string;
  note: string;
} {
  if (humidity < 30) {
    return { status: 'Dry Air', note: 'Low atmospheric moisture and rapid evaporation.' };
  }
  if (humidity <= 62 && dewPointC < 19) {
    return { status: 'Comfortable', note: 'Balanced humidity and breathable air quality.' };
  }
  if (humidity <= 78) {
    return { status: 'Humid', note: 'Warm surface moisture across the area.' };
  }
  return { status: 'Very Humid', note: 'High moisture content slows evaporative cooling.' };
}

export function pressureMeta(hpa: number): {
  status: string;
  note: string;
  normalizedPercent: number;
} {
  const min = 975;
  const max = 1040;
  const normalizedPercent = Math.max(4, Math.min(96, Math.round(((hpa - min) / (max - min)) * 100)));
  if (hpa < 1005) {
    return {
      status: 'Low Pressure',
      note: 'Below standard 101.3 kPa — often linked to unsettled skies.',
      normalizedPercent,
    };
  }
  if (hpa <= 1020) {
    return {
      status: 'Normal',
      note: 'Near standard sea-level pressure (101.3 kPa).',
      normalizedPercent,
    };
  }
  return {
    status: 'High Pressure',
    note: 'Elevated atmospheric pressure favors stable skies.',
    normalizedPercent,
  };
}

export function liveConditionSummary(current: CurrentWeatherView): {
  deltaText: string;
  statusLabel: string;
  statusTone: 'amber' | 'emerald' | 'sky';
  dotPercent: number;
} {
  if (current.weatherCode >= 95 || current.windSpeed >= 38) {
    return {
      deltaText: `↑ ${Math.round(current.humidity)}%`,
      statusLabel: 'Stormy',
      statusTone: 'amber',
      dotPercent: 78,
    };
  }
  if (current.uvIndex >= 7 || current.temperature >= 31) {
    return {
      deltaText: `↑ ${ (current.uvIndex * 3.2).toFixed(1) }%`,
      statusLabel: 'High UV',
      statusTone: 'amber',
      dotPercent: 74,
    };
  }
  if (current.humidity >= 75) {
    return {
      deltaText: `↑ ${current.humidity.toFixed(1)}%`,
      statusLabel: 'Humid',
      statusTone: 'amber',
      dotPercent: 68,
    };
  }
  return {
    deltaText: `↑ ${Math.max(12.4, current.humidity * 0.35).toFixed(1)}%`,
    statusLabel: 'Comfortable',
    statusTone: 'emerald',
    dotPercent: 58,
  };
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

export function buildEditorialNarrative(
  current: CurrentWeatherView,
  today: DailyForecastView | undefined,
  unit: TemperatureUnit,
): string {
  const feels = formatTemp(current.feelsLike, unit);
  const wind = Math.round(current.windSpeed);
  const dir = fullCompassDirection(current.windDirection).toLowerCase();
  if (today) {
    return `With real-time data and live station tracking, feels like ${feels}° with a ${wind} km/h ${dir} wind and ${Math.round(current.humidity)}% humidity.`;
  }
  return `With real-time data and advanced forecasting, we provide reliable live conditions for any location around the world.`;
}

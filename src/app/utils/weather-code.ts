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
  icon: string;
  glyphDay: WeatherGlyphKind;
  glyphNight: WeatherGlyphKind;
}

const WMO: Record<number, WeatherPresentation> = {
  0: {
    description: 'Clear sky',
    shortLabel: 'Clear',
    icon: '☀️',
    glyphDay: 'clear-day',
    glyphNight: 'clear-night',
  },
  1: {
    description: 'Mainly clear',
    shortLabel: 'Mostly Clear',
    icon: '🌤️',
    glyphDay: 'clear-day',
    glyphNight: 'clear-night',
  },
  2: {
    description: 'Partly cloudy',
    shortLabel: 'Partly Cloudy',
    icon: '⛅',
    glyphDay: 'partly-day',
    glyphNight: 'partly-night',
  },
  3: {
    description: 'Overcast',
    shortLabel: 'Overcast',
    icon: '☁️',
    glyphDay: 'overcast',
    glyphNight: 'overcast',
  },
  45: {
    description: 'Atmospheric fog',
    shortLabel: 'Fog',
    icon: '🌫️',
    glyphDay: 'fog',
    glyphNight: 'fog',
  },
  48: {
    description: 'Depositing rime fog',
    shortLabel: 'Rime Fog',
    icon: '🌫️',
    glyphDay: 'fog',
    glyphNight: 'fog',
  },
  51: {
    description: 'Light drizzle',
    shortLabel: 'Light Drizzle',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  53: {
    description: 'Moderate drizzle',
    shortLabel: 'Drizzle',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  55: {
    description: 'Dense drizzle',
    shortLabel: 'Dense Drizzle',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  56: {
    description: 'Freezing drizzle',
    shortLabel: 'Freezing Drizzle',
    icon: '🌧️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  57: {
    description: 'Heavy freezing drizzle',
    shortLabel: 'Freezing Drizzle',
    icon: '🌧️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  61: {
    description: 'Slight rain',
    shortLabel: 'Light Rain',
    icon: '🌧️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  63: {
    description: 'Moderate rain',
    shortLabel: 'Rain',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  65: {
    description: 'Heavy rain',
    shortLabel: 'Heavy Rain',
    icon: '🌧️',
    glyphDay: 'heavy-rain',
    glyphNight: 'heavy-rain',
  },
  66: {
    description: 'Freezing rain',
    shortLabel: 'Freezing Rain',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  67: {
    description: 'Heavy freezing rain',
    shortLabel: 'Freezing Rain',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  71: {
    description: 'Slight snowfall',
    shortLabel: 'Light Snow',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  73: {
    description: 'Moderate snowfall',
    shortLabel: 'Snow',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  75: {
    description: 'Heavy snowfall',
    shortLabel: 'Heavy Snow',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  77: {
    description: 'Snow grains',
    shortLabel: 'Snow Grains',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  80: {
    description: 'Passing rain showers',
    shortLabel: 'Showers',
    icon: '🌦️',
    glyphDay: 'drizzle',
    glyphNight: 'drizzle',
  },
  81: {
    description: 'Moderate rain showers',
    shortLabel: 'Rain Showers',
    icon: '🌧️',
    glyphDay: 'rain',
    glyphNight: 'rain',
  },
  82: {
    description: 'Violent rain showers',
    shortLabel: 'Heavy Showers',
    icon: '⛈️',
    glyphDay: 'heavy-rain',
    glyphNight: 'heavy-rain',
  },
  85: {
    description: 'Snow showers',
    shortLabel: 'Snow Showers',
    icon: '🌨️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  86: {
    description: 'Heavy snow showers',
    shortLabel: 'Heavy Snow',
    icon: '❄️',
    glyphDay: 'snow',
    glyphNight: 'snow',
  },
  95: {
    description: 'Thunderstorm',
    shortLabel: 'Thunderstorm',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
  96: {
    description: 'Thunderstorm with hail',
    shortLabel: 'Storm & Hail',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
  99: {
    description: 'Severe thunderstorm with hail',
    shortLabel: 'Severe Storm',
    icon: '⛈️',
    glyphDay: 'thunderstorm',
    glyphNight: 'thunderstorm',
  },
};

export function weatherFromCode(code: number): WeatherPresentation {
  return (
    WMO[code] ?? {
      description: 'Variable conditions',
      shortLabel: 'Variable',
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
      advice: 'SPF 30+ recommended during solar noon hours.',
      accentClass: 'text-amber-300',
      percent,
    };
  }
  if (uv < 8) {
    return {
      level: 'High',
      advice: 'Reduce direct exposure between 11:00 and 15:00.',
      accentClass: 'text-orange-300',
      percent,
    };
  }
  if (uv < 11) {
    return {
      level: 'Very High',
      advice: 'Intense UV flux. Shade and sunglasses strongly advised.',
      accentClass: 'text-rose-300',
      percent,
    };
  }
  return {
    level: 'Extreme',
    advice: 'Maximum solar index. Avoid prolonged midday sun.',
    accentClass: 'text-fuchsia-300',
    percent: 100,
  };
}

export function humidityComfortMeta(humidity: number, dewPointC: number): {
  status: string;
  note: string;
} {
  if (humidity < 30) {
    return { status: 'Crisp & Dry', note: 'Low atmospheric moisture; rapid evaporation.' };
  }
  if (humidity <= 60 && dewPointC < 18) {
    return { status: 'Optimal Comfort', note: 'Balanced vapour pressure and breathable air.' };
  }
  if (humidity <= 75) {
    return { status: 'Humid', note: 'Noticeable moisture in the boundary layer.' };
  }
  return { status: 'Tropical / Muggy', note: 'High moisture content slows evaporative cooling.' };
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
      status: 'Low Pressure System',
      note: 'Below standard 1013 hPa — often linked to unsettled skies.',
      normalizedPercent,
    };
  }
  if (hpa <= 1020) {
    return {
      status: 'Standard Atmospheric',
      note: 'Near mean sea-level equilibrium (1013.2 hPa).',
      normalizedPercent,
    };
  }
  return {
    status: 'High Pressure Ridge',
    note: 'Elevated column weight — favors stable, settled conditions.',
    normalizedPercent,
  };
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir} · ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

export function buildEditorialNarrative(
  current: CurrentWeatherView,
  today: DailyForecastView | undefined,
  unit: TemperatureUnit,
): string {
  const dir = compassDirection(current.windDirection);
  const windDesc = beaufortLabel(current.windSpeed).label.toLowerCase();
  const delta = Math.round(current.feelsLike - current.temperature);
  const feelPhrase =
    Math.abs(delta) <= 1
      ? 'tracking closely with actual air temperature'
      : delta > 1
        ? `feeling ${formatTemp(current.feelsLike, unit)}° due to surface humidity`
        : `feeling brisker at ${formatTemp(current.feelsLike, unit)}° in the breeze`;

  const hiLo = today
    ? ` Today spans a diurnal range of ${formatTemp(today.tempMin, unit)}° to ${formatTemp(today.tempMax, unit)}°${
        today.precipitationProbabilityMax >= 25
          ? ` with a ${today.precipitationProbabilityMax}% chance of precipitation.`
          : ' under stable barometric pressure.'
      }`
    : '';

  return `${current.description} with a ${windDesc} (${Math.round(current.windSpeed)} km/h ${dir}), ${feelPhrase}.${hiLo}`;
}

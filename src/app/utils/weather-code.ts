export interface WeatherPresentation {
  description: string;
  icon: string;
}

const WMO: Record<number, WeatherPresentation> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Freezing drizzle', icon: '🌧️' },
  57: { description: 'Heavy freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Heavy thunderstorm with hail', icon: '⛈️' },
};

export function weatherFromCode(code: number): WeatherPresentation {
  return WMO[code] ?? { description: 'Unknown conditions', icon: '🌡️' };
}

/** Tailwind gradient classes keyed by broad condition for the page backdrop. */
export function backdropForCode(code: number): string {
  if (code === 0 || code === 1) {
    return 'from-amber-500/30 via-sky-600/40 to-indigo-950';
  }
  if (code === 2 || code === 3) {
    return 'from-slate-400/25 via-slate-600/35 to-slate-950';
  }
  if (code >= 51 && code <= 67) {
    return 'from-sky-700/35 via-blue-900/45 to-slate-950';
  }
  if (code >= 71 && code <= 77) {
    return 'from-sky-200/20 via-blue-400/25 to-slate-900';
  }
  if (code >= 95) {
    return 'from-violet-700/40 via-indigo-900/50 to-slate-950';
  }
  return 'from-teal-600/30 via-cyan-800/35 to-slate-950';
}

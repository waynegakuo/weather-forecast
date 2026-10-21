export type WeatherScene =
  | 'default'
  | 'clear'
  | 'clear-night'
  | 'partly'
  | 'partly-night'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm';

export interface AtmospherePalette {
  scene: WeatherScene;
  skyGradient: string;
  orbPrimary: string;
  orbSecondary: string;
  accentHex: string;
  badgeText: string;
  photoUrl: string;
  hasRain: boolean;
  hasSnow: boolean;
  hasStars: boolean;
}

/** Verified 200-OK high-resolution weather photography for every WMO weather condition */
const BACKGROUNDS: Record<WeatherScene, string> = {
  default:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
  clear:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=85',
  'clear-night':
    'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=1920&q=85',
  partly:
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1920&q=85',
  'partly-night':
    'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1920&q=85',
  cloudy:
    'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1920&q=85',
  fog:
    'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=85',
  rain:
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=85',
  snow:
    'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?auto=format&fit=crop&w=1920&q=85',
  storm:
    'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1920&q=85',
};

export function sceneForWeatherCode(code: number, isDay = true): WeatherScene {
  if (code === 0 || code === 1) {
    return isDay ? 'clear' : 'clear-night';
  }
  if (code === 2) {
    return isDay ? 'partly' : 'partly-night';
  }
  if (code === 3) {
    return 'cloudy';
  }
  if (code === 45 || code === 48) {
    return 'fog';
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return 'snow';
  }
  if (code >= 95) {
    return 'storm';
  }
  if (code >= 51) {
    return 'rain';
  }
  return 'cloudy';
}

export function backgroundImageForCode(code: number | undefined, isDay = true): string {
  const scene = code === undefined ? 'default' : sceneForWeatherCode(code, isDay);
  return BACKGROUNDS[scene];
}

export function overlayGradientForScene(scene: WeatherScene): string {
  switch (scene) {
    case 'clear':
      return 'linear-gradient(160deg, rgba(22, 26, 34, 0.68) 0%, rgba(18, 20, 26, 0.84) 100%)';
    case 'clear-night':
      return 'linear-gradient(160deg, rgba(14, 17, 28, 0.76) 0%, rgba(10, 12, 20, 0.88) 100%)';
    case 'partly':
      return 'linear-gradient(160deg, rgba(26, 29, 36, 0.68) 0%, rgba(18, 20, 25, 0.84) 100%)';
    case 'partly-night':
      return 'linear-gradient(160deg, rgba(18, 21, 32, 0.76) 0%, rgba(12, 14, 22, 0.88) 100%)';
    case 'storm':
      return 'linear-gradient(160deg, rgba(24, 22, 34, 0.72) 0%, rgba(16, 17, 23, 0.88) 100%)';
    case 'rain':
      return 'linear-gradient(160deg, rgba(20, 27, 38, 0.7) 0%, rgba(16, 19, 26, 0.86) 100%)';
    case 'snow':
      return 'linear-gradient(160deg, rgba(28, 34, 44, 0.68) 0%, rgba(18, 22, 29, 0.84) 100%)';
    case 'fog':
      return 'linear-gradient(160deg, rgba(32, 36, 42, 0.7) 0%, rgba(20, 22, 26, 0.86) 100%)';
    default:
      return 'linear-gradient(160deg, rgba(26, 28, 33, 0.7) 0%, rgba(18, 19, 23, 0.86) 100%)';
  }
}

export function atmosphereForScene(scene: WeatherScene): AtmospherePalette {
  const photoUrl = BACKGROUNDS[scene] ?? BACKGROUNDS.default;
  return {
    scene,
    skyGradient: overlayGradientForScene(scene),
    orbPrimary: 'rgba(255, 255, 255, 0.03)',
    orbSecondary: 'rgba(56, 189, 248, 0.04)',
    accentHex: '#38bdf8',
    badgeText: 'Live Forecast',
    photoUrl,
    hasRain: scene === 'rain' || scene === 'storm',
    hasSnow: scene === 'snow',
    hasStars: scene === 'clear-night' || scene === 'partly-night',
  };
}

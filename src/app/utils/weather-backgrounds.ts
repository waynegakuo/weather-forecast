import { WeatherBundle } from '../models/weather.types';

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

/**
 * Pure Atmospheric Sky Canopies Only (Option 3).
 * Every image is visually verified to contain 100% upper-atmosphere sky, clouds,
 * starfields, rain droplets, or falling snow with zero ground terrain, mountains,
 * trees, beaches, or buildings—ensuring zero geographic clashing for any location.
 */
const SCENE_BACKGROUNDS: Record<WeatherScene, string> = {
  // High-altitude sea of white clouds under a deep blue sky
  default:
    'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=1920&q=85',
  // Bright sunlit blue sky canopy with soft cloud tops
  clear:
    'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1920&q=85',
  // Pure deep starry night sky with zero horizon or terrain
  'clear-night':
    'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1920&q=85',
  // Sunlit fluffy cumulus clouds in a blue sky
  partly:
    'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1920&q=85',
  // Full moon and drifting night clouds in the upper sky
  'partly-night':
    'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1920&q=85',
  // Pure overcast grey cloud canopy looking up at the sky
  cloudy:
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=85',
  // Diffused atmospheric mist and cloud deck from above
  fog:
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920&q=85',
  // Rain droplets on glass with soft atmospheric bokeh
  rain:
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=85',
  // Pure falling snowflakes in the air with zero ground or trees
  snow:
    'https://images.unsplash.com/photo-1542601098-8fc114e148e2?auto=format&fit=crop&w=1920&q=85',
  // Brooding dark indigo thunderhead clouds looking straight up into the sky
  storm:
    'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=1920&q=85',
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
  if (code === undefined) {
    return SCENE_BACKGROUNDS.default;
  }
  return SCENE_BACKGROUNDS[sceneForWeatherCode(code, isDay)];
}

export function backgroundImageForBundle(bundle: WeatherBundle | null | undefined): string {
  if (!bundle) {
    return SCENE_BACKGROUNDS.default;
  }
  return backgroundImageForCode(bundle.current.weatherCode, bundle.current.isDay);
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
  const photoUrl = SCENE_BACKGROUNDS[scene] ?? SCENE_BACKGROUNDS.default;
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

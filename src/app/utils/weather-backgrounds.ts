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

const BACKGROUNDS: Record<WeatherScene, string> = {
  default:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  clear:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
  'clear-night':
    'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=1920&q=80',
  partly:
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1920&q=80',
  'partly-night':
    'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1920&q=80',
  cloudy:
    'https://images.unsplash.com/photo-1534088568595-a066ff450fd5?auto=format&fit=crop&w=1920&q=80',
  fog:
    'https://images.unsplash.com/photo-1487621167305-5d279d0436cc?auto=format&fit=crop&w=1920&q=80',
  rain:
    'https://images.unsplash.com/photo-1428908728789-d2dbd25fbd1f?auto=format&fit=crop&w=1920&q=80',
  snow:
    'https://images.unsplash.com/photo-1491002057636-a23c08f3ba49?auto=format&fit=crop&w=1920&q=80',
  storm:
    'https://images.unsplash.com/photo-1605727216801-54b7c2012479?auto=format&fit=crop&w=1920&q=80',
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
  return atmosphereForScene(scene).skyGradient;
}

export function atmosphereForScene(scene: WeatherScene): AtmospherePalette {
  switch (scene) {
    case 'clear':
      return {
        scene,
        skyGradient:
          'radial-gradient(120% 90% at 15% 5%, rgba(251, 191, 36, 0.22) 0%, rgba(14, 116, 144, 0.45) 42%, rgba(9, 18, 36, 0.94) 100%)',
        orbPrimary: 'rgba(251, 191, 36, 0.34)',
        orbSecondary: 'rgba(56, 189, 248, 0.24)',
        accentHex: '#fbbf24',
        badgeText: 'SOLAR ZENITH // CLEAR DOME',
        photoUrl: BACKGROUNDS.clear,
        hasRain: false,
        hasSnow: false,
        hasStars: false,
      };
    case 'clear-night':
      return {
        scene,
        skyGradient:
          'radial-gradient(110% 85% at 80% 10%, rgba(99, 102, 241, 0.24) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(4, 8, 18, 0.97) 100%)',
        orbPrimary: 'rgba(129, 140, 248, 0.25)',
        orbSecondary: 'rgba(56, 189, 248, 0.14)',
        accentHex: '#818cf8',
        badgeText: 'NOCTURNAL // STARLIT SKY',
        photoUrl: BACKGROUNDS['clear-night'],
        hasRain: false,
        hasSnow: false,
        hasStars: true,
      };
    case 'partly':
      return {
        scene,
        skyGradient:
          'radial-gradient(115% 85% at 20% 8%, rgba(56, 189, 248, 0.28) 0%, rgba(30, 58, 95, 0.65) 48%, rgba(10, 17, 32, 0.94) 100%)',
        orbPrimary: 'rgba(56, 189, 248, 0.28)',
        orbSecondary: 'rgba(251, 191, 36, 0.18)',
        accentHex: '#38bdf8',
        badgeText: 'SCATTERED CUMULUS // DAYLIGHT',
        photoUrl: BACKGROUNDS.partly,
        hasRain: false,
        hasSnow: false,
        hasStars: false,
      };
    case 'partly-night':
      return {
        scene,
        skyGradient:
          'radial-gradient(115% 85% at 75% 12%, rgba(79, 70, 229, 0.22) 0%, rgba(15, 23, 42, 0.86) 52%, rgba(5, 10, 22, 0.96) 100%)',
        orbPrimary: 'rgba(99, 102, 241, 0.22)',
        orbSecondary: 'rgba(45, 212, 191, 0.14)',
        accentHex: '#a5b4fc',
        badgeText: 'NOCTURNAL STRATA // PARTLY CLOUDY',
        photoUrl: BACKGROUNDS['partly-night'],
        hasRain: false,
        hasSnow: false,
        hasStars: true,
      };
    case 'storm':
      return {
        scene,
        skyGradient:
          'radial-gradient(110% 90% at 50% 0%, rgba(139, 92, 246, 0.26) 0%, rgba(30, 27, 75, 0.8) 45%, rgba(7, 10, 22, 0.96) 100%)',
        orbPrimary: 'rgba(167, 139, 250, 0.28)',
        orbSecondary: 'rgba(244, 63, 94, 0.16)',
        accentHex: '#c084fc',
        badgeText: 'CONVECTIVE CELL // STORM ACTIVE',
        photoUrl: BACKGROUNDS.storm,
        hasRain: true,
        hasSnow: false,
        hasStars: false,
      };
    case 'rain':
      return {
        scene,
        skyGradient:
          'radial-gradient(110% 85% at 30% 0%, rgba(14, 165, 233, 0.24) 0%, rgba(15, 36, 66, 0.78) 48%, rgba(7, 13, 25, 0.95) 100%)',
        orbPrimary: 'rgba(56, 189, 248, 0.26)',
        orbSecondary: 'rgba(20, 184, 166, 0.18)',
        accentHex: '#38bdf8',
        badgeText: 'PRECIPITATION BAND // ACTIVE',
        photoUrl: BACKGROUNDS.rain,
        hasRain: true,
        hasSnow: false,
        hasStars: false,
      };
    case 'snow':
      return {
        scene,
        skyGradient:
          'radial-gradient(115% 85% at 30% 10%, rgba(186, 230, 253, 0.26) 0%, rgba(30, 58, 88, 0.72) 48%, rgba(11, 20, 36, 0.94) 100%)',
        orbPrimary: 'rgba(186, 230, 253, 0.28)',
        orbSecondary: 'rgba(125, 211, 252, 0.2)',
        accentHex: '#bae6fd',
        badgeText: 'CRYSTALLINE // SUB-ZERO ALOFT',
        photoUrl: BACKGROUNDS.snow,
        hasRain: false,
        hasSnow: true,
        hasStars: false,
      };
    case 'fog':
      return {
        scene,
        skyGradient:
          'radial-gradient(110% 85% at 40% 15%, rgba(148, 163, 184, 0.26) 0%, rgba(45, 58, 75, 0.78) 50%, rgba(12, 18, 28, 0.95) 100%)',
        orbPrimary: 'rgba(148, 163, 184, 0.24)',
        orbSecondary: 'rgba(94, 234, 212, 0.14)',
        accentHex: '#cbd5e1',
        badgeText: 'LOW VISIBILITY // MIST LAYER',
        photoUrl: BACKGROUNDS.fog,
        hasRain: false,
        hasSnow: false,
        hasStars: false,
      };
    default:
      return {
        scene,
        skyGradient:
          'radial-gradient(115% 85% at 25% 10%, rgba(56, 189, 248, 0.22) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(9, 14, 26, 0.95) 100%)',
        orbPrimary: 'rgba(148, 163, 184, 0.24)',
        orbSecondary: 'rgba(56, 189, 248, 0.18)',
        accentHex: '#7dd3fc',
        badgeText: 'STRATIFORM DECK // OVERCAST',
        photoUrl: BACKGROUNDS.cloudy,
        hasRain: false,
        hasSnow: false,
        hasStars: false,
      };
  }
}

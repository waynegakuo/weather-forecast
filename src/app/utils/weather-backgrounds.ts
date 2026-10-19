export type WeatherScene =
  | 'default'
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm';

/** Unsplash photos (free to use via CDN) — coastal default suits Mombasa. */
const BACKGROUNDS: Record<WeatherScene, string> = {
  default:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  clear:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
  partly:
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1920&q=80',
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

export function sceneForWeatherCode(code: number): WeatherScene {
  if (code === 0 || code === 1) {
    return 'clear';
  }
  if (code === 2) {
    return 'partly';
  }
  if (code === 3) {
    return 'cloudy';
  }
  if (code === 45 || code === 48) {
    return 'fog';
  }
  if (code >= 71 && code <= 77) {
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

export function backgroundImageForCode(code: number | undefined): string {
  const scene = code === undefined ? 'default' : sceneForWeatherCode(code);
  return BACKGROUNDS[scene];
}

export function overlayGradientForScene(scene: WeatherScene): string {
  switch (scene) {
    case 'clear':
      return 'linear-gradient(180deg, rgb(15 23 42 / 0.35) 0%, rgb(15 23 42 / 0.75) 100%)';
    case 'partly':
      return 'linear-gradient(180deg, rgb(30 41 59 / 0.45) 0%, rgb(15 23 42 / 0.82) 100%)';
    case 'storm':
      return 'linear-gradient(180deg, rgb(30 27 75 / 0.55) 0%, rgb(15 23 42 / 0.9) 100%)';
    case 'rain':
      return 'linear-gradient(180deg, rgb(15 40 71 / 0.5) 0%, rgb(15 23 42 / 0.88) 100%)';
    case 'snow':
      return 'linear-gradient(180deg, rgb(51 65 85 / 0.4) 0%, rgb(15 23 42 / 0.8) 100%)';
    case 'fog':
      return 'linear-gradient(180deg, rgb(71 85 105 / 0.5) 0%, rgb(15 23 42 / 0.85) 100%)';
    default:
      return 'linear-gradient(180deg, rgb(15 23 42 / 0.4) 0%, rgb(15 23 42 / 0.78) 100%)';
  }
}

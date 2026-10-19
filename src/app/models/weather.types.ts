export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export interface GeocodeResponse {
  results?: GeocodeResult[];
}

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  surface_pressure: number;
  uv_index: number;
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}

export interface CurrentWeatherView {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  weatherCode: number;
  description: string;
  icon: string;
  observedAt: Date;
  sunrise: Date;
  sunset: Date;
}

export interface DailyForecastView {
  date: Date;
  weatherCode: number;
  description: string;
  icon: string;
  tempMax: number;
  tempMin: number;
}

export interface WeatherBundle {
  locationLabel: string;
  timezone: string;
  current: CurrentWeatherView;
  daily: DailyForecastView[];
}

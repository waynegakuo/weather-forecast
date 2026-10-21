export type TemperatureUnit = 'C' | 'F';

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone: string;
  elevation?: number;
}

export interface GeocodeResponse {
  results?: GeocodeResult[];
}

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day?: number;
  precipitation?: number;
  weather_code: number;
  cloud_cover?: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m?: number;
  surface_pressure: number;
  uv_index: number;
  dew_point_2m?: number;
  visibility?: number;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  precipitation_probability?: number[];
  weather_code: number[];
  wind_speed_10m?: number[];
  is_day?: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max?: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
  wind_speed_10m_max?: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
  timezone_abbreviation?: string;
  current: OpenMeteoCurrent;
  hourly?: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

export interface CurrentWeatherView {
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  visibilityKm: number;
  cloudCover: number;
  precipitationMm: number;
  isDay: boolean;
  weatherCode: number;
  description: string;
  icon: string;
  observedAt: Date;
  sunrise: Date;
  sunset: Date;
}

export interface HourlyForecastView {
  time: Date;
  hourLabel: string;
  isNow: boolean;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  description: string;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecastView {
  date: Date;
  weatherCode: number;
  description: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  sunrise: Date;
  sunset: Date;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherBundle {
  locationName: string;
  regionLabel: string;
  country: string;
  countryCode: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  timezoneAbbreviation: string;
  current: CurrentWeatherView;
  hourly: HourlyForecastView[];
  daily: DailyForecastView[];
}

export interface RecentCityWeather {
  cityQuery: string;
  title: string;
  subtitle: string;
  temperatureC: number;
  weatherCode: number;
  isDay: boolean;
  bundle?: WeatherBundle;
}

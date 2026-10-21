import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import {
  DailyForecastView,
  GeocodeResponse,
  GeocodeResult,
  HourlyForecastView,
  OpenMeteoForecastResponse,
  WeatherBundle,
} from '../models/weather.types';
import { weatherFromCode } from '../utils/weather-code';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

@Injectable({ providedIn: 'root' })
export class OpenMeteoService {
  private readonly http = inject(HttpClient);

  suggestCities(query: string): Observable<GeocodeResult[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return of([]);
    }
    const params = new HttpParams()
      .set('name', trimmed)
      .set('count', '6')
      .set('language', 'en')
      .set('format', 'json');

    return this.http
      .get<GeocodeResponse>(GEOCODE_URL, { params })
      .pipe(map((body) => body.results ?? []));
  }

  searchCity(query: string): Observable<GeocodeResult> {
    const params = new HttpParams()
      .set('name', query.trim())
      .set('count', '1')
      .set('language', 'en')
      .set('format', 'json');

    return this.http.get<GeocodeResponse>(GEOCODE_URL, { params }).pipe(
      map((body) => {
        const hit = body.results?.[0];
        if (!hit) {
          throw new Error(`No station found for "${query.trim()}". Try another city or spelling.`);
        }
        return hit;
      }),
    );
  }

  fetchWeather(
    latitude: number,
    longitude: number,
    timezone: string,
  ): Observable<OpenMeteoForecastResponse> {
    const params = new HttpParams()
      .set('latitude', String(latitude))
      .set('longitude', String(longitude))
      .set('timezone', timezone || 'auto')
      .set('forecast_days', '7')
      .set(
        'current',
        [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'weather_code',
          'cloud_cover',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
          'uv_index',
          'dew_point_2m',
          'visibility',
        ].join(','),
      )
      .set(
        'hourly',
        [
          'temperature_2m',
          'precipitation_probability',
          'weather_code',
          'wind_speed_10m',
          'is_day',
        ].join(','),
      )
      .set(
        'daily',
        [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_probability_max',
          'precipitation_sum',
          'wind_speed_10m_max',
        ].join(','),
      );

    return this.http.get<OpenMeteoForecastResponse>(FORECAST_URL, { params });
  }

  loadCityWeather(cityQuery: string): Observable<WeatherBundle> {
    return this.searchCity(cityQuery).pipe(switchMap((place) => this.loadPlaceWeather(place)));
  }

  loadPlaceWeather(place: GeocodeResult): Observable<WeatherBundle> {
    return this.fetchWeather(place.latitude, place.longitude, place.timezone).pipe(
      map((raw) => this.toBundle(place, raw)),
    );
  }

  loadCoordinatesWeather(
    latitude: number,
    longitude: number,
    customName = 'Current Coordinates',
  ): Observable<WeatherBundle> {
    const syntheticPlace: GeocodeResult = {
      id: 0,
      name: customName,
      latitude,
      longitude,
      country: 'GPS Telemetry',
      country_code: 'GPS',
      timezone: 'auto',
    };
    return this.loadPlaceWeather(syntheticPlace);
  }

  private placeLabel(place: GeocodeResult): string {
    const region = place.admin1 ? `, ${place.admin1}` : '';
    return `${place.name}${region}, ${place.country}`;
  }

  private toBundle(place: GeocodeResult, raw: OpenMeteoForecastResponse): WeatherBundle {
    const currentMeta = weatherFromCode(raw.current.weather_code);
    const isDay = raw.current.is_day !== undefined ? raw.current.is_day === 1 : true;
    const visibilityMeters = raw.current.visibility ?? 10000;

    const current: WeatherBundle['current'] = {
      temperature: raw.current.temperature_2m,
      feelsLike: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      dewPoint:
        raw.current.dew_point_2m ??
        Math.round(raw.current.temperature_2m - (100 - raw.current.relative_humidity_2m) / 5),
      windSpeed: raw.current.wind_speed_10m,
      windGusts: raw.current.wind_gusts_10m ?? Math.round(raw.current.wind_speed_10m * 1.3),
      windDirection: raw.current.wind_direction_10m,
      pressure: raw.current.surface_pressure,
      uvIndex: raw.current.uv_index,
      visibilityKm: Math.round((visibilityMeters / 1000) * 10) / 10,
      cloudCover: raw.current.cloud_cover ?? 0,
      precipitationMm: raw.current.precipitation ?? 0,
      isDay,
      weatherCode: raw.current.weather_code,
      description: currentMeta.description,
      icon: currentMeta.icon,
      observedAt: new Date(raw.current.time),
      sunrise: new Date(raw.daily.sunrise[0]),
      sunset: new Date(raw.daily.sunset[0]),
    };

    const hourly = this.extractNext24Hours(raw);

    const daily: DailyForecastView[] = raw.daily.time.map((day, index) => {
      const code = raw.daily.weather_code[index];
      const meta = weatherFromCode(code);
      return {
        date: new Date(`${day}T12:00:00`),
        weatherCode: code,
        description: meta.description,
        icon: meta.icon,
        tempMax: raw.daily.temperature_2m_max[index],
        tempMin: raw.daily.temperature_2m_min[index],
        sunrise: new Date(raw.daily.sunrise[index] ?? raw.daily.sunrise[0]),
        sunset: new Date(raw.daily.sunset[index] ?? raw.daily.sunset[0]),
        uvIndexMax: raw.daily.uv_index_max?.[index] ?? current.uvIndex,
        precipitationProbabilityMax: raw.daily.precipitation_probability_max?.[index] ?? 0,
        precipitationSum: raw.daily.precipitation_sum?.[index] ?? 0,
        windSpeedMax: raw.daily.wind_speed_10m_max?.[index] ?? current.windSpeed,
      };
    });

    const regionParts = [place.admin1, place.country].filter(Boolean);

    return {
      locationName: place.name,
      regionLabel: regionParts.join(', '),
      countryCode: (place.country_code ?? '').toUpperCase(),
      locationLabel: this.placeLabel(place),
      latitude: raw.latitude,
      longitude: raw.longitude,
      elevation: Math.round(raw.elevation ?? place.elevation ?? 0),
      timezone: raw.timezone,
      timezoneAbbreviation: raw.timezone_abbreviation ?? 'UTC',
      current,
      hourly,
      daily,
    };
  }

  private extractNext24Hours(raw: OpenMeteoForecastResponse): HourlyForecastView[] {
    const hourlyRaw = raw.hourly;
    if (!hourlyRaw || !hourlyRaw.time?.length) {
      return [];
    }

    const currentHourPrefix = raw.current.time.slice(0, 13);
    let startIndex = hourlyRaw.time.findIndex((t) => t.slice(0, 13) >= currentHourPrefix);
    if (startIndex < 0) {
      startIndex = 0;
    }

    const sliceCount = 24;
    const result: HourlyForecastView[] = [];

    for (let offset = 0; offset < sliceCount; offset++) {
      const idx = startIndex + offset;
      if (idx >= hourlyRaw.time.length) {
        break;
      }
      const iso = hourlyRaw.time[idx];
      const code = hourlyRaw.weather_code[idx] ?? raw.current.weather_code;
      const meta = weatherFromCode(code);
      const hourPart = iso.split('T')[1]?.slice(0, 5) ?? '00:00';

      result.push({
        time: new Date(iso),
        hourLabel: offset === 0 ? 'Now' : hourPart,
        isNow: offset === 0,
        temperature:
          offset === 0 ? raw.current.temperature_2m : (hourlyRaw.temperature_2m[idx] ?? 0),
        precipitationProbability: hourlyRaw.precipitation_probability?.[idx] ?? 0,
        weatherCode: code,
        description: meta.shortLabel,
        windSpeed: hourlyRaw.wind_speed_10m?.[idx] ?? raw.current.wind_speed_10m,
        isDay:
          hourlyRaw.is_day?.[idx] !== undefined
            ? hourlyRaw.is_day[idx] === 1
            : raw.current.is_day !== 0,
      });
    }

    return result;
  }
}

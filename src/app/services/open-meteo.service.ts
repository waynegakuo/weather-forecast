import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import {
  DailyForecastView,
  GeocodeResponse,
  GeocodeResult,
  OpenMeteoForecastResponse,
  WeatherBundle,
} from '../models/weather.types';
import { weatherFromCode } from '../utils/weather-code';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

@Injectable({ providedIn: 'root' })
export class OpenMeteoService {
  private readonly http = inject(HttpClient);

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
          throw new Error(`No location found for "${query.trim()}". Try another spelling.`);
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
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'surface_pressure',
          'uv_index',
        ].join(','),
      )
      .set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset');

    return this.http.get<OpenMeteoForecastResponse>(FORECAST_URL, { params });
  }

  loadCityWeather(cityQuery: string): Observable<WeatherBundle> {
    return this.searchCity(cityQuery).pipe(
      switchMap((place) =>
        this.fetchWeather(place.latitude, place.longitude, place.timezone).pipe(
          map((raw) => this.toBundle(this.placeLabel(place), raw)),
        ),
      ),
    );
  }

  private placeLabel(place: GeocodeResult): string {
    const region = place.admin1 ? `, ${place.admin1}` : '';
    return `${place.name}${region}, ${place.country}`;
  }

  private toBundle(locationLabel: string, raw: OpenMeteoForecastResponse): WeatherBundle {
    const currentMeta = weatherFromCode(raw.current.weather_code);
    const current: WeatherBundle['current'] = {
      temperature: raw.current.temperature_2m,
      feelsLike: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      windSpeed: raw.current.wind_speed_10m,
      windDirection: raw.current.wind_direction_10m,
      pressure: raw.current.surface_pressure,
      uvIndex: raw.current.uv_index,
      weatherCode: raw.current.weather_code,
      description: currentMeta.description,
      icon: currentMeta.icon,
      observedAt: new Date(raw.current.time),
      sunrise: new Date(raw.daily.sunrise[0]),
      sunset: new Date(raw.daily.sunset[0]),
    };

    const daily: DailyForecastView[] = raw.daily.time.map((day, index) => {
      const code = raw.daily.weather_code[index];
      const meta = weatherFromCode(code);
      return {
        date: new Date(day),
        weatherCode: code,
        description: meta.description,
        icon: meta.icon,
        tempMax: raw.daily.temperature_2m_max[index],
        tempMin: raw.daily.temperature_2m_min[index],
      };
    });

    return {
      locationLabel,
      timezone: raw.timezone,
      current,
      daily,
    };
  }
}

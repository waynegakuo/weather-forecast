import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, required } from '@angular/forms/signals';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpenMeteoService } from '../../services/open-meteo.service';
import { GeocodeResult, TemperatureUnit, WeatherBundle } from '../../models/weather.types';
import {
  atmosphereForScene,
  backgroundImageForCode,
  overlayGradientForScene,
  sceneForWeatherCode,
} from '../../utils/weather-backgrounds';
import { WeatherSidebarComponent } from '../../components/weather-sidebar/weather-sidebar.component';
import { WeatherDetailsPanelComponent } from '../../components/weather-details-panel/weather-details-panel.component';

export const DEFAULT_CITY = 'Mombasa';

export interface WorldStationPreset {
  label: string;
  tag: string;
}

@Component({
  selector: 'app-weather-forecast',
  imports: [FormField, WeatherSidebarComponent, WeatherDetailsPanelComponent],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent {
  private readonly weatherApi = inject(OpenMeteoService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly cityModel = signal({ cityName: DEFAULT_CITY });

  readonly cityForm = form(this.cityModel, (schema) => {
    required(schema.cityName, { message: 'Enter a city name' });
  });

  readonly unit = signal<TemperatureUnit>('C');
  readonly loading = signal(false);
  readonly locatingGps = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly weather = signal<WeatherBundle | null>(null);

  readonly suggestions = signal<GeocodeResult[]>([]);
  readonly showSuggestions = signal(false);
  private readonly searchQuery$ = new Subject<string>();

  readonly worldStations: WorldStationPreset[] = [
    { label: 'Mombasa', tag: 'KE · 4°S' },
    { label: 'Nairobi', tag: 'KE · 1°S' },
    { label: 'Tokyo', tag: 'JP · 35°N' },
    { label: 'Reykjavik', tag: 'IS · 64°N' },
    { label: 'Zürich', tag: 'CH · 47°N' },
    { label: 'London', tag: 'GB · 51°N' },
    { label: 'New York', tag: 'US · 40°N' },
    { label: 'Cairo', tag: 'EG · 30°N' },
  ];

  readonly weatherCode = computed(() => this.weather()?.current.weatherCode);
  readonly isDay = computed(() => this.weather()?.current.isDay ?? true);

  readonly scene = computed(() =>
    this.weatherCode() === undefined
      ? 'default'
      : sceneForWeatherCode(this.weatherCode()!, this.isDay()),
  );

  readonly atmosphere = computed(() => atmosphereForScene(this.scene()));

  readonly backgroundImage = computed(() =>
    backgroundImageForCode(this.weatherCode(), this.isDay()),
  );

  readonly sceneOverlay = computed(() => overlayGradientForScene(this.scene()));

  constructor() {
    this.searchQuery$
      .pipe(
        debounceTime(220),
        distinctUntilChanged(),
        switchMap((q) => {
          if (q.trim().length < 2) {
            return of([]);
          }
          return this.weatherApi.suggestCities(q).pipe(catchError(() => of([])));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((list) => {
        this.suggestions.set(list);
      });

    afterNextRender(() => this.fetchWeather(DEFAULT_CITY));
  }

  onSearchInput(value: string): void {
    this.showSuggestions.set(true);
    this.searchQuery$.next(value);
  }

  selectSuggestion(place: GeocodeResult): void {
    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.cityModel.set({ cityName: place.name });
    this.loading.set(true);
    this.errorMessage.set(null);

    this.weatherApi.loadPlaceWeather(place).subscribe({
      next: (bundle) => {
        this.weather.set(bundle);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  selectPresetCity(cityName: string): void {
    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.cityModel.set({ cityName });
    this.fetchWeather(cityName);
  }

  search(): void {
    const city = this.cityForm.cityName().value().trim();
    if (!city || this.loading()) {
      return;
    }
    this.showSuggestions.set(false);
    this.fetchWeather(city);
  }

  setUnit(unit: TemperatureUnit): void {
    this.unit.set(unit);
  }

  useMyLocation(): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation || this.locatingGps()) {
      this.errorMessage.set('Geolocation is not supported by this browser.');
      return;
    }

    this.locatingGps.set(true);
    this.errorMessage.set(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.weatherApi
          .loadCoordinatesWeather(latitude, longitude, 'Local GPS Station')
          .subscribe({
            next: (bundle) => {
              this.weather.set(bundle);
              this.locatingGps.set(false);
            },
            error: (err: unknown) => {
              this.locatingGps.set(false);
              this.errorMessage.set(this.readError(err));
            },
          });
      },
      () => {
        this.locatingGps.set(false);
        this.errorMessage.set(
          'Location permission denied or unavailable. Search any city above instead.',
        );
      },
      { timeout: 10000 },
    );
  }

  isStationActive(cityName: string): boolean {
    const active = this.weather()?.locationName?.toLowerCase();
    return active === cityName.toLowerCase();
  }

  private fetchWeather(city: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.weatherApi.loadCityWeather(city).subscribe({
      next: (bundle) => {
        this.weather.set(bundle);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return err.error?.reason ?? err.message ?? 'Request failed.';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Something went wrong. Please try again.';
  }
}

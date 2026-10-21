import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, required } from '@angular/forms/signals';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpenMeteoService } from '../../services/open-meteo.service';
import {
  GeocodeResult,
  RecentCityWeather,
  TemperatureUnit,
  WeatherBundle,
} from '../../models/weather.types';
import {
  backgroundImageForCode,
  overlayGradientForScene,
  sceneForWeatherCode,
} from '../../utils/weather-backgrounds';
import { weatherFromCode } from '../../utils/weather-code';
import { WeatherSidebarComponent } from '../../components/weather-sidebar/weather-sidebar.component';
import { HourlyChartComponent } from '../../components/hourly-chart/hourly-chart.component';
import { WeekForecastComponent } from '../../components/week-forecast/week-forecast.component';
import { WeatherDetailsPanelComponent } from '../../components/weather-details-panel/weather-details-panel.component';
import { CitiesListTab } from '../../components/highlights-grid/highlights-grid.component';

export const DEFAULT_CITY = 'Mombasa';
const RECENT_STORAGE_KEY = 'weather_recent_cities_v1';

export type NavTab = 'home' | 'locations' | 'compass' | 'analytics' | 'settings';

@Component({
  selector: 'app-weather-forecast',
  imports: [
    DatePipe,
    FormField,
    WeatherSidebarComponent,
    HourlyChartComponent,
    WeekForecastComponent,
    WeatherDetailsPanelComponent,
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeSuggestions()',
  },
})
export class WeatherForecastComponent {
  private readonly weatherApi = inject(OpenMeteoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('cityInput');
  readonly searchContainerRef = viewChild<ElementRef<HTMLElement>>('searchContainer');

  private readonly cityModel = signal({ cityName: DEFAULT_CITY });

  readonly cityForm = form(this.cityModel, (schema) => {
    required(schema.cityName, { message: 'Enter a city name' });
  });

  readonly activeNav = signal<NavTab>('home');
  readonly citiesTab = signal<CitiesListTab>('popular');
  readonly unit = signal<TemperatureUnit>('C');
  readonly loading = signal(false);
  readonly locatingGps = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly weather = signal<WeatherBundle | null>(null);
  readonly lastUpdatedLabel = signal('Just now');

  readonly suggestions = signal<GeocodeResult[]>([]);
  readonly showSuggestions = signal(false);
  private readonly searchQuery$ = new Subject<string>();

  readonly popularCities = signal<RecentCityWeather[]>([
    {
      cityQuery: 'Nairobi',
      title: 'Nairobi, Kenya',
      subtitle: 'Partly Cloudy',
      temperatureC: 24,
      weatherCode: 2,
      isDay: true,
    },
    {
      cityQuery: 'London',
      title: 'London, UK',
      subtitle: 'Overcast',
      temperatureC: 15,
      weatherCode: 3,
      isDay: true,
    },
    {
      cityQuery: 'Tokyo',
      title: 'Tokyo, Japan',
      subtitle: 'Mostly Clear',
      temperatureC: 21,
      weatherCode: 1,
      isDay: true,
    },
    {
      cityQuery: 'New York',
      title: 'New York, USA',
      subtitle: 'Clear Sky',
      temperatureC: 19,
      weatherCode: 0,
      isDay: true,
    },
  ]);

  readonly recentCities = signal<RecentCityWeather[]>([]);

  readonly weatherCode = computed(() => this.weather()?.current.weatherCode);
  readonly isDay = computed(() => this.weather()?.current.isDay ?? true);

  readonly backgroundImage = computed(() =>
    backgroundImageForCode(this.weatherCode(), this.isDay()),
  );

  readonly sceneOverlay = computed(() =>
    overlayGradientForScene(
      this.weatherCode() === undefined
        ? 'default'
        : sceneForWeatherCode(this.weatherCode()!, this.isDay()),
    ),
  );

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

    afterNextRender(() => {
      this.restoreRecentFromStorage();
      this.fetchWeather(DEFAULT_CITY, false);
      this.hydratePopularCities();
    });
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.showSuggestions()) {
      return;
    }
    const container = this.searchContainerRef()?.nativeElement;
    const target = event.target as Node | null;
    if (container && target && !container.contains(target)) {
      this.showSuggestions.set(false);
    }
  }

  onInputClick(): void {
    if (this.showSuggestions()) {
      this.showSuggestions.set(false);
    } else if (this.suggestions().length > 0) {
      this.showSuggestions.set(true);
    }
  }

  closeSuggestions(): void {
    this.showSuggestions.set(false);
  }

  onNavClick(tab: NavTab): void {
    if (tab === 'settings') {
      this.toggleUnit();
      return;
    }
    this.activeNav.set(tab);
    if (tab === 'locations') {
      this.openSearch();
    }
  }

  openSearch(): void {
    setTimeout(() => {
      this.searchInputRef()?.nativeElement?.focus();
      this.searchInputRef()?.nativeElement?.select();
    }, 50);
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
        this.applyNewWeatherBundle(bundle, true);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  selectCityCard(item: RecentCityWeather): void {
    this.showSuggestions.set(false);
    this.cityModel.set({ cityName: item.cityQuery });
    if (item.bundle) {
      this.applyNewWeatherBundle(item.bundle, false);
      return;
    }
    this.fetchWeather(item.cityQuery, false);
  }

  search(): void {
    const city = this.cityForm.cityName().value().trim();
    if (!city || this.loading()) {
      return;
    }
    this.showSuggestions.set(false);
    this.fetchWeather(city, true);
  }

  refreshWeather(): void {
    const currentCity =
      this.weather()?.locationName ||
      this.cityForm.cityName().value().trim() ||
      DEFAULT_CITY;
    this.fetchWeather(currentCity, false);
  }

  toggleUnit(): void {
    this.unit.set(this.unit() === 'C' ? 'F' : 'C');
  }

  clearRecentCities(): void {
    this.recentCities.set([]);
    this.citiesTab.set('popular');
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
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
          .loadCoordinatesWeather(latitude, longitude, 'Current Location')
          .subscribe({
            next: (bundle) => {
              this.locatingGps.set(false);
              this.applyNewWeatherBundle(bundle, false);
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
          'Location permission denied or unavailable. Search a city above instead.',
        );
      },
      { timeout: 10000 },
    );
  }

  private fetchWeather(city: string, recordAsRecent: boolean): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.weatherApi.loadCityWeather(city).subscribe({
      next: (bundle) => {
        this.applyNewWeatherBundle(bundle, recordAsRecent);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private applyNewWeatherBundle(bundle: WeatherBundle, recordAsRecent: boolean): void {
    if (recordAsRecent) {
      this.saveToRecentCities(bundle);
      this.citiesTab.set('recent');
    }
    this.weather.set(bundle);
    this.loading.set(false);
    this.lastUpdatedLabel.set('Just now');
  }

  private saveToRecentCities(bundle: WeatherBundle): void {
    const meta = weatherFromCode(bundle.current.weatherCode);
    const countryLabel =
      bundle.countryCode === 'GB'
        ? 'UK'
        : bundle.countryCode === 'US'
          ? 'USA'
          : bundle.country || bundle.countryCode;

    const entry: RecentCityWeather = {
      cityQuery: bundle.locationName,
      title: `${bundle.locationName}${countryLabel ? ', ' + countryLabel : ''}`,
      subtitle: meta.shortLabel,
      temperatureC: bundle.current.temperature,
      weatherCode: bundle.current.weatherCode,
      isDay: bundle.current.isDay,
      bundle,
    };

    this.recentCities.update((list) => {
      const filtered = list.filter(
        (c) => c.cityQuery.toLowerCase() !== entry.cityQuery.toLowerCase(),
      );
      const updated = [entry, ...filtered].slice(0, 6);
      this.persistRecentToStorage(updated);
      return updated;
    });
  }

  private persistRecentToStorage(items: RecentCityWeather[]): void {
    try {
      const serializable = items.map(({ cityQuery, title, subtitle, temperatureC, weatherCode, isDay }) => ({
        cityQuery,
        title,
        subtitle,
        temperatureC,
        weatherCode,
        isDay,
      }));
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }

  private restoreRecentFromStorage(): void {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      if (!raw) {
        this.citiesTab.set('popular');
        return;
      }
      const parsed = JSON.parse(raw) as RecentCityWeather[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.recentCities.set(parsed);
        this.citiesTab.set('recent');
        // Refresh live weather for stored recent cities in background
        parsed.slice(0, 4).forEach((saved) => {
          this.weatherApi.loadCityWeather(saved.cityQuery).subscribe({
            next: (bundle) => {
              const meta = weatherFromCode(bundle.current.weatherCode);
              this.recentCities.update((list) => {
                const updated = list.map((item) =>
                  item.cityQuery.toLowerCase() === saved.cityQuery.toLowerCase()
                    ? {
                        ...item,
                        subtitle: meta.shortLabel,
                        temperatureC: bundle.current.temperature,
                        weatherCode: bundle.current.weatherCode,
                        isDay: bundle.current.isDay,
                        bundle,
                      }
                    : item,
                );
                this.persistRecentToStorage(updated);
                return updated;
              });
            },
            error: () => {},
          });
        });
      } else {
        this.citiesTab.set('popular');
      }
    } catch {
      this.citiesTab.set('popular');
    }
  }

  private hydratePopularCities(): void {
    this.popularCities().forEach((preset) => {
      this.weatherApi.loadCityWeather(preset.cityQuery).subscribe({
        next: (bundle) => {
          const meta = weatherFromCode(bundle.current.weatherCode);
          this.popularCities.update((list) =>
            list.map((item) =>
              item.cityQuery.toLowerCase() === preset.cityQuery.toLowerCase()
                ? {
                    ...item,
                    subtitle: meta.shortLabel,
                    temperatureC: bundle.current.temperature,
                    weatherCode: bundle.current.weatherCode,
                    isDay: bundle.current.isDay,
                    bundle,
                  }
                : item,
            ),
          );
        },
        error: () => {},
      });
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

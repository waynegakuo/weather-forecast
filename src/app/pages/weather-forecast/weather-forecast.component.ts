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

export const DEFAULT_CITY = 'Mombasa';

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
  readonly unit = signal<TemperatureUnit>('C');
  readonly loading = signal(false);
  readonly locatingGps = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly weather = signal<WeatherBundle | null>(null);
  readonly lastUpdatedLabel = signal('Just now');

  readonly suggestions = signal<GeocodeResult[]>([]);
  readonly showSuggestions = signal(false);
  private readonly searchQuery$ = new Subject<string>();

  readonly recentCities = signal<RecentCityWeather[]>([
    {
      cityQuery: 'Liverpool',
      title: 'Liverpool, UK',
      subtitle: 'Partly Cloudy',
      temperatureC: 16,
      weatherCode: 2,
      isDay: true,
    },
    {
      cityQuery: 'Palermo',
      title: 'Palermo, Italy',
      subtitle: 'Rain/Thunder',
      temperatureC: 19,
      weatherCode: 95,
      isDay: true,
    },
    {
      cityQuery: 'Nairobi',
      title: 'Nairobi, Kenya',
      subtitle: 'Mostly Clear',
      temperatureC: 24,
      weatherCode: 1,
      isDay: true,
    },
    {
      cityQuery: 'Brooklyn',
      title: 'Brooklyn, USA',
      subtitle: 'Overcast',
      temperatureC: 18,
      weatherCode: 3,
      isDay: true,
    },
  ]);

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
      this.fetchWeather(DEFAULT_CITY);
      this.hydrateInitialRecentCities();
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
        this.applyNewWeatherBundle(bundle);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  selectRecentCity(item: RecentCityWeather): void {
    this.showSuggestions.set(false);
    this.cityModel.set({ cityName: item.cityQuery });
    if (item.bundle) {
      this.applyNewWeatherBundle(item.bundle);
      return;
    }
    this.fetchWeather(item.cityQuery);
  }

  search(): void {
    const city = this.cityForm.cityName().value().trim();
    if (!city || this.loading()) {
      return;
    }
    this.showSuggestions.set(false);
    this.fetchWeather(city);
  }

  refreshWeather(): void {
    const currentCity =
      this.weather()?.locationName ||
      this.cityForm.cityName().value().trim() ||
      DEFAULT_CITY;
    this.fetchWeather(currentCity);
  }

  toggleUnit(): void {
    this.unit.set(this.unit() === 'C' ? 'F' : 'C');
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
              this.applyNewWeatherBundle(bundle);
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

  private fetchWeather(city: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.weatherApi.loadCityWeather(city).subscribe({
      next: (bundle) => {
        this.applyNewWeatherBundle(bundle);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private applyNewWeatherBundle(bundle: WeatherBundle): void {
    const previous = this.weather();
    if (
      previous &&
      previous.locationName.toLowerCase() !== bundle.locationName.toLowerCase()
    ) {
      this.upsertRecentCity(previous);
    }
    this.weather.set(bundle);
    this.loading.set(false);
    this.lastUpdatedLabel.set('Just now');
  }

  private upsertRecentCity(bundle: WeatherBundle): void {
    const meta = weatherFromCode(bundle.current.weatherCode);
    const entry: RecentCityWeather = {
      cityQuery: bundle.locationName,
      title: `${bundle.locationName}, ${bundle.country || bundle.countryCode}`,
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
      return [entry, ...filtered].slice(0, 5);
    });
  }

  private hydrateInitialRecentCities(): void {
    ['Liverpool', 'Palermo'].forEach((cityQuery) => {
      this.weatherApi.loadCityWeather(cityQuery).subscribe({
        next: (bundle) => {
          const meta = weatherFromCode(bundle.current.weatherCode);
          this.recentCities.update((list) =>
            list.map((item) =>
              item.cityQuery.toLowerCase() === cityQuery.toLowerCase()
                ? {
                    cityQuery: bundle.locationName,
                    title: `${bundle.locationName}, ${bundle.countryCode === 'GB' ? 'UK' : bundle.country}`,
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
        error: () => {
          // Keep default fallback entry if offline
        },
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

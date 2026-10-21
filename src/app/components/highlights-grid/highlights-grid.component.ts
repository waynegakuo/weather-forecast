import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  CurrentWeatherView,
  HourlyForecastView,
  RecentCityWeather,
  TemperatureUnit,
} from '../../models/weather.types';
import {
  compassDirection,
  formatTemp,
  fullCompassDirection,
  uvRiskMeta,
} from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

export type CitiesListTab = 'popular' | 'recent';

export interface LiveWavePoint {
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
  tempC: number;
  label: string;
}

@Component({
  selector: 'app-highlights-grid',
  imports: [DatePipe, WeatherIconComponent],
  templateUrl: './highlights-grid.component.html',
  styleUrl: './highlights-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex h-full min-h-0 flex-col',
  },
})
export class HighlightsGridComponent {
  readonly current = input.required<CurrentWeatherView>();
  readonly hourly = input<HourlyForecastView[]>([]);
  readonly unit = input<TemperatureUnit>('C');
  readonly popularCities = input<RecentCityWeather[]>([]);
  readonly recentCities = input<RecentCityWeather[]>([]);
  readonly citiesTab = input<CitiesListTab>('popular');
  readonly showExtendedMetrics = input<boolean>(false);

  readonly selectCity = output<RecentCityWeather>();
  readonly citiesTabChange = output<CitiesListTab>();
  readonly clearRecent = output<void>();
  readonly toggleExtendedMetrics = output<void>();

  readonly showAllCities = signal(false);
  readonly hoveredWaveIndex = signal<number | null>(null);

  readonly waveWidth = 360;
  readonly waveHeight = 72;

  readonly windDirectionFull = computed(() =>
    fullCompassDirection(this.current().windDirection),
  );
  readonly windCompassShort = computed(() =>
    compassDirection(this.current().windDirection),
  );
  readonly uvMeta = computed(() => uvRiskMeta(this.current().uvIndex));

  readonly pressureKpa = computed(() => {
    const kpa = this.current().pressure / 10;
    return kpa.toFixed(1);
  });

  readonly feelsLikeTemp = computed(() =>
    formatTemp(this.current().feelsLike, this.unit()),
  );

  readonly activeTabCities = computed(() => {
    return this.citiesTab() === 'recent'
      ? this.recentCities()
      : this.popularCities();
  });

  readonly primaryCities = computed(() => {
    return this.activeTabCities().slice(0, 2);
  });

  readonly extraCities = computed(() => {
    return this.activeTabCities().slice(2, 4);
  });

  readonly isWindMapCompact = computed(
    () => (this.showAllCities() && this.extraCities().length > 0) || this.showExtendedMetrics(),
  );

  readonly liveWavePoints = computed<LiveWavePoint[]>(() => {
    const hrs = this.hourly().slice(0, 8);
    const c = this.current();
    const width = this.waveWidth;
    const height = this.waveHeight;
    const padX = 14;
    const topY = 14;
    const bottomY = height - 14;

    const rawTemps =
      hrs.length >= 4
        ? hrs.map((h) => h.temperature)
        : [
            c.temperature - 2,
            c.temperature - 0.8,
            c.temperature + 1.2,
            c.feelsLike,
            c.temperature + 0.5,
            c.temperature - 1.1,
          ];

    const labels =
      hrs.length >= 4
        ? hrs.map((h) => h.hourLabel)
        : ['Now', '+2h', '+4h', '+6h', '+8h', '+10h'];

    const minT = Math.min(...rawTemps);
    const maxT = Math.max(...rawTemps);
    const span = Math.max(2, maxT - minT);

    return rawTemps.map((t, i) => {
      const x =
        padX + (i / Math.max(1, rawTemps.length - 1)) * (width - padX * 2);
      const norm = (t - minT) / span;
      const y = bottomY - norm * (bottomY - topY);
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        xPercent: Math.round((x / width) * 1000) / 10,
        yPercent: Math.round((y / height) * 1000) / 10,
        tempC: t,
        label: labels[i] ?? '',
      };
    });
  });

  readonly liveWavePath = computed(() => {
    const pts = this.liveWavePoints();
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const midX = (curr.x + next.x) / 2;
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  });

  readonly liveWaveAreaPath = computed(() => {
    const pts = this.liveWavePoints();
    const line = this.liveWavePath();
    if (!line || pts.length < 2) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${line} L ${last.x} ${this.waveHeight} L ${first.x} ${this.waveHeight} Z`;
  });

  readonly activeWaveDot = computed<LiveWavePoint>(() => {
    const pts = this.liveWavePoints();
    if (!pts.length) {
      return {
        x: 180,
        y: 36,
        xPercent: 50,
        yPercent: 50,
        tempC: this.current().temperature,
        label: 'Now',
      };
    }
    const hovered = this.hoveredWaveIndex();
    if (hovered !== null && pts[hovered]) {
      return pts[hovered];
    }
    const c = this.current();
    const targetIdx = Math.min(
      pts.length - 1,
      Math.max(1, Math.round((c.humidity / 100) * (pts.length - 2))),
    );
    return pts[targetIdx];
  });

  readonly liveConditionBadge = computed(() => {
    const c = this.current();
    const hrs = this.hourly().slice(0, 8);
    let trendPct = 0;

    if (hrs.length >= 2) {
      const first = hrs[0].temperature;
      const peak = Math.max(...hrs.map((h) => h.temperature));
      const base = Math.max(10, Math.abs(first));
      trendPct = ((peak - first) / base) * 100;
    }

    const arrow = trendPct >= 0 ? '↑' : '↓';
    const absVal = Math.max(1.2, Math.abs(trendPct) + c.humidity * 0.18);
    const deltaText = `${arrow} ${absVal.toFixed(1)}%`;

    if (c.weatherCode >= 95 || c.windSpeed >= 40) {
      return {
        deltaText,
        statusLabel: 'Dangerous',
        badgeClass: 'border-red-400/25 bg-[#7f2d2d]/85 text-red-100',
      };
    }
    if (c.uvIndex >= 7 || c.temperature >= 32) {
      return {
        deltaText,
        statusLabel: 'High UV',
        badgeClass: 'border-amber-400/25 bg-[#7a4b24]/85 text-amber-50',
      };
    }
    if (c.weatherCode >= 51 && c.weatherCode <= 82) {
      return {
        deltaText,
        statusLabel: 'Wet Conditions',
        badgeClass: 'border-sky-400/25 bg-sky-900/70 text-sky-100',
      };
    }
    if (c.humidity >= 78) {
      return {
        deltaText,
        statusLabel: 'High Humidity',
        badgeClass: 'border-amber-400/25 bg-[#7a4b24]/85 text-amber-50',
      };
    }
    return {
      deltaText,
      statusLabel: 'Optimal',
      badgeClass: 'border-emerald-400/25 bg-emerald-950/80 text-emerald-100',
    };
  });

  readonly windTargetCompassAngle = computed(() => {
    return (this.current().windDirection + 180) % 360;
  });

  readonly windFlowRotation = computed(() => {
    return (this.current().windDirection + 90) % 360;
  });

  readonly windStreamDuration = computed(() => {
    const speed = Math.max(1, this.current().windSpeed);
    const seconds = Math.max(1.1, Math.min(7.5, 18 / Math.sqrt(speed)));
    return `${seconds.toFixed(2)}s`;
  });

  readonly windIntensityMeta = computed(() => {
    const s = this.current().windSpeed;
    if (s < 2) {
      return { beaufort: 0, label: 'Calm Air', activeBars: 1 };
    }
    if (s < 12) {
      return { beaufort: 2, label: 'Light Breeze', activeBars: 1 };
    }
    if (s < 20) {
      return { beaufort: 3, label: 'Gentle Breeze', activeBars: 2 };
    }
    if (s < 29) {
      return { beaufort: 4, label: 'Moderate Breeze', activeBars: 3 };
    }
    if (s < 39) {
      return { beaufort: 5, label: 'Fresh Breeze', activeBars: 4 };
    }
    return { beaufort: 6, label: 'Strong Wind', activeBars: 5 };
  });

  formatCityTemp(celsius: number): number {
    return formatTemp(celsius, this.unit());
  }

  round(value: number): number {
    return Math.round(value);
  }
}

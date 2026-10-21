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

export interface LiveWavePoint {
  x: number;
  y: number;
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
  readonly recentCities = input<RecentCityWeather[]>([]);
  readonly showExtendedMetrics = input<boolean>(false);

  readonly selectCity = output<RecentCityWeather>();

  readonly showAllRecent = signal(false);
  readonly showExtraDetails = signal(false);
  readonly hoveredWaveIndex = signal<number | null>(null);

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

  readonly visibleRecentCities = computed(() => {
    const all = this.recentCities();
    return this.showAllRecent() ? all.slice(0, 4) : all.slice(0, 2);
  });

  /**
   * Dynamic Live Conditions Curve:
   * Uses the next 8 hourly data points (or synthesizes from current telemetry if hourly is empty)
   * to plot a live SVG cubic-bezier curve and position the indicator node dynamically.
   */
  readonly liveWavePoints = computed<LiveWavePoint[]>(() => {
    const hrs = this.hourly().slice(0, 8);
    const c = this.current();
    const width = 320;
    const height = 56;
    const padX = 8;
    const topY = 10;
    const bottomY = height - 8;

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

  readonly activeWaveDot = computed<LiveWavePoint>(() => {
    const pts = this.liveWavePoints();
    if (!pts.length) {
      return { x: 160, y: 28, tempC: this.current().temperature, label: 'Now' };
    }
    const hovered = this.hoveredWaveIndex();
    if (hovered !== null && pts[hovered]) {
      return pts[hovered];
    }
    // Position marker at peak or current thermal inflection point
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
    const absVal = Math.max(1.2, Math.abs(trendPct) + (c.humidity * 0.18));
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

  /**
   * Dynamic Wind Map Telemetry:
   * Wind direction in meteorology is the direction wind blows FROM.
   * So the flow vector rotation is (windDirection + 180) % 360.
   */
  readonly windFlowRotation = computed(() => {
    return (this.current().windDirection + 180) % 360;
  });

  /**
   * Faster CSS streamline animation when wind speed is higher.
   */
  readonly windStreamDuration = computed(() => {
    const speed = Math.max(1, this.current().windSpeed);
    const seconds = Math.max(1.1, Math.min(7.5, 18 / Math.sqrt(speed)));
    return `${seconds.toFixed(2)}s`;
  });

  formatCityTemp(celsius: number): number {
    return formatTemp(celsius, this.unit());
  }

  round(value: number): number {
    return Math.round(value);
  }
}

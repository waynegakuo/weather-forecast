import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DailyForecastView, TemperatureUnit } from '../../models/weather.types';
import { formatTemp } from '../../utils/weather-code';
import { ForecastDayCardComponent } from '../forecast-day-card/forecast-day-card.component';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

export interface DailyRangeRow {
  day: DailyForecastView;
  index: number;
  minDisplay: number;
  maxDisplay: number;
  barLeftPercent: number;
  barWidthPercent: number;
  currentDotPercent: number | null;
}

@Component({
  selector: 'app-week-forecast',
  imports: [DatePipe, DecimalPipe, ForecastDayCardComponent, WeatherIconComponent],
  templateUrl: './week-forecast.component.html',
  styleUrl: './week-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekForecastComponent {
  readonly daily = input.required<DailyForecastView[]>();
  readonly currentTemp = input<number | undefined>(undefined);
  readonly unit = input<TemperatureUnit>('C');

  readonly viewMode = signal<'bars' | 'cards'>('bars');
  readonly selectedIndex = signal<number>(0);

  readonly rows = computed<DailyRangeRow[]>(() => {
    const days = this.daily();
    const u = this.unit();
    if (!days.length) return [];

    const mins = days.map((d) => d.tempMin);
    const maxs = days.map((d) => d.tempMax);
    const weekMin = Math.min(...mins);
    const weekMax = Math.max(...maxs);
    const span = Math.max(1, weekMax - weekMin);
    const curr = this.currentTemp();

    return days.map((day, index) => {
      const left = ((day.tempMin - weekMin) / span) * 100;
      const width = Math.max(8, ((day.tempMax - day.tempMin) / span) * 100);

      let currentDotPercent: number | null = null;
      if (index === 0 && curr !== undefined) {
        const clamped = Math.max(day.tempMin, Math.min(day.tempMax, curr));
        currentDotPercent = Math.max(2, Math.min(98, ((clamped - weekMin) / span) * 100));
      }

      return {
        day,
        index,
        minDisplay: formatTemp(day.tempMin, u),
        maxDisplay: formatTemp(day.tempMax, u),
        barLeftPercent: Math.max(0, Math.min(92, left)),
        barWidthPercent: Math.min(100 - Math.max(0, left), width),
        currentDotPercent,
      };
    });
  });

  readonly selectedDay = computed<DailyRangeRow | null>(() => {
    const list = this.rows();
    return list[this.selectedIndex()] ?? list[0] ?? null;
  });

  round(val: number): number {
    return Math.round(val);
  }
}

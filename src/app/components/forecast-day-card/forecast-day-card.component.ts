import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DailyForecastView, TemperatureUnit } from '../../models/weather.types';
import { formatTemp } from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-forecast-day-card',
  imports: [DatePipe, WeatherIconComponent],
  templateUrl: './forecast-day-card.component.html',
  styleUrl: './forecast-day-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'enterClass()',
  },
})
export class ForecastDayCardComponent {
  readonly day = input.required<DailyForecastView>();
  readonly index = input(0);
  readonly unit = input<TemperatureUnit>('C');
  readonly selected = input(false);

  readonly tempMax = computed(() => formatTemp(this.day().tempMax, this.unit()));
  readonly tempMin = computed(() => formatTemp(this.day().tempMin, this.unit()));

  readonly enterClass = computed(() => {
    const stagger = Math.min(this.index(), 6) + 1;
    const active = this.selected()
      ? 'border-white/[0.16] bg-white/[0.075] shadow-md'
      : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.055]';
    return `animate-fade-up stagger-${stagger} ${active} flex flex-col items-center justify-between rounded-[1.25rem] border px-2 py-3 text-center transition-all cursor-pointer select-none`;
  });
}

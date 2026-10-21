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
      ? 'ring-1 ring-sky-400/50 bg-white/[0.09]'
      : 'bg-white/[0.03] hover:bg-white/[0.06]';
    return `instrument-subcard animate-fade-up stagger-${stagger} ${active} block rounded-2xl p-3.5 text-center transition-all cursor-pointer`;
  });
}

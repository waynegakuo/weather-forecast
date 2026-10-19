import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DailyForecastView } from '../../models/weather.types';

@Component({
  selector: 'app-forecast-day-card',
  imports: [DatePipe, DecimalPipe],
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

  readonly enterClass = computed(() => {
    const stagger = Math.min(this.index(), 6) + 1;
    return `glass-card animate-fade-up stagger-${stagger} block rounded-2xl p-4 text-center`;
  });
}

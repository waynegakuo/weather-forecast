import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { DailyForecastView, TemperatureUnit } from '../../models/weather.types';
import { ForecastDayCardComponent } from '../forecast-day-card/forecast-day-card.component';

@Component({
  selector: 'app-week-forecast',
  imports: [ForecastDayCardComponent],
  templateUrl: './week-forecast.component.html',
  styleUrl: './week-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekForecastComponent {
  readonly daily = input.required<DailyForecastView[]>();
  readonly currentTemp = input<number | undefined>(undefined);
  readonly unit = input<TemperatureUnit>('C');

  readonly selectedIndex = signal<number>(0);
}

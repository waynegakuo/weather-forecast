import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DailyForecastView } from '../../models/weather.types';
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
}

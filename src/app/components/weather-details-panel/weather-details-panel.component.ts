import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TemperatureUnit, WeatherBundle } from '../../models/weather.types';
import { HourlyChartComponent } from '../hourly-chart/hourly-chart.component';
import { WeekForecastComponent } from '../week-forecast/week-forecast.component';
import { HighlightsGridComponent } from '../highlights-grid/highlights-grid.component';

@Component({
  selector: 'app-weather-details-panel',
  imports: [HourlyChartComponent, WeekForecastComponent, HighlightsGridComponent],
  templateUrl: './weather-details-panel.component.html',
  styleUrl: './weather-details-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherDetailsPanelComponent {
  readonly weather = input.required<WeatherBundle>();
  readonly unit = input<TemperatureUnit>('C');
}

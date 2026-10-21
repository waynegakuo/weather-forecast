import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  RecentCityWeather,
  TemperatureUnit,
  WeatherBundle,
} from '../../models/weather.types';
import { HighlightsGridComponent } from '../highlights-grid/highlights-grid.component';

@Component({
  selector: 'app-weather-details-panel',
  imports: [HighlightsGridComponent],
  templateUrl: './weather-details-panel.component.html',
  styleUrl: './weather-details-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex h-full min-h-0 flex-col',
  },
})
export class WeatherDetailsPanelComponent {
  readonly weather = input.required<WeatherBundle>();
  readonly unit = input<TemperatureUnit>('C');
  readonly recentCities = input<RecentCityWeather[]>([]);
  readonly showExtendedMetrics = input<boolean>(false);

  readonly selectCity = output<RecentCityWeather>();
}

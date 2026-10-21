import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TemperatureUnit, WeatherBundle } from '../../models/weather.types';
import { backgroundImageForCode } from '../../utils/weather-backgrounds';
import {
  buildEditorialNarrative,
  formatTemp,
  weatherFromCode,
} from '../../utils/weather-code';

@Component({
  selector: 'app-weather-sidebar',
  imports: [],
  templateUrl: './weather-sidebar.component.html',
  styleUrl: './weather-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-1 min-h-[200px] flex-col',
  },
})
export class WeatherSidebarComponent {
  readonly weather = input.required<WeatherBundle>();
  readonly unit = input<TemperatureUnit>('C');

  readonly currentTemp = computed(() =>
    formatTemp(this.weather().current.temperature, this.unit()),
  );

  readonly todayHigh = computed(() => {
    const today = this.weather().daily[0];
    return today ? formatTemp(today.tempMax, this.unit()) : this.currentTemp();
  });

  readonly todayLow = computed(() => {
    const today = this.weather().daily[0];
    return today ? formatTemp(today.tempMin, this.unit()) : this.currentTemp();
  });

  readonly presentation = computed(() =>
    weatherFromCode(this.weather().current.weatherCode),
  );

  readonly heroPhoto = computed(() =>
    backgroundImageForCode(
      this.weather().current.weatherCode,
      this.weather().current.isDay,
    ),
  );

  readonly narrative = computed(() =>
    buildEditorialNarrative(
      this.weather().current,
      this.weather().daily[0],
      this.unit(),
    ),
  );
}

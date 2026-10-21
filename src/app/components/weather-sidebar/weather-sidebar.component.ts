import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TemperatureUnit, WeatherBundle } from '../../models/weather.types';
import {
  buildEditorialNarrative,
  formatCoordinates,
  formatTemp,
} from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-weather-sidebar',
  imports: [DatePipe, WeatherIconComponent],
  templateUrl: './weather-sidebar.component.html',
  styleUrl: './weather-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherSidebarComponent {
  readonly weather = input.required<WeatherBundle>();
  readonly unit = input<TemperatureUnit>('C');

  readonly currentTemp = computed(() =>
    formatTemp(this.weather().current.temperature, this.unit()),
  );
  readonly feelsLikeTemp = computed(() =>
    formatTemp(this.weather().current.feelsLike, this.unit()),
  );
  readonly todayHigh = computed(() => {
    const today = this.weather().daily[0];
    return today ? formatTemp(today.tempMax, this.unit()) : this.currentTemp();
  });
  readonly todayLow = computed(() => {
    const today = this.weather().daily[0];
    return today ? formatTemp(today.tempMin, this.unit()) : this.currentTemp();
  });

  readonly coordinatesLabel = computed(() =>
    formatCoordinates(this.weather().latitude, this.weather().longitude),
  );

  readonly narrative = computed(() =>
    buildEditorialNarrative(
      this.weather().current,
      this.weather().daily[0],
      this.unit(),
    ),
  );

  round(val: number): number {
    return Math.round(val);
  }
}

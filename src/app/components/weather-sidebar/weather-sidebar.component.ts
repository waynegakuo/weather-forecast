import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TemperatureUnit, WeatherBundle } from '../../models/weather.types';
import { backgroundImageForBundle } from '../../utils/weather-backgrounds';
import {
  buildEditorialNarrative,
  formatTemp,
  uvRiskMeta,
  weatherFromCode,
} from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-weather-sidebar',
  imports: [DatePipe, WeatherIconComponent],
  templateUrl: './weather-sidebar.component.html',
  styleUrl: './weather-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-1 min-h-[168px] flex-col',
  },
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

  readonly uvBadge = computed(() => {
    const uv = Math.round(this.weather().current.uvIndex);
    return `UV ${uv} · ${uvRiskMeta(uv).level}`;
  });

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
    backgroundImageForBundle(this.weather()),
  );

  readonly narrative = computed(() =>
    buildEditorialNarrative(
      this.weather().current,
      this.weather().daily[0],
      this.unit(),
    ),
  );
}

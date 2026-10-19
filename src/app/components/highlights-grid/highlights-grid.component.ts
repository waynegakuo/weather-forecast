import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrentWeatherView } from '../../models/weather.types';

interface HighlightStat {
  label: string;
  value: string;
  unit: string;
  icon: string;
}

@Component({
  selector: 'app-highlights-grid',
  imports: [DatePipe],
  templateUrl: './highlights-grid.component.html',
  styleUrl: './highlights-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightsGridComponent {
  readonly current = input.required<CurrentWeatherView>();

  stats(current: CurrentWeatherView): HighlightStat[] {
    return [
      { label: 'UV index', value: String(Math.round(current.uvIndex)), unit: '', icon: '☀️' },
      { label: 'Wind', value: String(Math.round(current.windSpeed)), unit: 'km/h', icon: '💨' },
      { label: 'Feels like', value: String(Math.round(current.feelsLike)), unit: '°C', icon: '🌡️' },
      { label: 'Humidity', value: String(Math.round(current.humidity)), unit: '%', icon: '💧' },
      { label: 'Wind direction', value: String(Math.round(current.windDirection)), unit: '°', icon: '🧭' },
      { label: 'Pressure', value: String(Math.round(current.pressure)), unit: 'hPa', icon: '📊' },
    ];
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { WeatherBundle } from '../../models/weather.types';

@Component({
  selector: 'app-weather-sidebar',
  imports: [DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './weather-sidebar.component.html',
  styleUrl: './weather-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherSidebarComponent {
  readonly weather = input.required<WeatherBundle>();
}

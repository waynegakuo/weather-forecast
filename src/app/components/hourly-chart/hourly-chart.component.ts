import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { HourlyForecastView, TemperatureUnit } from '../../models/weather.types';
import { formatTemp } from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

export interface HourlySlotView {
  data: HourlyForecastView;
  index: number;
  displayTemp: number;
}

@Component({
  selector: 'app-hourly-chart',
  standalone: true,
  imports: [WeatherIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="matte-card rounded-[1.35rem] p-2.5 sm:p-3"
      aria-label="Hourly forecast"
    >
      <div class="hourly-strip flex items-stretch justify-between gap-1 overflow-x-auto no-scrollbar">
        @for (slot of slots(); track slot.index) {
          <button
            type="button"
            class="flex min-w-[4.1rem] flex-1 flex-col items-center justify-between rounded-2xl px-2 py-2.5 transition-all focus:outline-none"
            [class.bg-white/[0.06]]="selectedIndex() === slot.index"
            [class.border]="selectedIndex() === slot.index"
            [class.border-white/[0.12]]="selectedIndex() === slot.index"
            [class.shadow-sm]="selectedIndex() === slot.index"
            [class.border-transparent]="selectedIndex() !== slot.index"
            [class.hover:bg-white/[0.03]]="selectedIndex() !== slot.index"
            (click)="selectedIndex.set(slot.index)"
          >
            <!-- Time Label -->
            <span
              class="text-xs tracking-normal"
              [class.font-medium]="slot.data.isNow || selectedIndex() === slot.index"
              [class.text-white]="slot.data.isNow || selectedIndex() === slot.index"
              [class.text-white/65]="!slot.data.isNow && selectedIndex() !== slot.index"
            >
              {{ slot.data.hourLabel }}
            </span>

            <!-- Optional Rain Probability + Weather Icon -->
            <div class="my-2 flex flex-col items-center justify-center">
              @if (slot.data.precipitationProbability >= 15) {
                <span class="mb-0.5 text-[10px] font-medium text-sky-400">
                  {{ slot.data.precipitationProbability }}%
                </span>
              } @else {
                <span class="mb-0.5 h-[14px]" aria-hidden="true"></span>
              }
              <app-weather-icon
                [code]="slot.data.weatherCode"
                [isDay]="slot.data.isDay"
                [size]="28"
              />
            </div>

            <!-- Temperature -->
            <span class="text-sm sm:text-base font-medium text-white">
              {{ slot.displayTemp }}°
            </span>
          </button>
        }
      </div>
    </section>
  `,
})
export class HourlyChartComponent {
  readonly hourly = input.required<HourlyForecastView[]>();
  readonly unit = input<TemperatureUnit>('C');

  readonly selectedIndex = signal<number>(0);

  readonly slots = computed<HourlySlotView[]>(() => {
    const items = this.hourly().slice(0, 8);
    const u = this.unit();
    return items.map((data, index) => ({
      data,
      index,
      displayTemp: formatTemp(data.temperature, u),
    }));
  });
}

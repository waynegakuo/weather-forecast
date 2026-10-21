import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrentWeatherView, TemperatureUnit } from '../../models/weather.types';
import {
  beaufortLabel,
  compassDirection,
  formatTemp,
  humidityComfortMeta,
  pressureMeta,
  uvRiskMeta,
} from '../../utils/weather-code';

@Component({
  selector: 'app-highlights-grid',
  imports: [DatePipe],
  templateUrl: './highlights-grid.component.html',
  styleUrl: './highlights-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightsGridComponent {
  readonly current = input.required<CurrentWeatherView>();
  readonly unit = input<TemperatureUnit>('C');

  readonly windCompass = computed(() => compassDirection(this.current().windDirection));
  readonly beaufort = computed(() => beaufortLabel(this.current().windSpeed));
  readonly uvMeta = computed(() => uvRiskMeta(this.current().uvIndex));
  readonly humidityMeta = computed(() =>
    humidityComfortMeta(this.current().humidity, this.current().dewPoint),
  );
  readonly baroMeta = computed(() => pressureMeta(this.current().pressure));

  readonly feelsLikeDisplay = computed(() => formatTemp(this.current().feelsLike, this.unit()));
  readonly dewPointDisplay = computed(() => formatTemp(this.current().dewPoint, this.unit()));

  readonly thermalDelta = computed(() => {
    const diff = Math.round(this.current().feelsLike - this.current().temperature);
    if (Math.abs(diff) <= 1) {
      return { badge: 'Aligned with air temp', note: 'Wind and humidity balance out thermal feel.' };
    }
    if (diff > 1) {
      return {
        badge: `+${diff}° warmer perception`,
        note: 'Ambient moisture elevates apparent heat index.',
      };
    }
    return {
      badge: `${diff}° cooler perception`,
      note: 'Surface breeze accelerates convective cooling.',
    };
  });

  readonly solarTelemetry = computed(() => {
    const c = this.current();
    const rise = c.sunrise.getTime();
    const set = c.sunset.getTime();
    const now = c.observedAt.getTime();

    const daylightMs = Math.max(0, set - rise);
    const totalMins = Math.round(daylightMs / 60000);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const durationLabel = `${hours}h ${String(mins).padStart(2, '0')}m`;

    let progress = 0.5;
    let isDaylight = c.isDay;
    let phaseLabel = 'Daylight Transit';

    if (daylightMs > 0) {
      if (now < rise) {
        progress = 0;
        isDaylight = false;
        phaseLabel = 'Pre-Dawn Horizon';
      } else if (now > set) {
        progress = 1;
        isDaylight = false;
        phaseLabel = 'Post-Sunset Twilight';
      } else {
        progress = (now - rise) / daylightMs;
        isDaylight = true;
        if (progress < 0.12 || progress > 0.88) {
          phaseLabel = 'Golden Hour';
        } else if (progress > 0.42 && progress < 0.58) {
          phaseLabel = 'Solar Zenith';
        } else {
          phaseLabel = 'Daylight Transit';
        }
      }
    }

    // Parabolic curve across x: [24..236], horizon at y = 78, zenith at y = 20
    const sunX = 24 + progress * 212;
    const norm = 4 * progress * (1 - progress); // 0 at ends, 1 at midpoint
    const sunY = isDaylight ? 78 - norm * 56 : 86;

    return {
      durationLabel,
      phaseLabel,
      isDaylight,
      progressPercent: Math.round(progress * 100),
      sunX: Math.round(sunX * 10) / 10,
      sunY: Math.round(sunY * 10) / 10,
    };
  });

  readonly baroNeedleAngle = computed(() => {
    const pct = this.baroMeta().normalizedPercent;
    return -90 + (pct / 100) * 180;
  });

  round(value: number): number {
    return Math.round(value);
  }
}

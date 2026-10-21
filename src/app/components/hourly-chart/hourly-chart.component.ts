import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { HourlyForecastView, TemperatureUnit } from '../../models/weather.types';
import { formatTemp } from '../../utils/weather-code';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

interface PlottedHour {
  data: HourlyForecastView;
  index: number;
  x: number;
  y: number;
  displayTemp: number;
}

@Component({
  selector: 'app-hourly-chart',
  standalone: true,
  imports: [WeatherIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="instrument-card relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="hourly-heading">
      <!-- Header bar with interactive scrub readout -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
          <h2 id="hourly-heading" class="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            24-Hour Atmospheric Curve
          </h2>
        </div>

        @if (activeHour(); as active) {
          <div class="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs">
            <span class="font-mono font-semibold text-sky-300">{{ active.data.hourLabel }}</span>
            <span class="h-3 w-px bg-white/15"></span>
            <span class="font-display font-bold text-white">{{ active.displayTemp }}°{{ unit() }}</span>
            <span class="text-slate-300">{{ active.data.description }}</span>
            @if (active.data.precipitationProbability > 0) {
              <span class="inline-flex items-center gap-1 font-mono text-sky-300">
                <svg class="h-3 w-3 fill-sky-400" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 1.5C8 1.5 3 6.9 3 10.2C3 12.9 5.2 15 8 15C10.8 15 13 12.9 13 10.2C13 6.9 8 1.5 8 1.5Z" />
                </svg>
                {{ active.data.precipitationProbability }}%
              </span>
            }
            <span class="hidden font-mono text-slate-400 sm:inline">{{ round(active.data.windSpeed) }} km/h</span>
          </div>
        }
      </div>

      <!-- Horizontal scrollable 24h telemetry canvas -->
      <div class="hourly-scroll mt-4 overflow-x-auto pb-2">
        <div class="relative min-w-[960px]" [style.width.px]="canvasWidth()">
          <!-- SVG Cubic Bezier Temperature Curve -->
          <svg
            class="pointer-events-none block w-full overflow-visible"
            [attr.viewBox]="'0 0 ' + canvasWidth() + ' ' + svgHeight"
            [attr.height]="svgHeight"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="hourlyAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.28" />
                <stop offset="65%" stop-color="#818cf8" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="hourlyStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#fbbf24" />
                <stop offset="35%" stop-color="#38bdf8" />
                <stop offset="70%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
            </defs>

            <!-- Subtle horizontal guide lines -->
            <line x1="0" y1="28" [attr.x2]="canvasWidth()" y2="28" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 6" />
            <line x1="0" y1="68" [attr.x2]="canvasWidth()" y2="68" stroke="rgba(255,255,255,0.04)" stroke-dasharray="3 6" />
            <line x1="0" y1="108" [attr.x2]="canvasWidth()" y2="108" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 6" />

            <!-- Area under curve -->
            @if (areaPath()) {
              <path [attr.d]="areaPath()" fill="url(#hourlyAreaFill)" />
            }

            <!-- Smooth spline stroke -->
            @if (linePath()) {
              <path
                [attr.d]="linePath()"
                fill="none"
                stroke="url(#hourlyStrokeGrad)"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            }

            <!-- Active vertical guide line & node -->
            @if (activeHour(); as active) {
              <line
                [attr.x1]="active.x"
                y1="10"
                [attr.x2]="active.x"
                [attr.y2]="svgHeight"
                stroke="rgba(125, 211, 252, 0.35)"
                stroke-width="1"
                stroke-dasharray="2 3"
              />
            }

            <!-- Temperature points & labels -->
            @for (pt of plotted(); track pt.index) {
              <g>
                <text
                  [attr.x]="pt.x"
                  [attr.y]="pt.y - 12"
                  text-anchor="middle"
                  class="fill-white font-mono text-[12px] font-semibold"
                >
                  {{ pt.displayTemp }}°
                </text>
                @if (pt.data.isNow || hoveredIndex() === pt.index) {
                  <circle
                    [attr.cx]="pt.x"
                    [attr.cy]="pt.y"
                    r="6"
                    fill="rgba(56, 189, 248, 0.28)"
                  />
                  <circle
                    [attr.cx]="pt.x"
                    [attr.cy]="pt.y"
                    r="3.5"
                    fill="#ffffff"
                    stroke="#38bdf8"
                    stroke-width="2"
                  />
                } @else {
                  <circle
                    [attr.cx]="pt.x"
                    [attr.cy]="pt.y"
                    r="2.5"
                    fill="#bae6fd"
                    opacity="0.85"
                  />
                }
              </g>
            }
          </svg>

          <!-- Interactive Hour Columns underneath -->
          <div class="mt-1 grid" [style.grid-template-columns]="'repeat(' + plotted().length + ', minmax(0, 1fr))'">
            @for (pt of plotted(); track pt.index) {
              <button
                type="button"
                class="group flex flex-col items-center rounded-xl py-2 transition-colors hover:bg-white/[0.06] focus:outline-none"
                [class.bg-white/[0.07]]="hoveredIndex() === pt.index || (hoveredIndex() === null && pt.data.isNow)"
                (mouseenter)="hoveredIndex.set(pt.index)"
                (focus)="hoveredIndex.set(pt.index)"
                (click)="hoveredIndex.set(pt.index)"
              >
                <app-weather-icon [code]="pt.data.weatherCode" [isDay]="pt.data.isDay" [size]="28" />

                <!-- Precipitation probability bar & label -->
                <div class="mt-1.5 flex h-4 items-center justify-center">
                  @if (pt.data.precipitationProbability >= 10) {
                    <span class="font-mono text-[10px] font-semibold text-sky-300">
                      {{ pt.data.precipitationProbability }}%
                    </span>
                  } @else {
                    <span class="font-mono text-[10px] text-slate-600">·</span>
                  }
                </div>

                <!-- Time label -->
                <span
                  class="mt-1 font-mono text-[11px] tracking-tight transition-colors"
                  [class.font-bold]="pt.data.isNow"
                  [class.text-amber-300]="pt.data.isNow"
                  [class.text-slate-300]="!pt.data.isNow"
                >
                  {{ pt.data.hourLabel }}
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HourlyChartComponent {
  readonly hourly = input.required<HourlyForecastView[]>();
  readonly unit = input<TemperatureUnit>('C');

  readonly hoveredIndex = signal<number | null>(null);

  readonly colWidth = 54;
  readonly svgHeight = 126;

  readonly canvasWidth = computed(() => Math.max(640, this.hourly().length * this.colWidth));

  readonly plotted = computed<PlottedHour[]>(() => {
    const items = this.hourly();
    const u = this.unit();
    if (!items.length) {
      return [];
    }

    const temps = items.map((h) => formatTemp(h.temperature, u));
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const span = Math.max(4, maxT - minT);

    const topPad = 32;
    const bottomPad = 18;
    const usableH = this.svgHeight - topPad - bottomPad;

    return items.map((h, i) => {
      const displayTemp = temps[i];
      const norm = (displayTemp - minT) / span;
      const x = i * this.colWidth + this.colWidth / 2;
      const y = topPad + (1 - norm) * usableH;
      return {
        data: h,
        index: i,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        displayTemp,
      };
    });
  });

  readonly activeHour = computed<PlottedHour | null>(() => {
    const pts = this.plotted();
    if (!pts.length) return null;
    const idx = this.hoveredIndex();
    if (idx !== null && pts[idx]) {
      return pts[idx];
    }
    return pts[0];
  });

  readonly linePath = computed(() => {
    const pts = this.plotted();
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const midX = (curr.x + next.x) / 2;
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  });

  readonly areaPath = computed(() => {
    const pts = this.plotted();
    const line = this.linePath();
    if (!line || pts.length < 2) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${line} L ${last.x} ${this.svgHeight} L ${first.x} ${this.svgHeight} Z`;
  });

  round(value: number): number {
    return Math.round(value);
  }
}

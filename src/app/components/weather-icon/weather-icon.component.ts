import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { glyphForWeather, WeatherGlyphKind } from '../../utils/weather-code';

let nextInstanceId = 0;

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      user-select: none;
    }
    .wi-svg {
      overflow: visible;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.24));
    }
    .wi-sun-rays {
      transform-origin: 32px 32px;
      animation: wi-spin 28s linear infinite;
    }
    .wi-cloud-drift {
      animation: wi-float 5.5s ease-in-out infinite;
    }
    .wi-cloud-drift-alt {
      animation: wi-float-alt 6.5s ease-in-out infinite;
    }
    .wi-rain-drop-1 {
      animation: wi-rain 1.6s ease-in-out infinite;
    }
    .wi-rain-drop-2 {
      animation: wi-rain 1.6s ease-in-out 0.55s infinite;
    }
    .wi-rain-drop-3 {
      animation: wi-rain 1.6s ease-in-out 1.1s infinite;
    }
    .wi-bolt {
      animation: wi-flash 3s ease-in-out infinite;
    }
    .wi-star-1 {
      animation: wi-twinkle 2.8s ease-in-out infinite;
    }
    .wi-star-2 {
      animation: wi-twinkle 3.4s ease-in-out 1.1s infinite;
    }
    @keyframes wi-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes wi-float {
      0%,
      100% {
        transform: translateX(0px) translateY(0px);
      }
      50% {
        transform: translateX(1.8px) translateY(-1.2px);
      }
    }
    @keyframes wi-float-alt {
      0%,
      100% {
        transform: translateX(0px);
      }
      50% {
        transform: translateX(-2px);
      }
    }
    @keyframes wi-rain {
      0%,
      100% {
        opacity: 0.45;
        transform: translate(0, 0);
      }
      50% {
        opacity: 1;
        transform: translate(-1.5px, 2.5px);
      }
    }
    @keyframes wi-flash {
      0%,
      85%,
      100% {
        opacity: 0.88;
        filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.4));
      }
      90% {
        opacity: 1;
        filter: drop-shadow(0 0 12px rgba(253, 224, 71, 0.95));
      }
    }
    @keyframes wi-twinkle {
      0%,
      100% {
        opacity: 0.35;
        transform: scale(0.9);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  `,
  template: `
    <svg
      class="wi-svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient [attr.id]="uid + '-sun'" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFFBEB" />
          <stop offset="45%" stop-color="#FDE047" />
          <stop offset="100%" stop-color="#F59E0B" />
        </radialGradient>

        <linearGradient [attr.id]="uid + '-moon'" x1="16" y1="12" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F8FAFC" />
          <stop offset="55%" stop-color="#C7D2FE" />
          <stop offset="100%" stop-color="#818CF8" />
        </linearGradient>

        <linearGradient [attr.id]="uid + '-cloud-light'" x1="18" y1="20" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="65%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#94A3B8" />
        </linearGradient>

        <linearGradient [attr.id]="uid + '-cloud-dark'" x1="16" y1="18" x2="48" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#94A3B8" />
          <stop offset="60%" stop-color="#64748B" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>

        <linearGradient [attr.id]="uid + '-rain'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7DD3FC" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>

        <linearGradient [attr.id]="uid + '-bolt'" x1="28" y1="34" x2="36" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="50%" stop-color="#FACC15" />
          <stop offset="100%" stop-color="#EA580C" />
        </linearGradient>
      </defs>

      @switch (glyph()) {
        @case ('clear-day') {
          <circle cx="32" cy="32" r="21" fill="#F59E0B" opacity="0.16" />
          <g class="wi-sun-rays" stroke="#FBBF24" stroke-width="2.4" stroke-linecap="round" opacity="0.85">
            <line x1="32" y1="6" x2="32" y2="11" />
            <line x1="32" y1="53" x2="32" y2="58" />
            <line x1="6" y1="32" x2="11" y2="32" />
            <line x1="53" y1="32" x2="58" y2="32" />
            <line x1="13.6" y1="13.6" x2="17.2" y2="17.2" />
            <line x1="46.8" y1="46.8" x2="50.4" y2="50.4" />
            <line x1="50.4" y1="13.6" x2="46.8" y2="17.2" />
            <line x1="17.2" y1="46.8" x2="13.6" y2="50.4" />
          </g>
          <circle cx="32" cy="32" r="14.5" [attr.fill]="'url(#' + uid + '-sun)'" />
          <circle cx="27" cy="26" r="4" fill="#FFFFFF" opacity="0.45" />
        }

        @case ('clear-night') {
          <circle cx="32" cy="32" r="20" fill="#6366F1" opacity="0.16" />
          <g class="wi-star-1" fill="#E0E7FF">
            <path d="M16 14L17.2 16.8L20 18L17.2 19.2L16 22L14.8 19.2L12 18L14.8 16.8L16 14Z" />
          </g>
          <g class="wi-star-2" fill="#A5B4FC">
            <path d="M49 15L49.8 17.2L52 18L49.8 18.8L49 21L48.2 18.8L46 18L48.2 17.2L49 15Z" />
          </g>
          <path
            d="M39.5 15.5C35.8 15.5 32.4 16.9 29.8 19.5C24.4 24.9 24.4 33.7 29.8 39.1C34.5 43.8 41.8 44.4 47.2 40.9C44.9 45.6 39.9 48.8 34.2 48.8C26.1 48.8 19.5 42.2 19.5 34.1C19.5 24.8 27.9 16.9 39.5 15.5Z"
            [attr.fill]="'url(#' + uid + '-moon)'"
          />
        }

        @case ('partly-day') {
          <g transform="translate(-5, -5)">
            <circle cx="27" cy="25" r="11" [attr.fill]="'url(#' + uid + '-sun)'" />
            <g stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round" opacity="0.8">
              <line x1="27" y1="8" x2="27" y2="11" />
              <line x1="10" y1="25" x2="13" y2="25" />
              <line x1="15" y1="13" x2="17.2" y2="15.2" />
              <line x1="39" y1="13" x2="36.8" y2="15.2" />
            </g>
          </g>
          <g class="wi-cloud-drift">
            <path
              d="M21 46H45.5C50.2 46 54 42.2 54 37.5C54 33.1 50.7 29.5 46.4 29.1C45.1 22.8 39.5 18 32.8 18C25.1 18 18.9 24.2 18.9 31.9C18.9 32.4 18.9 32.9 19 33.4C15.6 34.2 13 37.3 13 41C13 43.8 16.5 46 21 46Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
        }

        @case ('partly-night') {
          <path
            d="M31 11C28 11 25.2 12.2 23 14.3C18.6 18.7 18.6 25.9 23 30.3C26.8 34.1 32.8 34.6 37.2 31.8C35.3 35.6 31.3 38.2 26.6 38.2C20 38.2 14.6 32.8 14.6 26.2C14.6 18.6 21.5 12.1 31 11Z"
            [attr.fill]="'url(#' + uid + '-moon)'"
          />
          <circle class="wi-star-1" cx="48" cy="16" r="1.6" fill="#E0E7FF" />
          <g class="wi-cloud-drift">
            <path
              d="M21 47H45.5C50.2 47 54 43.2 54 38.5C54 34.1 50.7 30.5 46.4 30.1C45.1 23.8 39.5 19 32.8 19C25.1 19 18.9 25.2 18.9 32.9C18.9 33.4 18.9 33.9 19 34.4C15.6 35.2 13 38.3 13 42C13 44.8 16.5 47 21 47Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
        }

        @case ('overcast') {
          <g class="wi-cloud-drift-alt" opacity="0.72">
            <path
              d="M25 38H48C51.9 38 55 34.9 55 31C55 27.4 52.3 24.4 48.7 24.1C47.6 18.9 43 15 37.5 15C31.1 15 26 20.1 26 26.5C26 26.9 26 27.3 26.1 27.7C23.3 28.4 21 30.9 21 34C21 36.3 22.8 38 25 38Z"
              [attr.fill]="'url(#' + uid + '-cloud-dark)'"
            />
          </g>
          <g class="wi-cloud-drift">
            <path
              d="M18 47H43.5C48.2 47 52 43.2 52 38.5C52 34.1 48.7 30.5 44.4 30.1C43.1 23.8 37.5 19 30.8 19C23.1 19 16.9 25.2 16.9 32.9C16.9 33.4 16.9 33.9 17 34.4C13.6 35.2 11 38.3 11 42C11 44.8 14.1 47 18 47Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
        }

        @case ('fog') {
          <g class="wi-cloud-drift">
            <path
              d="M19 37H44.5C48.6 37 52 33.6 52 29.5C52 25.6 49 22.4 45.2 22.1C44 16.5 39 12.2 33 12.2C26.2 12.2 20.7 17.7 20.7 24.5C20.7 25 20.7 25.4 20.8 25.8C17.8 26.5 15.5 29.2 15.5 32.5C15.5 35 17 37 19 37Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
              opacity="0.85"
            />
          </g>
          <g stroke="#CBD5E1" stroke-width="3" stroke-linecap="round">
            <line x1="14" y1="43" x2="50" y2="43" opacity="0.9" />
            <line x1="18" y1="49.5" x2="46" y2="49.5" opacity="0.7" />
            <line x1="23" y1="55.5" x2="41" y2="55.5" opacity="0.45" />
          </g>
        }

        @case ('drizzle') {
          <circle cx="23" cy="21" r="9" [attr.fill]="'url(#' + uid + '-sun)'" opacity="0.9" />
          <g class="wi-cloud-drift">
            <path
              d="M19 41H44.5C49.2 41 53 37.2 53 32.5C53 28.1 49.7 24.5 45.4 24.1C44.1 17.8 38.5 13 31.8 13C24.1 13 17.9 19.2 17.9 26.9C17.9 27.4 17.9 27.9 18 28.4C14.6 29.2 12 32.3 12 36C12 38.8 15.1 41 19 41Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
          <g [attr.stroke]="'url(#' + uid + '-rain)'" stroke-width="2.6" stroke-linecap="round">
            <line class="wi-rain-drop-1" x1="24" y1="46" x2="21.5" y2="53" />
            <line class="wi-rain-drop-2" x1="33" y1="46" x2="30.5" y2="53" />
            <line class="wi-rain-drop-3" x1="42" y1="46" x2="39.5" y2="53" />
          </g>
        }

        @case ('rain') {
          <g class="wi-cloud-drift">
            <path
              d="M18 40H44.5C49.2 40 53 36.2 53 31.5C53 27.1 49.7 23.5 45.4 23.1C44.1 16.8 38.5 12 31.8 12C24.1 12 17.9 18.2 17.9 25.9C17.9 26.4 17.9 26.9 18 27.4C14.6 28.2 12 31.3 12 35C12 37.8 14.6 40 18 40Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
          <g [attr.stroke]="'url(#' + uid + '-rain)'" stroke-width="2.8" stroke-linecap="round">
            <line class="wi-rain-drop-1" x1="22" y1="45" x2="18.5" y2="55" />
            <line class="wi-rain-drop-2" x1="32" y1="45" x2="28.5" y2="55" />
            <line class="wi-rain-drop-3" x1="42" y1="45" x2="38.5" y2="55" />
          </g>
        }

        @case ('heavy-rain') {
          <path
            d="M24 35H48C51.9 35 55 31.9 55 28C55 24.4 52.3 21.4 48.7 21.1C47.6 15.9 43 12 37.5 12C31.1 12 26 17.1 26 23.5"
            [attr.fill]="'url(#' + uid + '-cloud-dark)'"
            opacity="0.8"
          />
          <g class="wi-cloud-drift">
            <path
              d="M17 40H43.5C48.2 40 52 36.2 52 31.5C52 27.1 48.7 23.5 44.4 23.1C43.1 16.8 37.5 12 30.8 12C23.1 12 16.9 18.2 16.9 25.9C16.9 26.4 16.9 26.9 17 27.4C13.6 28.2 11 31.3 11 35C11 37.8 13.6 40 17 40Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
          <g [attr.stroke]="'url(#' + uid + '-rain)'" stroke-width="2.8" stroke-linecap="round">
            <line class="wi-rain-drop-1" x1="19" y1="44" x2="15" y2="56" />
            <line class="wi-rain-drop-2" x1="27.5" y1="44" x2="23.5" y2="56" />
            <line class="wi-rain-drop-3" x1="36" y1="44" x2="32" y2="56" />
            <line class="wi-rain-drop-1" x1="44.5" y1="44" x2="40.5" y2="56" />
          </g>
        }

        @case ('snow') {
          <g class="wi-cloud-drift">
            <path
              d="M18 40H44.5C49.2 40 53 36.2 53 31.5C53 27.1 49.7 23.5 45.4 23.1C44.1 16.8 38.5 12 31.8 12C24.1 12 17.9 18.2 17.9 25.9C17.9 26.4 17.9 26.9 18 27.4C14.6 28.2 12 31.3 12 35C12 37.8 14.6 40 18 40Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
          <g fill="#E0F2FE">
            <circle class="wi-rain-drop-1" cx="22" cy="48" r="2.5" />
            <circle class="wi-rain-drop-2" cx="32" cy="52" r="2.8" />
            <circle class="wi-rain-drop-3" cx="42" cy="48" r="2.5" />
          </g>
        }

        @case ('thunderstorm') {
          <path
            d="M23 36H48C51.9 36 55 32.9 55 29C55 25.4 52.3 22.4 48.7 22.1C47.6 16.9 43 13 37.5 13C31.1 13 26 18.1 26 24.5"
            [attr.fill]="'url(#' + uid + '-cloud-dark)'"
          />
          <g class="wi-cloud-drift">
            <path
              d="M17 40H43.5C48.2 40 52 36.2 52 31.5C52 27.1 48.7 23.5 44.4 23.1C43.1 16.8 37.5 12 30.8 12C23.1 12 16.9 18.2 16.9 25.9C16.9 26.4 16.9 26.9 17 27.4C13.6 28.2 11 31.3 11 35C11 37.8 13.6 40 17 40Z"
              [attr.fill]="'url(#' + uid + '-cloud-light)'"
            />
          </g>
          <path
            class="wi-bolt"
            d="M33.5 36L24.5 47.5H31.5L29 58.5L40.5 45.5H33L33.5 36Z"
            [attr.fill]="'url(#' + uid + '-bolt)'"
          />
          <g [attr.stroke]="'url(#' + uid + '-rain)'" stroke-width="2.4" stroke-linecap="round">
            <line class="wi-rain-drop-1" x1="19" y1="45" x2="16.5" y2="52" />
            <line class="wi-rain-drop-3" x1="44" y1="45" x2="41.5" y2="52" />
          </g>
        }
      }
    </svg>
  `,
})
export class WeatherIconComponent {
  readonly code = input.required<number>();
  readonly isDay = input<boolean>(true);
  readonly size = input<number>(48);

  readonly uid = `wi-${++nextInstanceId}`;

  readonly glyph = computed<WeatherGlyphKind>(() => glyphForWeather(this.code(), this.isDay()));
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, required } from '@angular/forms/signals';
import { OpenMeteoService } from '../../services/open-meteo.service';
import { WeatherBundle } from '../../models/weather.types';
import { backdropForCode } from '../../utils/weather-code';
import { WeatherSidebarComponent } from '../../components/weather-sidebar/weather-sidebar.component';
import { WeatherDetailsPanelComponent } from '../../components/weather-details-panel/weather-details-panel.component';

@Component({
  selector: 'app-weather-forecast',
  imports: [FormField, WeatherSidebarComponent, WeatherDetailsPanelComponent],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent {
  private readonly weatherApi = inject(OpenMeteoService);

  private readonly cityModel = signal({ cityName: '' });

  readonly cityForm = form(this.cityModel, (schema) => {
    required(schema.cityName, { message: 'Enter a city name' });
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly weather = signal<WeatherBundle | null>(null);

  readonly backdropClass = computed(() => {
    const code = this.weather()?.current.weatherCode ?? 3;
    return backdropForCode(code);
  });

  search(): void {
    const city = this.cityForm.cityName().value().trim();
    if (!city || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.weatherApi.loadCityWeather(city).subscribe({
      next: (bundle) => {
        this.weather.set(bundle);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return err.error?.reason ?? err.message ?? 'Request failed.';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Something went wrong. Please try again.';
  }
}

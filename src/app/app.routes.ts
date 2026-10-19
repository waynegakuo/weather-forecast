import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/weather-forecast/weather-forecast.component').then(
        (m) => m.WeatherForecastComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];

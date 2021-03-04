import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./modules/weather-forecast/weather-forecast.module').then(m => m.WeatherForecastModule)
  },
  {
    path: 'weather', loadChildren: () => import('./modules/weather-forecast/weather-forecast.module').then(m => m.WeatherForecastModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

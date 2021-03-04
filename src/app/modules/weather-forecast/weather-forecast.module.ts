import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherForecastRoutingModule } from './weather-forecast-routing.module';
import { WeatherForecastComponent } from './weather-forecast.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [WeatherForecastComponent],
  imports: [
    CommonModule,
    WeatherForecastRoutingModule,
    SharedModule
  ]
})
export class WeatherForecastModule { }

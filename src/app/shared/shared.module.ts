import { WeekForecastComponent } from './../components/week-forecast/week-forecast.component';
import { WeatherDetailsComponent } from './../components/weather-details/weather-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { SmallForecastCardComponent } from './components/small-forecast-card/small-forecast-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';



@NgModule({
  declarations: [
    WeatherDetailsComponent,
    DetailsCardComponent,
    SmallForecastCardComponent,
    WeekForecastComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    WeatherDetailsComponent,
    DetailsCardComponent,
    SmallForecastCardComponent,
    WeekForecastComponent,
    SidebarComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }

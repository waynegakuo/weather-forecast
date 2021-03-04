import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.scss']
})
export class WeatherDetailsComponent implements OnInit {

  @Input() weatherForecast;
  @Input() weekForecastData;

  constructor() { }

  ngOnInit(): void {
  }

}

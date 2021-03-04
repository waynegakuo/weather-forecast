import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-week-forecast',
  templateUrl: './week-forecast.component.html',
  styleUrls: ['./week-forecast.component.scss']
})
export class WeekForecastComponent implements OnInit {
  @Input() weekForecast;

  daysWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor() { }

  ngOnInit(): void {
  }

}

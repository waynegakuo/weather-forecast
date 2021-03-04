import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-forecast-card',
  templateUrl: './small-forecast-card.component.html',
  styleUrls: ['./small-forecast-card.component.scss']
})
export class SmallForecastCardComponent implements OnInit {
  @Input() dailyForecast;

  constructor() { }

  ngOnInit(): void {
  }

}

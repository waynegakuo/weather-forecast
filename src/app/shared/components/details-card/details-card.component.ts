import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss']
})
export class DetailsCardComponent implements OnInit {
  @Input() weatherForecast;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() weatherForecast; // Info coming from parent component
  @Input() imageURL;
  @Input() location;
  @Input() currentTime;
  @Input() weatherDescription;

  constructor() { }

  ngOnInit(): void {
  }

}

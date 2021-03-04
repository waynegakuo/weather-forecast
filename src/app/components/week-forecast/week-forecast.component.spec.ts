import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekForecastComponent } from './week-forecast.component';

describe('WeekForecastComponent', () => {
  let component: WeekForecastComponent;
  let fixture: ComponentFixture<WeekForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekForecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

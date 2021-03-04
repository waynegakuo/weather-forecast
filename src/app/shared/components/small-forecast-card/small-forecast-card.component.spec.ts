import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallForecastCardComponent } from './small-forecast-card.component';

describe('SmallForecastCardComponent', () => {
  let component: SmallForecastCardComponent;
  let fixture: ComponentFixture<SmallForecastCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallForecastCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallForecastCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

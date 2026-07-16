import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelBookingReportComponent } from './travel-booking-report.component';

describe('TravelBookingReportComponent', () => {
  let component: TravelBookingReportComponent;
  let fixture: ComponentFixture<TravelBookingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelBookingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

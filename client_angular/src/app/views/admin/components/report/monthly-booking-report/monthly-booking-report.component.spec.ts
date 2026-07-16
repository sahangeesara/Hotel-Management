import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBookingReportComponent } from './monthly-booking-report.component';

describe('MonthlyBookingReportComponent', () => {
  let component: MonthlyBookingReportComponent;
  let fixture: ComponentFixture<MonthlyBookingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBookingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

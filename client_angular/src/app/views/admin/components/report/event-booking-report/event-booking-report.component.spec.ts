import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBookingReportComponent } from './event-booking-report.component';

describe('EventBookingReportComponent', () => {
  let component: EventBookingReportComponent;
  let fixture: ComponentFixture<EventBookingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBookingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

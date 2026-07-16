import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRoomTrendReportComponent } from './booking-room-trend-report.component';

describe('BookingRoomTrendReportComponent', () => {
  let component: BookingRoomTrendReportComponent;
  let fixture: ComponentFixture<BookingRoomTrendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRoomTrendReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRoomTrendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

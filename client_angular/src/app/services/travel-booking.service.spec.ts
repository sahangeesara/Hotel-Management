import { TestBed } from '@angular/core/testing';

import { TravelBookingService } from './travel-booking.service';

describe('TravelBookingService', () => {
  let service: TravelBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

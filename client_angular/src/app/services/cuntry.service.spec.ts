import { TestBed } from '@angular/core/testing';

import { CuntryService } from './cuntry.service';

describe('CuntryService', () => {
  let service: CuntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

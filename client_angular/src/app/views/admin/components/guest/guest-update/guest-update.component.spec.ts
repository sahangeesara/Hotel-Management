import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestUpdateComponent } from './guest-update.component';

describe('GuestUpdateComponent', () => {
  let component: GuestUpdateComponent;
  let fixture: ComponentFixture<GuestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

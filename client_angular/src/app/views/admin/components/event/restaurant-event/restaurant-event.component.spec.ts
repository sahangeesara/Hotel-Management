import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantEventComponent } from './restaurant-event.component';

describe('RestaurantEventComponent', () => {
  let component: RestaurantEventComponent;
  let fixture: ComponentFixture<RestaurantEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

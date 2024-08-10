import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsCategoryComponent } from './rooms-category.component';

describe('RoomsCategoryComponent', () => {
  let component: RoomsCategoryComponent;
  let fixture: ComponentFixture<RoomsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBookComponent } from './transport-book.component';

describe('TransportBookComponent', () => {
  let component: TransportBookComponent;
  let fixture: ComponentFixture<TransportBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

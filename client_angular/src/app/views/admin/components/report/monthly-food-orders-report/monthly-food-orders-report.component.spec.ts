import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFoodOrdersReportComponent } from './monthly-food-orders-report.component';

describe('MonthlyFoodOrdersReportComponent', () => {
  let component: MonthlyFoodOrdersReportComponent;
  let fixture: ComponentFixture<MonthlyFoodOrdersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFoodOrdersReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFoodOrdersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

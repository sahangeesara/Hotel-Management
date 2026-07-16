import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeAndRevenueReportComponent } from './income-and-revenue-report.component';

describe('IncomeAndRevenueReportComponent', () => {
  let component: IncomeAndRevenueReportComponent;
  let fixture: ComponentFixture<IncomeAndRevenueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeAndRevenueReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeAndRevenueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

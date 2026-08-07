import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypeComponent } from './package-type.component';

describe('PackageTypeComponent', () => {
  let component: PackageTypeComponent;
  let fixture: ComponentFixture<PackageTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

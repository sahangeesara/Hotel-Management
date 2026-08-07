import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective,
  RowComponent, TableDirective,
} from "@coreui/angular";

import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {IconDirective} from "@coreui/icons-angular";
import {AllServiceService} from "../../../../services/all-service.service";
import {HotelService} from "../../../../services/hotel.service";
import {SearchService} from "../../../../services/search.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormsModule,
    IconDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    FormTextDirective
  ],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit {
  packageForm: FormGroup;
  formData = new FormData();
  public error: any = null;
  packages: any[] = [];
  packageTypes: any[] = [];
  public isEditMode = false;
  packageData: any;
  isSubmitted = false;
  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private hotelServes: HotelService,
    private searchServe: SearchService,
    private fb: FormBuilder,
  ) {
    this.packageForm = this.fb.group({
      id: [''],
      description: ['', [Validators.required]],
      name: ['',[Validators.required]],
      package_type_id: ['', [Validators.required]],
      package_amount: ['', [Validators.required]],
      package_no: [{value: '', disabled: true}],
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  getPackage() {
    this.hotelServes.getPackage().subscribe({
      next: (response: any) => {
        this.packages = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getPackageType() {
    this.hotelServes.getPackageType().subscribe({
      next: (response: any) => {
        this.packageTypes = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSubmit() {
    if (this.packageForm.valid) {
      this.packageData = this.packageForm.getRawValue();

      this.hotelServes.submitPackage(this.packageData).subscribe({
        next: (data) => {
          this.getPackage();
          this.clearForm();
          this.showAlert('Package created successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.packageForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

    // Safely parse Laravel 10 validation or exception payloads
    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  clearForm() {
    this.packageForm.reset();
    this.isEditMode = false;
  }

  ngOnInit() {
    this.getPackage();
    this.getPackageType();
  }

  updatePackage() {
    if (this.packageForm.valid) {
      this.packageData = this.packageForm.getRawValue();

      this.hotelServes.updateHotel(this.packageData, this.packageData.id).subscribe({
        next: (response) => {
          this.getPackage();
          this.clearForm();
          this.showAlert('Package updated successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.packageForm.markAllAsTouched();
    }
  }

  getPackageById(id: any) {
    this.hotelServes.getPackageById(id).subscribe({
      next: (Package: any) => {
        this.packageForm.patchValue({
          id: Package.id,
          package_no: Package.package_no,
          description: Package.description,
          package_type_id: Package.package_type_id,
          package_amount: Package.package_amount,
          name: Package.name
        });
        this.isEditMode = true;
        this.showAlert('Package details loaded for update.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  deletePackage(id: any) {
    this.hotelServes.deletePackage(id).subscribe({
      next: (data: any) => {
        this.getPackage();
        this.showAlert('Package deleted successfully!', 'success');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
}

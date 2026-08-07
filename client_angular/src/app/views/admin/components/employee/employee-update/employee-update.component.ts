import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";

@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.scss'
})
export class EmployeeUpdateComponent implements OnInit {
  employeeTypes: any[] = [];
  employeeGenders: any[] = [];
  formData = new FormData();
  updateForm: FormGroup;
  public error = null;
  emp: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.updateForm = this.fb.group({
      id: ['', [Validators.required]],
      emp_no: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.maxLength(12)]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      employee_type_id: ['', Validators.required],
      gender_id: ['', Validators.required],
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

  get empTypeField(): FormControl {
    return this.updateForm.controls['employee_type_id'] as FormControl;
  }

  get empGenField(): FormControl {
    return this.updateForm.controls['gender_id'] as FormControl;
  }

  getEmpType() {
    this.allServe.getEmployeeTypes().subscribe({
      next: (response: any) => {
        this.employeeTypes = response.data ?? response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getEmGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.employeeGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getData(data: any) {
    this.updateForm.patchValue(data);
    this.showAlert('Employee data loaded for update.', 'info');
  }

  empUpdate() {
    if (this.updateForm.valid) {
      const empData = this.updateForm.getRawValue();

      this.allServe.updateEmployee(empData, empData.id).subscribe({
        next: (response) => {
          this.clearForm();
          this.showAlert('Employee updated successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.updateForm.markAllAsTouched();
    }
  }

  handleError(error: any) {

    // Safely parse Laravel 10 validation or exception payloads
    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      // @ts-ignore
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  clearForm() {
    this.updateForm.reset();
    this.empTypeField.setValue("");
    this.empGenField.setValue("");
  }

  ngOnInit() {
    this.getEmpType();
    this.getEmGen();
  }
}

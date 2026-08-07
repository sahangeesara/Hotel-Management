import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {EmployeeType} from "../../../../../entities/employeeTypee";
import { IconDirective } from '@coreui/icons-angular';
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-employee-type',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    FormDirective,
    FormsModule,
    ReactiveFormsModule,
    FormControlDirective,
    FormLabelDirective,
    ButtonDirective,
    TableDirective,
    ColComponent,
    RowComponent,
    IconDirective
  ],
  templateUrl: './employee-type.component.html',
  styleUrl: './employee-type.component.scss'
})
export class EmployeeTypeComponent implements OnInit {
  employeeTypes: any[] = [];
  formData = new FormData();
  empTypeForm: FormGroup;
  public error = null;
  isUpdateVisible: boolean = false;
  isSubmitVisible: boolean = true;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.empTypeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
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

  get empTypeIdField(): FormControl {
    return this.empTypeForm.controls['id'] as FormControl;
  }

  get empTypeNameField(): FormControl {
    return this.empTypeForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.empTypeNameField.setValue("");
    this.empTypeIdField.setValue("");
    this.isUpdateVisible = false;
    this.isSubmitVisible = true;
  }

  onSubmit() {
    this.formData = new FormData();
    if (this.empTypeForm.valid) {
      let empType = new EmployeeType();
      empType.name = this.empTypeNameField.value;

      this.formData.append('form', JSON.stringify(empType));
      const submissionObservable = from(this.allServe.submitEmployeeType(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            this.getEmpType();
            this.clearForm();
            this.showAlert('Employee type added successfully!', 'success');
            return data;
          }),
          catchError((error) => {
            this.handleError(error);
            return throwError(() => error);
          })
        )
        .subscribe();
    } else {
      this.showAlert('Please fill in the required fields correctly.', 'warning');
      this.empTypeForm.markAllAsTouched();
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

  updateEmpType() {
    this.formData = new FormData();
    let id;
    if (this.empTypeForm.valid) {
      let empType = new EmployeeType();
      id = this.empTypeIdField.value;

      empType.id = this.empTypeIdField.value;
      empType.name = this.empTypeNameField.value;

      this.formData.append('form', JSON.stringify(empType));
      this.formData.append('_method', 'patch');
      const submissionObservable = from(this.allServe.updateEmployeeType(this.formData, id));

      submissionObservable
        .pipe(
          map((data) => {
            this.getEmpType();
            this.clearForm();
            this.showAlert('Employee type updated successfully!', 'success');
            return data;
          }),
          catchError((error) => {
            this.handleError(error);
            return throwError(() => error);
          })
        )
        .subscribe();
    } else {
      this.showAlert('Please provide a valid employee type name.', 'warning');
    }
  }

  empTypeDelete(id: any) {
    this.allServe.employeeTypesDelete(id).subscribe({
      next: (data: any) => {
        this.getEmpType();
        this.clearForm();
        this.showAlert('Employee type deleted successfully!', 'success');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getEmpTypeById(id: any) {
    this.allServe.getEmployeeTypeById(id).subscribe({
      next: (employeeType: any) => {
        this.empTypeIdField.setValue(employeeType.id);
        this.empTypeNameField.setValue(employeeType.name);
        this.isUpdateVisible = true;
        this.isSubmitVisible = false;
        this.showAlert('Employee type loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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

  ngOnInit() {
    this.getEmpType();
  }
}

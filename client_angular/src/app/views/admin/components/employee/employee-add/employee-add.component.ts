import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective, ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    AlertComponent,
    FormControlDirective,
    FormLabelDirective,
    ButtonDirective,
    FormTextDirective,
    FormDirective,
    ReactiveFormsModule,
    FormSelectDirective,
    NgForOf,
    NgIf,
    RowComponent,
    ColComponent
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent implements OnInit {

  public error = null;
  employeeTypes: any[] = [];
  employeeGenders: any[] = [];
  formData = new FormData();
  empForm: FormGroup;
  employeeData: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.empForm = this.fb.group({
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

  clearForm() {
    this.empForm.reset();
    this.empForm.patchValue({
      employee_type_id: '',
      gender_id: '',
    });
    if (this.empForm.disabled) {
      this.empForm.enable();
    }
  }

  checkNicAndSetGender(nic: string) {
    if (!nic) return;
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.empForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
      const val = parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number("19" + val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.empForm.disable();
        this.showAlert('Employee is under 18 years old. Form locked.', 'warning');
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.empForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val = parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number(val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.empForm.disable();
        this.showAlert('Employee is under 18 years old. Form locked.', 'warning');
      }
    }
  }

  onSubmit() {
    if (this.empForm.valid) {
      this.employeeData = this.empForm.getRawValue();

      this.allServe.submitEmployee(this.employeeData).subscribe({
        next: (response) => {
          this.clearForm();
          this.showAlert('Employee added successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.empForm.markAllAsTouched();
    }
  }

  handleError(error: any) {

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

  ngOnInit() {
    this.getEmpType();
    this.getEmGen();

    this.empForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });
  }
}

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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";

@Component({
  selector: 'app-guide-add',
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
  templateUrl: './guide-add.component.html',
  styleUrl: './guide-add.component.scss'
})
export class GuideAddComponent implements OnInit {
  guid: any;
  public error: any = null;
  guideGenders: any[] = [];
  guideForm: FormGroup;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.guideForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.maxLength(12)]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
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
    this.guideForm.reset();
    this.guideForm.patchValue({ gender_id: '' });
    if (this.guideForm.disabled) {
      this.guideForm.enable();
    }
  }

  onSubmit() {
    if (this.guideForm.valid) {
      this.guid = this.guideForm.getRawValue();

      this.allServe.submitGuide(this.guid).subscribe({
        next: (response) => {
          this.clearForm();
          this.showAlert('Guide registered successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.guideForm.markAllAsTouched();
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

  getGuideGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.guideGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  checkNicAndSetGender(nic: string) {
    if (!nic) return;
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.guideForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
      const val = parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number("19" + val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.guideForm.disable();
        this.showAlert('Guide is under 18 years old. Form locked.', 'warning');
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.guideForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val = parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number(val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.guideForm.disable();
        this.showAlert('Guide is under 18 years old. Form locked.', 'warning');
      }
    }
  }

  ngOnInit() {
    this.getGuideGen();
    this.guideForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });
  }
}

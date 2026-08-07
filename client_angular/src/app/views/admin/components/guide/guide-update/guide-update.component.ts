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
  selector: 'app-guide-update',
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
  templateUrl: './guide-update.component.html',
  styleUrl: './guide-update.component.scss'
})
export class GuideUpdateComponent implements OnInit {
  guid: any;
  public error: any = null;

  guideGenders: any[] = [];
  formData = new FormData();
  guideUpdateForm: FormGroup;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.guideUpdateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      address: [''],
      guide_no: [''],
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

  get guideGenField(): FormControl {
    return this.guideUpdateForm.controls['gender_id'] as FormControl;
  }

  getData(data: any) {
    this.guideUpdateForm.patchValue(data);
    this.showAlert('Guide details loaded for update.', 'info');
  }

  geGuideGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.guideGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  ngOnInit() {
    this.geGuideGen();
  }

  guideUpdate() {
    this.formData = new FormData();
    if (this.guideUpdateForm.valid) {
      this.guid = this.guideUpdateForm.getRawValue();

      this.allServe.updateGuide(this.guid, this.guid.id).subscribe({
        next: (response) => {
          this.clearForm();
          this.showAlert('Guide updated successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.guideUpdateForm.markAllAsTouched();
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
    this.guideUpdateForm.reset();
    this.guideGenField.setValue('');
  }
}

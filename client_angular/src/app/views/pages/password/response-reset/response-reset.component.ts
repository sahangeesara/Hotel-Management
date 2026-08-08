import { Component, OnInit } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent
} from "@coreui/angular";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { IconDirective } from "@coreui/icons-angular";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AllServiceService } from "../../../../services/all-service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-response-reset',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RowComponent,
    NgStyle,
  ],
  templateUrl: './response-reset.component.html',
  styleUrl: './response-reset.component.scss'
})
export class ResponseResetComponent implements OnInit {
  restForm: FormGroup;
  resetToken: string = '';
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.restForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      resetToken: ['']
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

  onSubmit() {
    if (this.restForm.valid) {
      Swal.fire({
        title: 'Reset Password?',
        text: "Do you want to submit your new password?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reset it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.allServe.changePassword(this.restForm.value).subscribe({
            next: (data: any) => {
              this.handleResponse(data);
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.restForm.markAllAsTouched();
    }
  }

  handleResponse(data: any) {
    Swal.fire({
      title: 'Success!',
      text: 'Done! Now login with your new password.',
      icon: 'success',
      confirmButtonText: 'Go to Login'
    }).then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  handleError(error: any) {
    console.error('Password Reset Error:', error);

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (error?.error?.error) {
      this.error = error.error.error;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An error occurred while resetting the password.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.restForm.patchValue({ resetToken: this.resetToken });
    });
  }
}

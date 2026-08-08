import { Component } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconDirective } from "@coreui/icons-angular";
import { RouterLink } from "@angular/router";
import { AllServiceService } from "../../../../services/all-service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-reset',
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
  templateUrl: './request-reset.component.html',
  styleUrl: './request-reset.component.scss'
})
export class RequestResetComponent {
  public error: any = null;
  isLoading = false;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(private allServe: AllServiceService) {}

  ngOnInit() {}

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

  onSubmit(requestResetForm: any) {
    if (requestResetForm.valid) {
      this.isLoading = true;
      this.showAlert('Sending password reset link...', 'info');

      this.allServe.sendPasswordResetLink(requestResetForm.value).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.handleResponse(data, requestResetForm);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please enter a valid email address.', 'warning');
    }
  }

  handleResponse(res: any, requestResetForm: any) {
    Swal.fire({
      title: 'Email Sent!',
      text: res.data || 'Password reset link has been sent to your email.',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    // Clear email value properly if it's an ngForm/template form reference
    if (requestResetForm && requestResetForm.form) {
      requestResetForm.form.reset();
    } else {
      requestResetForm.email = null;
    }
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
      this.error = 'An error occurred while sending the reset link.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }
}

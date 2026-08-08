import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { AlertComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AllServiceService } from "../../../services/all-service.service";
import { TokenService } from "../../../services/token.service";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [AlertComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, NgIf, RouterLink]
})
export class RegisterComponent {
  hide = true;
  hide2 = true;
  isLoading = false;
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private allServe: AllServiceService,
    private token: TokenService,
    private router: Router
  ) {}

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

  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      this.isLoading = true;
      this.allServe.signup(signupForm.value).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.handleResponse(data);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
    }
  }

  handleError(error: any) {
    console.error('Registration Error:', error);

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An error occurred during registration. Please try again.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  handleResponse(data: any) {
    this.token.handle(data.access_token);

    Swal.fire({
      title: 'Registration Successful!',
      text: 'Your account has been created successfully.',
      icon: 'success',
      confirmButtonText: 'Go to Dashboard'
    }).then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }

  ngOnInit() {}
}

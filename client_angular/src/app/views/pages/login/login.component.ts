import { Component } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { AlertComponent, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TokenService } from "../../../services/token.service";
import { AllServiceService } from "../../../services/all-service.service";
import { AuthService } from "../../../services/auth.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [AlertComponent, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterLink, FormsModule, NgIf]
})
export class LoginComponent {

  constructor(private allServe: AllServiceService,
              private token: TokenService,
              private router: Router,
              private auth: AuthService) {  }

  hide = true;
  isLoading = false;
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

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

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      this.isLoading = true;
      this.allServe.login(loginForm.value).subscribe({
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
      this.showAlert('Please enter valid credentials.', 'warning');
    }
  }

  handleError(error: any) {
    console.error('Login Error:', error);

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'Invalid email or password.';
    }

    this.showAlert(this.error || 'An error occurred during login.', 'danger');
  }

  ngOnInit() { }

  handleResponse(data: any) {
    this.token.handle(data.access_token);
    this.auth.changeAuthStatus(true);

    Swal.fire({
      title: 'Welcome Back!',
      text: 'Login successful.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigateByUrl('/dashboard').then(r => 1);
    });
  }
}

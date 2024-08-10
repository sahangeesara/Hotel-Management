import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TokenService} from "../../../services/token.service";
import {AllServiceService} from "../../../services/all-service.service";
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterLink, FormsModule]
})
export class LoginComponent {

  constructor(private allServe: AllServiceService,
              private token: TokenService,
              private router: Router,
              private toastr: ToastrService,
              private  auth: AuthService) {  }


  // email = new FormControl('', [Validators.required, Validators.email]);
  // public error=null;
  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }
  hide = true;

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      this.allServe.login(loginForm.value).subscribe(
        (data: any) => this.handleResponse(data),
        error => this.handleError(error)
      );

    }
  }
  handleError(error: any) {
    if (error.error && error.error.errors) {
      Object.keys(error.error.errors).forEach(key => {
        this.toastr.error(error.error.errors[key][0]);
      });
    } else {
      this.toastr.error('An error occurred. Please try again.');
    }
  }
  ngOnInit() {   }


  handleResponse(data: any) {
    this.token.handle(data.access_token);
    this.auth.changeAuthStatus(true);
    this.router.navigateByUrl('/dashboard').then(r => 1);
  }


}

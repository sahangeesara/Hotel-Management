import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {AllServiceService} from "../../../services/all-service.service";
import {TokenService} from "../../../services/token.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, RouterLink]
})
export class RegisterComponent {

  constructor(private  allServe:AllServiceService,
              private token: TokenService,
              private toastr: ToastrService,
              private router: Router) {  }
  hide = true;
  hide2 = true;
  private angular: any;
  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      this.allServe.signup(signupForm.value).subscribe(
        data=>this.handleResponse(data),
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

  handleResponse(data: any) {
    this.token.handle(data.access_token);
    this.router.navigateByUrl('/dashboard');
  }
  ngOnInit() {
  }

}

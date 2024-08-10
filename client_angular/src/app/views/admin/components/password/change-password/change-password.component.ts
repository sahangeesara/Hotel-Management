import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastContainerDirective, ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  template: `
    <h1><a (click)="handleResponse()">Okay </a></h1>
    <div aria-live="polite" toastContainer></div>
  `,
})
export class ChangePasswordComponent {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective | undefined;

  restForm: FormGroup;
  resetToken: string = '';
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.restForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    });

  }
  onSubmit() {
    if (this.restForm.valid) {
      // console.log(this.restForm.value);
      this.allServe.passwordChange(this.restForm.value).subscribe(
        (data: any) => this.handleResponse(data),
        error => this.handleError(error),
      )
      // console.log(restForm.value);
    }
  }
  handleResponse(data:any){
    this.toastr.success('Done!, Now login with new Password')
    this.router.navigateByUrl('/login');
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
  // hide = true;
  // hide2 = true;
  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;

    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.restForm.patchValue({ resetToken: this.resetToken });
    });
  }
}

import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent
} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {RouterLink} from "@angular/router";
import {AllServiceService} from "../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-request-reset',
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
    FormsModule,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ReactiveFormsModule,
    RouterLink,
    RowComponent,
    NgStyle,

  ],
  templateUrl: './request-reset.component.html',
  styleUrl: './request-reset.component.scss'
})
export class RequestResetComponent {
  public error = null;
  constructor(private allServe: AllServiceService,
              private toastr: ToastrService
  ) {
  }

  ngOnInit() {
  }
  onSubmit(requestResetForm:any){
    if (requestResetForm.valid) {
      // @ts-ignore
      this.toastr.info('wait.........');
      this.allServe.sendPasswordResetLink(requestResetForm.value).subscribe(
        data => this.handleResponse(data, requestResetForm.value),
        error=>this.toastr.error(error.error.error)
      );

    }
  }
  handleResponse(res:any,requestResetForm:any){
    // @ts-ignore
    this.toastr.success(res.data);
    requestResetForm.email=null;
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
}

import { Component } from '@angular/core';
import {
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective,
  RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    FormTextDirective
  ],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.scss'
})
export class CustomerUpdateComponent {
  customGenders: any[] = [];
  formData = new FormData();
  customerUpdateForm:FormGroup;
  custom:any;
  public error=null;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ){
    this.customerUpdateForm = this.fb.group({

      id: [''],
      custom_no: [''],
      custom_type: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      tel_no: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }

  getData(data: any) {
   this.customerUpdateForm.patchValue(data)
  }

  clearForm() {

    this.customerUpdateForm.reset();
    // this.empTypeField.setValue("Select Employee Type");
    // this.empGenField.setValue("Select Employee Gender");

  }

  customUpdate(){
    this.formData = new FormData();
    if (this.customerUpdateForm.valid) {

      this.custom = this.customerUpdateForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.custom));
      this.formData.append('_method', 'patch');
      const submissionObservable =  from( this.allServe.updateCustomer(this.formData,this.custom.id));
      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();

    }
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  getCustomGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.customGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }

  ngOnInit() {this.getCustomGen();    }

}

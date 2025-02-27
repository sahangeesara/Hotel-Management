import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../services/all-service.service";
import {SearchService} from "../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from "@coreui/angular";
import {Customer} from "../../../../entities/customer";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgForOf,
    ColComponent,
    RowComponent,
    ReactiveFormsModule,
    NgIf,
    FormLabelDirective,
    FormSelectDirective,
    FormControlDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  formData = new FormData();
  user: any[] = [];
  customers: any[] = [];
  userGenders: any[] = [];
  userForm: any;
  showUserDetails = true;
  imageUrl?: string = 'assets/default.png';
  file?: any;
  public error=null
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ){
    this.userForm = this.fb.group({

      id: [''],
      user_id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      tellNo: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      image: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }
  get userIdField(): FormControl {
    return this.userForm.controls['user_id'] as FormControl;
  }
  get userNameField(): FormControl {
    return this.userForm.controls['name'] as FormControl;
  }
  get userEmailField(): FormControl {
    return this.userForm.controls['email'] as FormControl;
  }
  get customerAddressField(): FormControl {
    return this.userForm.controls['address'] as FormControl;
  }
  get customerCountryField(): FormControl {
    return this.userForm.controls['country'] as FormControl;
  }
  get customerGenField(): FormControl {
    return this.userForm.controls['gender_id'] as FormControl;
  }
  get customerTelNoField(): FormControl {
    return this.userForm.controls['tellNo'] as FormControl;
  }
  get customerCityField(): FormControl {
    return this.userForm.controls['city'] as FormControl;
  }
  get customerNicField(): FormControl {
    return this.userForm.controls['nic'] as FormControl;
  }
  get customerImageField(): FormControl {
    return this.userForm.controls['image'] as FormControl;
  }
getAthCustomer(){
  this.searchServe.getAthCustomer().subscribe(
    (response: any) => {
      this.customers = Array.isArray(response) ? response : [response];
    },
    (error) => {
      console.error('Error fetching Food:', error);
    }
  );
}
  profile(){

    this.allServe.userProfile().subscribe({
      next: (response:any) => {
        this.user = Array.isArray(response) ? response : [response]; // Assign the data to a variable if needed
        console.log(this.user);
        this.userIdField.setValue(response.id);
        this.userNameField.setValue(response.name);
        this.userEmailField.setValue(response.email);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });


  }
  getUserGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.userGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }

  selectImage(e:any):void{
    this.file = e.target.files ? e.target.files[0] : '';

    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
    }

  }
  onSubmit() {
    this.formData = new FormData();
    if (this.userForm.valid) {

      let customer = new Customer();

      customer.user_id= this.userIdField.value;
      customer.address= this.customerAddressField.value;
      customer.nic= this.customerNicField.value;
      customer.city= this.customerCityField.value;
      customer.tel_no= this.customerTelNoField.value;
      customer.gender_id= this.customerGenField.value;
      customer.country= this.customerCountryField.value;

      this.formData.append('image', this.file, this.file.name);
      this.formData.append('form', JSON.stringify(customer));
      const submissionObservable = from( this.allServe.submitCustomer(this.formData));

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
  ngOnInit() {
    this.profile();
    this.getUserGen();
    this.getAthCustomer();
  }
  trackByFn(index: number, item: any): number {
    return index; // Change if you have a unique ID
  }
  toggleView() {
    this.showUserDetails = !this.showUserDetails;
  }

   clearForm() {
     this.customerImageField.setValue("");
     this.userEmailField.setValue("");
     this.userNameField.setValue("");
     this.customerAddressField.setValue("");
     this.customerCountryField.setValue("");
     this.customerTelNoField.setValue("");
     this.customerCityField.setValue("");
     this.customerNicField.setValue("");
     this.userIdField.setValue("");
     this.customerGenField.setValue("Select User Gender");
  }
}

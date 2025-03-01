import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../services/all-service.service";
import {SearchService} from "../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from "@coreui/angular";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Profile} from "../../../../entities/profile";

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
  profiles: any[] = [];
  userGenders: any[] = [];
  userForm: FormGroup;
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
      tel_no: ['', [Validators.required]],
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
  get profileAddressField(): FormControl {
    return this.userForm.controls['address'] as FormControl;
  }
  get profileCountryField(): FormControl {
    return this.userForm.controls['country'] as FormControl;
  }
  get profileGenField(): FormControl {
    return this.userForm.controls['gender_id'] as FormControl;
  }
  get profileTelNoField(): FormControl {
    return this.userForm.controls['tel_no'] as FormControl;
  }
  get profileCityField(): FormControl {
    return this.userForm.controls['city'] as FormControl;
  }
  get profileNicField(): FormControl {
    return this.userForm.controls['nic'] as FormControl;
  }
  get profileImageField(): FormControl {
    return this.userForm.controls['image'] as FormControl;
  }
getAthProfile(){
  this.searchServe.getAthProfile().subscribe(
    (response: any) => {
      this.profiles = Array.isArray(response) ? response : [response];
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

      let profile = new Profile();

      profile.user_id= this.userIdField.value;
      profile.address= this.profileAddressField.value;
      profile.nic= this.profileNicField.value;
      profile.city= this.profileCityField.value;
      profile.tel_no= this.profileTelNoField.value;
      profile.gender_id= this.profileGenField.value;
      profile.country= this.profileCountryField.value;

      this.formData.append('image', this.file, this.file.name);
      this.formData.append('form', JSON.stringify(profile));
      const submissionObservable = from( this.allServe.submitUserProfile(this.formData));

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
    this.getAthProfile();
  }
  trackByFn(index: number, item: any): number {
    return index; // Change if you have a unique ID
  }
  toggleView() {
    this.showUserDetails = !this.showUserDetails;
  }

   clearForm() {
     this.profileImageField.setValue("");
     this.userEmailField.setValue("");
     this.userNameField.setValue("");
     this.profileAddressField.setValue("");
     this.profileCountryField.setValue("");
     this.profileTelNoField.setValue("");
     this.profileCityField.setValue("");
     this.profileNicField.setValue("");
     this.userIdField.setValue("");
     this.profileGenField.setValue("Select User Gender");
  }
}

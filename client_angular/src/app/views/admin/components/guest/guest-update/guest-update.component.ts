import { Component } from '@angular/core';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Guest} from "../../../../../entities/guest";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-guest-update',
  standalone: true,
    imports: [
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        NgForOf,
        ReactiveFormsModule,
        RowComponent
    ],
  templateUrl: './guest-update.component.html',
  styleUrl: './guest-update.component.scss'
})
export class GuestUpdateComponent {

  public error=null;
  guestGenders: any[] = [];
  guides: any[] = [];
  formData = new FormData();
  guestUpadeForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guestUpadeForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      guide_id: ['', Validators.required],
      guest_type: ['', Validators.required],
      guide_status: ['', Validators.required],
      country: ['', Validators.required],
    });

  }
  get guestIdField(): FormControl {
    return this.guestUpadeForm.controls['id'] as FormControl;
  }
  get guestNameField(): FormControl {
    return this.guestUpadeForm.controls['name'] as FormControl;
  }
  get guestAddressField(): FormControl {
    return this.guestUpadeForm.controls['address'] as FormControl;
  }
  get guestEmailField(): FormControl {
    return this.guestUpadeForm.controls['email'] as FormControl;
  }
  get guestCityField(): FormControl {
    return this.guestUpadeForm.controls['city'] as FormControl;
  }
  get guestNicField(): FormControl {
    return this.guestUpadeForm.controls['nic'] as FormControl;
  }
  get guestTelNoField(): FormControl {
    return this.guestUpadeForm.controls['tel_no'] as FormControl;
  }
  get guestCountryField(): FormControl {
    return this.guestUpadeForm.controls['country'] as FormControl;
  }
  get guestTypeField(): FormControl {
    return this.guestUpadeForm.controls['guest_type'] as FormControl;
  }
  get guestGenField(): FormControl {
    return this.guestUpadeForm.controls['gender_id'] as FormControl;
  }
  get guideField(): FormControl {
    return this.guestUpadeForm.controls['guide_id'] as FormControl;
  }
  get guideStatusField(): FormControl {
    return this.guestUpadeForm.controls['guide_status'] as FormControl;
  }

  getData(data:any){
    console.log(data)
    this.guestIdField.setValue(data.id);
    this.guestNameField.setValue(data.name);
    this.guestAddressField.setValue(data.address);
    this.guestEmailField.setValue(data.email);
    this.guestCityField.setValue(data.city);
    this.guestNicField.setValue(data.nic);
    this.guestTelNoField.setValue(data.tel_no);
    this.guestGenField.setValue(data.gender_id);
    this.guideField.setValue(data.guide_id);
    this.guestTypeField.setValue(data.guest_type);
    this.guestCountryField.setValue(data.country);
    this.guideStatusField.setValue(data.guide.guide_status);

  }



  geGuestGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guestGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }
  getGuide() {
    this.allServe.getGuide().subscribe(
      (response: any) => {
        this.guides = response.data;
      },
      (error) => {
        console.error('Error fetching guide:', error);
      }
    );
  }


  ngOnInit() {
    this.geGuestGen();
    this.getGuide();

  }


  guestUpdate() {
    this.formData = new FormData();
    if (this.guestUpadeForm.valid) {

      let id = this.guestIdField.value;
      let guest = new Guest();

      guest.name= this.guestNameField.value;
      guest.address= this.guestAddressField.value;
      guest.nic= this.guestNicField.value;
      guest.city= this.guestCityField.value;
      guest.tel_no= this.guestTelNoField.value;
      guest.gender_id= this.guestGenField.value;
      guest.guide_id= this.guideField.value;
      guest.email= this.guestEmailField.value;
      guest.guest_type= this.guestTypeField.value;
      guest.country= this.guestCountryField.value;
      guest.guide_status= this.guideStatusField.value;

      this.formData.append('form', JSON.stringify(guest));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateGuests(this.formData,id));

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

  clearForm() {
    this.guestIdField.setValue("");
    this.guestNameField.setValue("");
    this.guestAddressField.setValue("");
    this.guestNicField.setValue("");
    this.guestCityField.setValue("");
    this.guestTelNoField.setValue("");
    this.guestGenField.setValue("Select Guest Gender");
    this.guideField.setValue("Select Guide");
    this.guestEmailField.setValue("");
    this.guestTypeField.setValue("");
    this.guestCountryField.setValue("");
    this.guideStatusField.setValue("Select Guide Status");

  }
}

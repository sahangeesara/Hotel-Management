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
import {CuntryService} from "../../../../../services/cuntry.service";

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

  guest:any;
  public error=null;
  guestGenders: any[] = [];
  guides: any[] = [];
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  guestUpdateForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private countryService: CuntryService,
                 private fb: FormBuilder,
  ) {

    this.guestUpdateForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
      address: [''],
      guest_no: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      guide_status: [''],
      country_id: ['', Validators.required],
      cuntry_code_id: ['', Validators.required],
    });

  }

  get guestGenField(): FormControl {
    return this.guestUpdateForm.controls['gender_id'] as FormControl;
  }
  get guideField(): FormControl {
    return this.guestUpdateForm.controls['guide_id'] as FormControl;
  }
  get guideStatusField(): FormControl {
    return this.guestUpdateForm.controls['guide_status'] as FormControl;
  }

  getData(data:any){
    this.guestUpdateForm.patchValue(data);

    if (data.guide) {
      this.guideStatusField.setValue(data.guide.guide_status);
    } else {
      // Set guideStatusField to a default value (optional)
      this.guideStatusField.setValue('');
    }
  }
  getCountryCode() {
    this.countryService.getCuntryCode().subscribe(
      (response: any) => {
        this.countryCodes = response.data;
      },
      (error: any) => {
        console.error('Error fetching Guest Gender:', error);
      }
    );
  }
  setCountryCode(event: Event) {
    const countryId = Number((event.target as HTMLSelectElement).value);

    const countryCode = this.countryCodes.find(
      x => x.cuntry_id === countryId
    );

    if (countryCode) {
      this.guestUpdateForm.patchValue({
        cuntry_code_id: countryCode.id
      });
    }
  }
  getCountries() {
    this.countryService.getNationality().subscribe(
      (response: any) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching Guest Gender:', error);
      }
    );
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
    this.getCountries();
    this.getCountryCode();
  }


  guestUpdate() {
    this.formData = new FormData();
    if (this.guestUpdateForm.valid) {

      this.guest = this.guestUpdateForm.getRawValue();

      this.allServe.updateGuests(this.guest, this.guest.id).subscribe(
        (response) => {
          // Handle successful update
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }

  clearForm() {
    this.guestUpdateForm.reset();
    this.guestGenField.setValue("Select Guest Gender");
    this.guideField.setValue("Select Guide");
    this.guideStatusField.setValue("Select Guide Status");

  }
}

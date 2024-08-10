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
import {Guide} from "../../../../../entities/guide";
import {Guest} from "../../../../../entities/guest";

@Component({
  selector: 'app-guest-add',
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
  templateUrl: './guest-add.component.html',
  styleUrl: './guest-add.component.scss'
})
export class GuestAddComponent {

  guestGenders: any[] = [];
  guides: any[] = [];
  formData = new FormData();
  guestForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guestForm = this.fb.group({

      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      guide_id: ['', Validators.required],
      guest_type: ['', Validators.required],
      country: ['', Validators.required],
    });

  }
  get guestNameField(): FormControl {
    return this.guestForm.controls['name'] as FormControl;
  }
  get guestAddressField(): FormControl {
    return this.guestForm.controls['address'] as FormControl;
  }
  get guestEmailField(): FormControl {
    return this.guestForm.controls['email'] as FormControl;
  }
  get guestCityField(): FormControl {
    return this.guestForm.controls['city'] as FormControl;
  }
  get guestNicField(): FormControl {
    return this.guestForm.controls['nic'] as FormControl;
  }
  get guestTelNoField(): FormControl {
    return this.guestForm.controls['tel_no'] as FormControl;
  }
  get guestCountryField(): FormControl {
    return this.guestForm.controls['country'] as FormControl;
  }
  get guestTypeField(): FormControl {
    return this.guestForm.controls['guest_type'] as FormControl;
  }
  get guestGenField(): FormControl {
    return this.guestForm.controls['gender_id'] as FormControl;
  }
  get guideField(): FormControl {
    return this.guestForm.controls['guide_id'] as FormControl;
  }

  clearForm() {
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

  }

  async onSubmit() {
    this.formData = new FormData();
    if (this.guestForm.valid) {

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

      this.formData.append('form', JSON.stringify(guest));
      await this.allServe.submitGuest(this.formData);
      this.clearForm();
      this.toastr.success("Guest Successfully submit ");
    }
  }

  getGuestGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guestGenders = response.data;
      },
      (error) => {
        console.error('Error fetching Guest Gender:', error);
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
    this.getGuestGen();
    this.getGuide();
  }
}

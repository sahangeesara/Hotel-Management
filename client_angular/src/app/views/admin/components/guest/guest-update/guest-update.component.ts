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

  getData(data:any){
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


}

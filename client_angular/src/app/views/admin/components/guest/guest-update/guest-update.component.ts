import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
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
    RowComponent,
    TableDirective
  ],
  templateUrl: './guest-update.component.html',
  styleUrl: './guest-update.component.scss'
})
export class GuestUpdateComponent implements OnInit{

  guest:any;
  public error=null;
  guestGenders: any[] = [];
  guestDetails: any[] = [];
  guides: any[] = [];
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  guestUpdateForm: FormGroup;
  foreignGuestId:any;
  foreignGuestDependId:any;
  isForeign=false;
  isLocal=false;
  guestData:any;


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
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      foreign_nic: [''],
      country_id: ['', Validators.required],
      cuntry_code_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      adults: ['', Validators.required],
      children: ['', Validators.required],
      infants: ['', Validators.required],
      dependent_name: [''],
      guide_status: [''],
      dependent_relationship: [''],
      dependent_id: [''],
      age: [''],
    });

  }
  generateGuestId() {
    const name = this.guestUpdateForm.get('name')?.value || '';
    const telNo = this.guestUpdateForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();

    const telSuffix = String(telNo).slice(-3);

    this.foreignGuestId = namePrefix +"-" + telSuffix;
    this.guestUpdateForm.patchValue({
      foreign_nic: this.foreignGuestId
    });
  }

  generateGuestDependId(){
    const foreignNic = this.foreignGuestId;
    const relationship = this.guestUpdateForm.get('dependent_relationship')?.value;
    const age = this.guestUpdateForm.get('age')?.value;
    this.foreignGuestDependId = relationship +"-" + foreignNic +"-" + age ;
  }

  get guideStatusField(): FormControl {
    return this.guestUpdateForm.controls['guide_status'] as FormControl;
  }

  getData(data: any) {
    console.log('API response:', data);

    // Main guest fields
    this.guestUpdateForm.patchValue({
      id: data.id,
      guest_no: data.guest_no,
      name: data.name,
      address: data.address,
      email: data.email,
      city: data.city,
      country_id: data.country_id,
      gender_id: data.gender_id,
      guest_type: data.guest_type,
      foreign_nic: data.foreign_nic,
      nic: data.nic,
      tel_no: data.tel_no,
      guide_id: data.guide_id,
      cuntry_code_id: data.cuntry_code_id
    });


    const count = data.booking_guest_counts?.[0];

    this.guestUpdateForm.patchValue({
      adults: count?.adults ?? 0,
      children: count?.children ?? 0,
      infants: count?.infants ?? 0
    });


    this.guideStatusField.setValue(
      data.guide?.guide_status ?? ''
    );

    this.guestDetails = data.guest_dependent_detail ?? [];

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

  selectGuestType() {
    const nameControl = this.guestUpdateForm.get('name');
    const telControl = this.guestUpdateForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      alert("Name and Telephone number are required!");
    }

    const type = this.guestUpdateForm.get('guest_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal =false;
      this.guestUpdateForm.get('nic')?.disable();
      this.guestUpdateForm.get('foreign_nic')?.enable();

      this.generateGuestId();
      this.guestUpdateForm.patchValue({
        foreign_nic: this.foreignGuestId
      })
    }else if (type === "Local") {
      const nic = this.guestUpdateForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.guestUpdateForm.get('foreign_nic')?.disable();
      this.guestUpdateForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }

    }else {
      this.isForeign = false;
      this.isLocal = false;
      this.guestUpdateForm.get('foreign_nic')?.disable();
      this.guestUpdateForm.get('nic')?.disable();
    }
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
  addSelectedGuest() {
    const dependentName = this.guestUpdateForm.get('dependent_name')?.value;
    const relationship = this.guestUpdateForm.get('dependent_relationship')?.value;
    const age = this.guestUpdateForm.get('age')?.value;

    this.generateGuestDependId();

    this.guestDetails.push({
      dependent_id: this.foreignGuestDependId,
      dependent_name: dependentName,
      dependent_relationship: relationship,
      age: age,
    });

    this.guestUpdateForm.patchValue({ dependent_name: '', dependent_relationship: '', age : '' });

  }


  ngOnInit() {
    this.geGuestGen();
    this.getGuide();
    this.getCountries();
    this.getCountryCode();
    this.guestUpdateForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (this.isLocal && nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });
  }

  removeGuest(index: number) {
    this.guestDetails.splice(index, 1);
  }

  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.guestUpdateForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false }); // { emitEvent: false } prevents infinite loops
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.guestUpdateForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
    }
  }


  guestUpdate() {
    this.formData = new FormData();
    if (this.guestUpdateForm.valid) {

      this.guestData = this.guestUpdateForm.getRawValue();
      let data = this.guestDetails;

      this.formData.append('form', JSON.stringify(this.guestData));
      this.formData.append('guestDetails', JSON.stringify(data));
      this.formData.append('_method', 'PATCH');

      this.allServe.updateGuests(this.formData, this.guest.id).subscribe(
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
    this.guestUpdateForm.patchValue({
      gender_id: '',
      country_id: '',
      guide_id: '',
      country_code_id: '',
    });

  }
}

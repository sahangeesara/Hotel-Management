import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {CuntryService} from "../../../../../services/cuntry.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guest-update',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './guest-update.component.html',
  styleUrl: './guest-update.component.scss'
})
export class GuestUpdateComponent implements OnInit {

  guest: any;
  public error: any = null;
  guestGenders: any[] = [];
  guestDetails: any[] = [];
  guides: any[] = [];
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  guestUpdateForm: FormGroup;
  foreignGuestId: any;
  foreignGuestDependId: any;
  isForeign = false;
  isLocal = false;
  guestData: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  countryPhonePatterns: { [key: number]: RegExp } = {
    1: /^\d{10}$/,             // American (US) - 10 digits
    2: /^[0-9]{10,11}$/,       // British (UK) - 10 to 11 digits
    3: /^\d{10}$/,             // Canadian - 10 digits
    4: /^\d{9}$/,              // Australian - 9 digits (excluding leading 0)
    5: /^\d{10,11}$/,          // German - 10 to 11 digits
    6: /^\d{9}$/,              // French - 9 digits (excluding leading 0)
    7: /^\d{10}$/,             // Japanese - 10 digits
    8: /^[6-9]\d{9}$/,         // Indian - 10 digits starting with 6-9
    9: /^1[3-9]\d{9}$/,        // Chinese - 11 digits
    10: /^\d{10,11}$/,         // Brazilian - 10 to 11 digits (with DDD)
    11: /^\d{10}$/,            // Mexican - 10 digits
    12: /^\d{9,10}$/,          // Italian - 9 to 10 digits
    13: /^\d{9}$/,             // South African - 9 digits (excluding leading 0)
    14: /^\d{9}$/,             // Spanish - 9 digits
    15: /^7[0-9]{8}$/          // Sri Lanka - 9 digits starting with 7
  };

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private countryService: CuntryService,
    private fb: FormBuilder,
  ) {
    this.guestUpdateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.maxLength(12)]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required]],
      gender_id: ['', Validators.required],
      foreign_nic: [''],
      country_id: ['', Validators.required],
      cuntry_code_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      adults: ['', Validators.required],
      children: [''],
      infants: [''],
      dependent_name: [''],
      guide_status: [''],
      dependent_relationship: [''],
      dependent_id: [''],
      age: [''],
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  generateGuestId() {
    const name = this.guestUpdateForm.get('name')?.value || '';
    const telNo = this.guestUpdateForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const telSuffix = String(telNo).slice(-3);

    this.foreignGuestId = namePrefix + "-" + telSuffix;
    this.guestUpdateForm.patchValue({
      foreign_nic: this.foreignGuestId
    });
  }

  generateGuestDependId() {
    const foreignNic = this.foreignGuestId;
    const relationship = this.guestUpdateForm.get('dependent_relationship')?.value;
    const age = this.guestUpdateForm.get('age')?.value;
    this.foreignGuestDependId = relationship + "-" + foreignNic + "-" + age;
  }

  get guideStatusField(): FormControl {
    return this.guestUpdateForm.controls['guide_status'] as FormControl;
  }

  getData(data: any) {
    this.guest = data; // Ensure this.guest is populated with the object so ID is referenced properly on update

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
    this.showAlert('Guest details loaded for update.', 'info');
  }

  getCountryCode() {
    this.countryService.getCuntryCode().subscribe({
      next: (response: any) => {
        this.countryCodes = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  getCountries() {
    this.countryService.getNationality().subscribe({
      next: (response: any) => {
        this.countries = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  geGuestGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.guestGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  selectGuestType() {
    const nameControl = this.guestUpdateForm.get('name');
    const telControl = this.guestUpdateForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      this.showAlert("Name and Telephone number are required!", "warning");
    }

    const type = this.guestUpdateForm.get('guest_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal = false;
      this.guestUpdateForm.get('nic')?.disable();
      this.guestUpdateForm.get('foreign_nic')?.enable();

      this.generateGuestId();
      this.guestUpdateForm.patchValue({
        foreign_nic: this.foreignGuestId
      });
    } else if (type === "Local") {
      const nic = this.guestUpdateForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.guestUpdateForm.get('foreign_nic')?.disable();
      this.guestUpdateForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }
    } else {
      this.isForeign = false;
      this.isLocal = false;
      this.guestUpdateForm.get('foreign_nic')?.disable();
      this.guestUpdateForm.get('nic')?.disable();
    }
  }

  getGuide() {
    this.allServe.getGuide().subscribe({
      next: (response: any) => {
        this.guides = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  addSelectedGuest() {
    const dependentName = this.guestUpdateForm.get('dependent_name')?.value;
    const relationship = this.guestUpdateForm.get('dependent_relationship')?.value;
    const age = this.guestUpdateForm.get('age')?.value;

    if (!dependentName || !relationship || !age) {
      this.showAlert('Please fill in all dependent details.', 'warning');
      return;
    }

    this.generateGuestDependId();

    this.guestDetails.push({
      dependent_id: this.foreignGuestDependId,
      dependent_name: dependentName,
      dependent_relationship: relationship,
      age: age,
    });

    this.guestUpdateForm.patchValue({ dependent_name: '', dependent_relationship: '', age: '' });
  }

  setCountryCode(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target || !target.value) {
      this.guestUpdateForm.patchValue({ cuntry_code_id: '' });
      return;
    }

    const countryId = Number(target.value);
    const countryCode = this.countryCodes.find(
      x => Number(x.country_id) === countryId || Number(x.cuntry_id) === countryId
    );

    if (countryCode) {
      this.guestUpdateForm.patchValue({
        cuntry_code_id: countryCode.id
      });
    }
  }

  phonePatternValidator(patternsMap: { [key: number]: RegExp }, form: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value;
      const countryId = form?.get('country_id')?.value;

      if (!phone || !countryId) {
        return null;
      }

      const regex = patternsMap[Number(countryId)];

      if (regex && !regex.test(phone)) {
        return { invalidPhonePattern: true };
      }

      return null;
    };
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
    this.guestUpdateForm.get('tel_no')?.addValidators([
      this.phonePatternValidator(this.countryPhonePatterns, this.guestUpdateForm)
    ]);

    this.guestUpdateForm.get('country_id')?.valueChanges.subscribe(countryId => {
      if (!countryId) {
        this.guestUpdateForm.patchValue({ cuntry_code_id: '' }, { emitEvent: false });
      } else {
        const numericCountryId = Number(countryId);
        const countryCode = this.countryCodes.find(
          x => Number(x.country_id) === numericCountryId || Number(x.cuntry_id) === numericCountryId
        );

        if (countryCode) {
          this.guestUpdateForm.patchValue({ cuntry_code_id: countryCode.id }, { emitEvent: false });
        }
      }

      this.guestUpdateForm.get('tel_no')?.updateValueAndValidity();
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
        }, { emitEvent: false });
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
    if (this.guestUpdateForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this guest's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.formData = new FormData();
          this.guestData = this.guestUpdateForm.getRawValue();
          let data = this.guestDetails;

          this.formData.append('form', JSON.stringify(this.guestData));
          this.formData.append('guestDetails', JSON.stringify(data));
          this.formData.append('_method', 'PATCH');

          const guestId = this.guest?.id || this.guestData.id;

          this.allServe.updateGuests(this.formData, guestId).subscribe({
            next: (response) => {
              this.clearForm();
              const updatedName = this.guestData.name || 'Guest';
              this.showAlert(`Guest "${updatedName}" updated successfully.`, 'success');
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.guestUpdateForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

    // Safely parse Laravel 10 validation or exception payloads
    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  clearForm() {
    this.guestUpdateForm.reset();
    this.guestUpdateForm.patchValue({
      gender_id: '',
      country_id: '',
      guide_id: '',
      country_code_id: '',
      guest_type: '',
    });
    this.guestDetails = [];
    this.isForeign = false;
    this.isLocal = false;
  }
}

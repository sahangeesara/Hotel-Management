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

@Component({
  selector: 'app-guest-add',
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
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    NgIf
  ],
  templateUrl: './guest-add.component.html',
  styleUrl: './guest-add.component.scss'
})
export class GuestAddComponent implements OnInit {
  public error: any = null;

  guest: any;
  guestData: any;
  guestGenders: any[] = [];
  guestDetails: any[] = [];
  guides: any[] = [];
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  guestForm: FormGroup;
  foreignGuestId: any;
  foreignGuestDependId: any;
  isForeign = false;
  isLocal = false;

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
    private allServe: AllServiceService,
    private countryService: CuntryService,
    private fb: FormBuilder,
  ) {
    this.guestForm = this.fb.group({
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

  clearForm() {
    this.guestForm.reset();
    if (this.guestForm.disabled) {
      this.guestForm.enable();
    }
    this.guestForm.patchValue({
      gender_id: '',
      country_id: '',
      guide_id: '',
      cuntry_code_id: '',
      guest_type: '',
    });
    this.guestDetails = [];
    this.isForeign = false;
    this.isLocal = false;
  }

  generateGuestId() {
    const name = this.guestForm.get('name')?.value || '';
    const telNo = this.guestForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const telSuffix = String(telNo).slice(-3);

    this.foreignGuestId = namePrefix + "-" + telSuffix;
    this.guestForm.patchValue({
      foreign_nic: this.foreignGuestId
    });
  }

  generateGuestDependId() {
    const foreignNic = this.foreignGuestId;
    const relationship = this.guestForm.get('dependent_relationship')?.value;
    const age = this.guestForm.get('age')?.value;
    this.foreignGuestDependId = relationship + "-" + foreignNic + "-" + age;
  }

  selectGuestType() {
    const nameControl = this.guestForm.get('name');
    const telControl = this.guestForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      this.showAlert("Name and Telephone number are required before selecting guest type!", "warning");
    }

    const type = this.guestForm.get('guest_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal = false;
      this.guestForm.get('nic')?.disable();
      this.guestForm.get('foreign_nic')?.enable();

      this.generateGuestId();
      this.guestForm.patchValue({
        foreign_nic: this.foreignGuestId
      });
    } else if (type === "Local") {
      const nic = this.guestForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.guestForm.get('foreign_nic')?.disable();
      this.guestForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }
    } else {
      this.isForeign = false;
      this.isLocal = false;
      this.guestForm.get('foreign_nic')?.disable();
      this.guestForm.get('nic')?.disable();
    }
  }

  addSelectedGuest() {
    const dependentName = this.guestForm.get('dependent_name')?.value;
    const relationship = this.guestForm.get('dependent_relationship')?.value;
    const age = this.guestForm.get('age')?.value;

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

    this.guestForm.patchValue({ dependent_name: '', dependent_relationship: '', age: '' });
  }

  removeGuest(index: number) {
    this.guestDetails.splice(index, 1);
  }

  //set cuntry code
  setCountryCode(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target || !target.value) {
      this.guestForm.patchValue({ cuntry_code_id: '' });
      return;
    }

    const countryId = Number(target.value);
    const countryCode = this.countryCodes.find(
      x => Number(x.country_id) === countryId || Number(x.cuntry_id) === countryId
    );

    if (countryCode) {
      this.guestForm.patchValue({
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



  onSubmit() {
    if (this.guestForm.valid) {
      this.guestData = this.guestForm.getRawValue();
      let data = this.guestDetails;

      this.formData = new FormData();
      this.formData.append('form', JSON.stringify(this.guestData));
      this.formData.append('guestDetails', JSON.stringify(data));

      this.allServe.submitGuest(this.formData).subscribe({
        next: (response) => {
          this.clearForm();
          this.showAlert('Guest created successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.guestForm.markAllAsTouched();
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

  getGuestGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.guestGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }


  getCountryCode() {
    this.countryService.getCuntryCode().subscribe({
      next: (response: any) => {
        this.countryCodes = response.data;
      },
      error: (error) => {
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

  getGuide() {
    this.allServe.getGuideByAssign().subscribe({
      next: (data: any) => {
        this.guides = data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.guestForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
      const val = parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number("19" + val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.guestForm.disable();
        this.showAlert('Guest is under 18 years old. Form locked.', 'warning');
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.guestForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val = parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number(val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.guestForm.disable();
        this.showAlert('Guest is under 18 years old. Form locked.', 'warning');
      }
    }
  }

  ngOnInit() {
    this.getGuestGen();
    this.getGuide();
    this.getCountryCode();
    this.getCountries();
    this.guestForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (this.isLocal && nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });

    this.guestForm.get('tel_no')?.addValidators([
      this.phonePatternValidator(this.countryPhonePatterns, this.guestForm)
    ]);

    this.guestForm.get('country_id')?.valueChanges.subscribe(countryId => {
      if (!countryId) {
        this.guestForm.patchValue({ cuntry_code_id: '' }, { emitEvent: false });
      } else {
        const numericCountryId = Number(countryId);
        const countryCode = this.countryCodes.find(
          x => Number(x.country_id) === numericCountryId || Number(x.cuntry_id) === numericCountryId
        );

        if (countryCode) {
          this.guestForm.patchValue({ cuntry_code_id: countryCode.id }, { emitEvent: false });
        }
      }

      this.guestForm.get('tel_no')?.updateValueAndValidity();
    });
  }
}

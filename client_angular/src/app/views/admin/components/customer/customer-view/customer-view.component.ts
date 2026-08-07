import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective,
  FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {SearchService} from "../../../../../services/search.service";
import {IconDirective} from "@coreui/icons-angular";
import {CuntryService} from "../../../../../services/cuntry.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [
    AlertComponent,
    IconDirective,
    ButtonDirective,
    NgIf,
    TableDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    NgForOf,
    ReactiveFormsModule,
    RowComponent,
    FormDirective,
    FormTextDirective
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit {
  public visible = false;
  customers: any[] = [];
  customGenders: any[] = [];
  customerForm: FormGroup;
  custSearchForm: FormGroup;
  public error = null;
  customData: any;
  foreignCustomerId: any;
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  isForeign = false;
  isLocal = false;
  isUpdate = true;
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
    private fb: FormBuilder,
    private countryService: CuntryService,
    private searchServe: SearchService,
  ) {
    this.customerForm = this.fb.group({
      id: [''],
      custom_type: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      foreign_nic: ['', [Validators.required]],
      tel_no: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      cuntry_code_id: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.custSearchForm = this.fb.group({
      name: [''],
      gender_id: [''],
      country_id: [''],
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

  getCustom() {
    this.allServe.getCustomer().subscribe({
      next: (response: any) => {
        this.customers = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  customUpdate() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.getRawValue();

      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this customer's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.allServe.updateCustomer(customerData, customerData.id).subscribe({
            next: (response: any) => {
              this.getCustom();
              this.clearForm();

              // Extract the customer name from response object, form data, or fallback safely
              this.showAlert(`Customer updated successfully.`, 'success');
            },
            error: (error: any) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.customerForm.markAllAsTouched();
    }
  }
  generateCustomerId() {
    const name = this.customerForm.get('name')?.value || '';
    const telNo = this.customerForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const telSuffix = String(telNo).slice(-3);

    this.foreignCustomerId = namePrefix + "-" + telSuffix;
    this.customerForm.patchValue({
      foreign_nic: this.foreignCustomerId
    });
  }

  selectCustomerType() {
    const nameControl = this.customerForm.get('name');
    const telControl = this.customerForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      this.showAlert("Name and Telephone number are required!", "warning");
    }

    const type = this.customerForm.get('custom_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal = false;
      this.customerForm.get('nic')?.disable();
      this.customerForm.get('foreign_nic')?.enable();

      this.generateCustomerId();
      this.customerForm.patchValue({
        foreign_nic: this.foreignCustomerId
      });
    } else if (type === "Local") {
      const nic = this.customerForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.customerForm.get('foreign_nic')?.disable();
      this.customerForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }
    } else {
      this.isForeign = false;
      this.isLocal = false;
      this.customerForm.get('foreign_nic')?.disable();
      this.customerForm.get('nic')?.disable();
    }
  }

  getShow(id: any) {
    this.allServe.getCustomerById(id).subscribe({
      next: (data: any) => {
        this.isUpdate = false;
        this.customerForm.patchValue(data);
        this.showAlert('Customer details loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearForm() {
    this.customerForm.reset();
    if (this.customerForm.disabled) {
      this.customerForm.enable();
    }
    this.customerForm.patchValue({
      custom_type: '',
      gender_id: '',
      country_id: '',
      cuntry_code_id: '',
    });
  }

  customerDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.customerDelete(id).subscribe({
          next: (data: any) => {
            this.getCustom();
            this.showAlert('Customer deleted successfully.', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  search() {
    const filters = {
      name: this.custSearchForm.get('name')?.value?.trim() || '',
      country_id: this.custSearchForm.get('country_id')?.value || '',
      gender_id: this.custSearchForm.get('gender_id')?.value || ''
    };

    if (!filters.name && !filters.country_id && !filters.gender_id) {
      this.getCustom();
      return;
    }

    this.searchServe.getCustomer(filters).subscribe({
      next: (data: any) => {
        this.customers = data;
        if (data.length === 0) {
          this.showAlert('No records found for the search criteria.', 'info');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearSearchForm() {
    this.custSearchForm.reset();
    this.getCustom();
    this.getCountryCode();
    this.getCountries();
    this.getCustomGen();
    this.custSearchForm.patchValue({
      name: '',
      gender_id: '',
      country_id: '',
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.customData = this.customerForm.getRawValue();

      this.allServe.submitCustomer(this.customData).subscribe({
        next: (response) => {
          this.getCustom();
          this.clearForm();
          this.showAlert('Customer registered successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.customerForm.markAllAsTouched();
    }
  }

  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.customerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
      const val = parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number("19" + val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.customerForm.disable();
        this.showAlert('Customer is under 18 years old. Form locked.', 'warning');
      }
    } else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.customerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val = parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number(val);
      const age = currentYear - birthYear;

      if (age < 18) {
        this.customerForm.disable();
        this.showAlert('Customer is under 18 years old. Form locked.', 'warning');
      }
    }
  }

  handleError(error: any) {

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      // @ts-ignore
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  getCustomGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.customGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }



  setCountryCode(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target || !target.value) {
      this.customerForm.patchValue({ cuntry_code_id: '' });
      return;
    }

    const countryId = Number(target.value);
    const countryCode = this.countryCodes.find(
      x => Number(x.country_id) === countryId || Number(x.cuntry_id) === countryId
    );

    if (countryCode) {
      this.customerForm.patchValue({
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

  ngOnInit() {
    this.getCustom();
    this.getCustomGen();
    this.getCountryCode();
    this.getCountries();
    this.customerForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (this.isLocal && nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });

    this.customerForm.get('tel_no')?.addValidators([
      this.phonePatternValidator(this.countryPhonePatterns, this.customerForm)
    ]);

    this.customerForm.get('country_id')?.valueChanges.subscribe(countryId => {
      if (!countryId) {
        this.customerForm.patchValue({ cuntry_code_id: '' }, { emitEvent: false });
      } else {
        const numericCountryId = Number(countryId);
        const countryCode = this.countryCodes.find(
          x => Number(x.country_id) === numericCountryId || Number(x.cuntry_id) === numericCountryId
        );

        if (countryCode) {
          this.customerForm.patchValue({ cuntry_code_id: countryCode.id }, { emitEvent: false });
        }
      }

      this.customerForm.get('tel_no')?.updateValueAndValidity();
    });
  }
}

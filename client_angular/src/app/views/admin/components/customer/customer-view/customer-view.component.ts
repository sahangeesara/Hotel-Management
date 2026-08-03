import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ButtonDirective, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective,
  FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {IconDirective} from "@coreui/icons-angular";
import {CuntryService} from "../../../../../services/cuntry.service";

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [
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
export class CustomerViewComponent implements OnInit{
  public visible = false;
  customers: any[] = [];
  customGenders: any[] = [];
  customerForm:FormGroup;
  custSearchForm:FormGroup;
  public error=null;
  customData:any;
  foreignCustomerId:any;
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  isForeign=false;
  isLocal=false;

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private countryService: CuntryService,
    private searchServe: SearchService,
    private toastr: ToastrService,){
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
      gender_id:[''],
      country_id:[''],
    });
  }

  getCustom() {
    this.allServe.getCustomer().subscribe((response: any) => { this.customers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }
  customUpdate() {
    if (this.customerForm.valid) {

      const customerData = this.customerForm.getRawValue();

      this.allServe.updateCustomer(customerData, customerData.id).subscribe({
        next: (response: any) => {
          this.getCustom();
          this.clearForm();

          alert('Customer updated successfully.');
        },
        error: (error: any) => {
          console.error(error);
          this.handleError(error);
        }
      });
    }
  }
  generateCustomerId() {
    const name = this.customerForm.get('name')?.value || '';
    const telNo = this.customerForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();

    const telSuffix = String(telNo).slice(-3);

    this.foreignCustomerId = namePrefix +"-" + telSuffix;
    this.customerForm.patchValue({
      foreign_nic: this.foreignCustomerId
    });
  }

  selectCustomerType() {
    const nameControl = this.customerForm.get('name');
    const telControl = this.customerForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      alert("Name and Telephone number are required!");
    }

    const type = this.customerForm.get('custom_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal =false;
      this.customerForm.get('nic')?.disable();
      this.customerForm.get('foreign_nic')?.enable();

      this.generateCustomerId();
      this.customerForm.patchValue({
        foreign_nic: this.foreignCustomerId
      })
    }else if (type === "Local") {
      const nic = this.customerForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.customerForm.get('foreign_nic')?.disable();
      this.customerForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }

    }else {
      this.isForeign = false;
      this.isLocal = false;
      this.customerForm.get('foreign_nic')?.disable();
      this.customerForm.get('nic')?.disable();
    }
  }


  getShow(id:any) {
    this.allServe.getCustomerById(id).subscribe(
      (data: any) => {

        this.customerForm.patchValue(data);

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  clearForm() {
    this.customerForm.reset();
    if(this.customerForm.disabled){
      this.customerForm.enable();
    }
    this.customerForm.patchValue(
      {
        custom_type: '',
        gender_id: '',
        country_id: '',
        cuntry_code_id: '',
      }
    )
  }

  customerDelete(id:any){
    this.allServe.customerDelete(id).subscribe(
      (data: any) => {
        this.getCustom();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

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
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  clearSearchForm() {
  this.custSearchForm.reset();
    this.getCustom();
    this.getCountryCode();
    this.getCountries();
    this.getCustomGen();
    this.custSearchForm.patchValue(
      {
        name: '',
        gender_id: '',
        country_id: '',
      }
    )
  }

  onSubmit() {
    if (this.customerForm.valid) {

      this.customData = this.customerForm.getRawValue();

      this.allServe.submitCustomer(this.customData).subscribe(
        (response) => {
          // Handle successful submission
          this.getCustom();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.customerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false }); // { emitEvent: false } prevents infinite loops
      }
      const val= parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number("19"+val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.customerForm.disable();
      }


    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.customerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val= parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number(val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.customerForm.disable();
      }
    }
  }

  handleError(error: { error: null; }) {
    return this.error = error.error;
  }

    getCustomGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.customGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }


  setCountryCode(event: Event) {
    const countryId = Number((event.target as HTMLSelectElement).value);

    const countryCode = this.countryCodes.find(
      x => x.cuntry_id === countryId
    );

    if (countryCode) {
      this.customerForm.patchValue({
        cuntry_code_id: countryCode.id
      });
    }
  }
  getCountryCode() {
    this.countryService.getCuntryCode().subscribe(
      (response: any) => {
        this.countryCodes = response.data;
      },
      (error) => {
        console.error('Error fetching Guest Gender:', error);
      }
    );
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
  }
}

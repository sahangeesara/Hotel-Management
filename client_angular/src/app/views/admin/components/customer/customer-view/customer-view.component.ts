import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ButtonDirective, ColComponent, FormControlDirective, FormLabelDirective, FormSelectDirective,
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
        RowComponent
    ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit{
  public visible = false;
  customers: any[] = [];
  customGenders: any[] = [];
  customerForm:FormGroup;
  public error=null;
  customData:any;
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();

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
      tel_no: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      cuntry_code_id: ['', [Validators.required]],
      city: ['', [Validators.required]],
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
  }
}

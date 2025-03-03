import {Component, ViewChild} from '@angular/core';
import {
    ButtonDirective, ColComponent, FormControlDirective, FormLabelDirective, FormSelectDirective, FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent, ModalTitleDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {CustomerUpdateComponent} from "../customer-update/customer-update.component";
import {IconDirective} from "@coreui/icons-angular";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-customer-view',
  standalone: true,
    imports: [
        IconDirective,
        ButtonDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        TableDirective,
        CustomerUpdateComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        NgForOf,
        ReactiveFormsModule,
        RowComponent
    ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent {
  public visible = false;
  customers: any[] = [];
  customGenders: any[] = [];
  customerAddForm:FormGroup;
  public error=null;
  customData:any;
  @ViewChild(CustomerUpdateComponent) customerUpdateComponent : CustomerUpdateComponent | undefined;
  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,){
    this.customerAddForm = this.fb.group({

      custom_type: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      tel_no: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }
  handleLiveDemoChange(event: any) { this.visible = event; }
  toggleLiveDemo() { this.visible = !this.visible;}

  getCustom() {
    this.allServe.getCustomer().subscribe((response: any) => { this.customers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }

  getShow(id:any) {
    this.allServe.getCustomerById(id).subscribe(
      (data: any) => {

        this.customerUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  clearForm() {

    this.customerAddForm.reset();
    // this.empTypeField.setValue("Select Employee Type");
    // this.empGenField.setValue("Select Employee Gender");

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
    if (this.customerAddForm.valid) {

      this.customData = this.customerAddForm.getRawValue();

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
  ngOnInit() {
    this.getCustom();
    this.getCustomGen();
  }
}

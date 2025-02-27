import {Component, ViewChild} from '@angular/core';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-supplier-update',
  standalone: true,
    imports: [
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        RowComponent
    ],
  templateUrl: './supplier-update.component.html',
  styleUrl: './supplier-update.component.scss'
})
export class SupplierUpdateComponent {
  public error=null;

  supplierUpdateForm : FormGroup;
  supplierGenders: any[] = [];
  suppliers: any[] = [];
  formData = new FormData();

  supplierData:any;
  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,) {
    this.supplierUpdateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      company_name: ['', Validators.required],
      gender_id: ['', Validators.required],
      supp_no: ['', Validators.required],
    });
  }

  getData(data:any){
    this.supplierUpdateForm.patchValue(data);
  }
  suppUpdate(){
    this.formData = new FormData();
    if (this.supplierUpdateForm.valid) {

      this.supplierData = this.supplierUpdateForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.supplierData));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateSupplier(this.formData,this.supplierData.id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.clearForm();
            this.getSupp();
            return data; // If you need to return a value for further processing

          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();
    }

  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  get suppGenField(): FormControl {
    return this.supplierUpdateForm.controls['gender_id'] as FormControl;
  }
  clearForm() {
    this.supplierUpdateForm.reset();
    this.suppGenField.setValue("Select Supplier Gender");
  }
  getSupplierGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.supplierGenders = response.data;
      },
      (error) => {
        console.error('Error fetching supplier Gender:', error);
      }
    );
  }
  getSupp() {
    this.allServe.getSupplier().subscribe(
      (response: any) => {
        this.suppliers = response.data;

      },
      (error) => {
        console.error('Error fetching supplier:', error);
      }
    );
  }
  ngOnInit() {

    this.getSupplierGen()
  }

}

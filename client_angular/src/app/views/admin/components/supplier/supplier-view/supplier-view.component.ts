import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Supplier} from "../../../../../entities/supplier";
import {IconDirective} from "@coreui/icons-angular";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {SupplierUpdateComponent} from "../supplier-update/supplier-update.component";

@Component({
  selector: 'app-supplier-view',
  standalone: true,
  imports: [
    IconDirective,
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
    TableDirective,
    EmployeeUpdateComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    SupplierUpdateComponent
  ],
  templateUrl: './supplier-view.component.html',
  styleUrl: './supplier-view.component.scss'
})
export class SupplierViewComponent {
  @ViewChild(SupplierUpdateComponent) supplierUpdateComponent : SupplierUpdateComponent | undefined;
  public visible = false;
  public error=null;
  supplierSearchForm : FormGroup;
  supplierAddForm : FormGroup;
  showSupplierDetails = true;
  formData = new FormData();

  suppliers: any[] = [];
  supplierGenders: any[] = [];
  supplierData:any;
  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,) {
    this.supplierSearchForm = this.fb.group({
      searchName: [''],
      search_gender_id:[''],
    });
    this.supplierAddForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      company_name: ['', Validators.required],
      gender_id: ['', Validators.required],
    });
  }
  get suppGenField(): FormControl {return this.supplierAddForm.controls['gender_id'] as FormControl; }
  getSupp() {
    this.allServe.getSupplier().subscribe((response: any) => { this.suppliers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }
  getShow(id:any) {
    this.allServe.getSupplierById(id).subscribe(
      (data: any) => {

        this.supplierUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching supplier:', error);
      }
    );
  }
  handleLiveDemoChange(event: any) { this.visible = event; }
  toggleLiveDemo() { this.visible = !this.visible;}

  supplierDelete(id:any){
    this.allServe.supplierDelete(id).subscribe((data: any) => {this.getSupp(); },
      (error) => { console.error('Error fetching supplier:', error); });
  }

  getSupplierGen() {
    this.allServe.getGenders().subscribe((response: any) => {this.supplierGenders = response.data; },
      (error) => { console.error('Error fetching supplier Gender:', error); });
  }
  onSubmit(){
    this.formData = new FormData();
    if (this.supplierAddForm.valid) {

      this.supplierData = this.supplierAddForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.supplierData));
      const submissionObservable = from( this.allServe.submitSupplier(this.formData));

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
  handleError(error: { error: null; }){ return  this.error=error.error; }
  search(){  }
  clearSearchForm(){ this.supplierSearchForm.reset(); }
  ngOnInit() { this.getSupp();   this.getSupplierGen(); }

  clearForm() {this.supplierAddForm.reset(); this.suppGenField.setValue("Select Supplier Gender");}

  toggleView() { this.showSupplierDetails = !this.showSupplierDetails; }

}

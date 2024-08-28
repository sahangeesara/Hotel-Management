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
import {Employee} from "../../../../../entities/employee";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-employee-update',
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
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.scss'
})
export class EmployeeUpdateComponent {
  employeeTypes: any[] = [];
  employeeGenders: any[] = [];
  formData = new FormData();
  updateForm: FormGroup;
  public error=null;


  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.updateForm = this.fb.group({
      id:['',[Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      employee_type_id: ['', Validators.required],
      gender_id: ['', Validators.required],
    });

  }
  get empIdField(): FormControl {
    return this.updateForm.controls['id'] as FormControl;
  }
  get empNameField(): FormControl {
    return this.updateForm.controls['name'] as FormControl;
  }
  get empAddressField(): FormControl {
    return this.updateForm.controls['address'] as FormControl;
  }
  get empEmailField(): FormControl {
    return this.updateForm.controls['email'] as FormControl;
  }
  get empCityField(): FormControl {
    return this.updateForm.controls['city'] as FormControl;
  }
  get empNicField(): FormControl {
    return this.updateForm.controls['nic'] as FormControl;
  }
  get empTelNoField(): FormControl {
    return this.updateForm.controls['tel_no'] as FormControl;
  }
  get empTypeField(): FormControl {
    return this.updateForm.controls['employee_type_id'] as FormControl;
  }
  get empGenField(): FormControl {
    return this.updateForm.controls['gender_id'] as FormControl;
  }
  getEmpType() {
    this.allServe.getEmployeeTypes().subscribe(
      (response: any) => {
        this.employeeTypes = response.data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  getEmGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.employeeGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }
    getData(data:any){
        this.empIdField.setValue(data.id);
        this.empNameField.setValue(data.name);
        this.empAddressField.setValue(data.address);
        this.empNicField.setValue(data.nic);
        this.empCityField.setValue(data.city);
        this.empTelNoField.setValue(data.tel_no);
        this.empTypeField.setValue(data.employee_type_id);
        this.empGenField.setValue(data.gender_id);
        this.empEmailField.setValue(data.email);

    }
   async empUpdate(){
    this.formData = new FormData();
    let id;
    if (this.updateForm.valid) {

      let emp = new Employee();

      id = this.empIdField.value;

      emp.id = this.empIdField.value;
      emp.name = this.empNameField.value;
      emp.address = this.empAddressField.value;
      emp.nic = this.empNicField.value;
      emp.city = this.empCityField.value;
      emp.tel_no = this.empTelNoField.value;
      emp.employee_type_id = this.empTypeField.value;
      emp.gender_id = this.empGenField.value;
      emp.email = this.empEmailField.value;

      this.formData.append('form', JSON.stringify(emp));
      this.formData.append('_method', 'patch');
      const submissionObservable =  from( this.allServe.updateEmployee(this.formData,id));
      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.clearForm();
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
  clearForm() {

    this.empIdField.setValue("");
    this.empNameField.setValue("");
    this.empAddressField.setValue("");
    this.empNicField.setValue("");
    this.empCityField.setValue("");
    this.empTelNoField.setValue("");
    this.empTypeField.setValue("Select Employee Type");
    this.empGenField.setValue("Select Employee Gender");
    this.empEmailField.setValue("");

  }

  ngOnInit() {
    this.getEmpType();
    this.getEmGen();
  }
}

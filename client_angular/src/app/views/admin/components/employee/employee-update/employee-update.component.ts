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
  emp:any;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.updateForm = this.fb.group({
      id:['',[Validators.required]],
      emp_no:['',[Validators.required]],
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
       this.updateForm.patchValue(data);
    }
    empUpdate(){
    this.formData = new FormData();
    if (this.updateForm.valid) {

    this.emp = this.updateForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.emp));
      this.formData.append('_method', 'patch');
      const submissionObservable =  from( this.allServe.updateEmployee(this.formData,this.emp.id));
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

    this.updateForm.reset();
    this.empTypeField.setValue("Select Employee Type");
    this.empGenField.setValue("Select Employee Gender");

  }

  ngOnInit() {
    this.getEmpType();
    this.getEmGen();
  }
}

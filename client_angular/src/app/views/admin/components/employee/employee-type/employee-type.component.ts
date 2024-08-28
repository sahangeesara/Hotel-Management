import { Component } from '@angular/core';
import {
  ButtonDirective, ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Employee} from "../../../../../entities/employee";
import {EmployeeType} from "../../../../../entities/employeeTypee";
import { IconDirective } from '@coreui/icons-angular';
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-employee-type',
  standalone: true,
  imports: [
    FormDirective,
    FormsModule,
    ReactiveFormsModule,
    FormControlDirective,
    FormLabelDirective,
    FormTextDirective,
    ButtonDirective,
    TableDirective,
    ColComponent,
    RowComponent,
    IconDirective
  ],
  templateUrl: './employee-type.component.html',
  styleUrl: './employee-type.component.scss'
})
export class EmployeeTypeComponent {
  employeeTypes: any[] = [];
  formData = new FormData();
  empTypeForm: FormGroup;
  public error=null;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.empTypeForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
    });

  }

  get empTypeIdField(): FormControl {
    return this.empTypeForm.controls['id'] as FormControl;
  }


  get empTypeNameField(): FormControl {
    return this.empTypeForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.empTypeNameField.setValue("");

  }
   onSubmit() {
    this.formData = new FormData();
    if (this.empTypeForm.valid) {

      let empType = new EmployeeType();

      empType.name= this.empTypeNameField.value;

      this.formData.append('form', JSON.stringify(empType));
      const submissionObservable = from( this.allServe.submitEmployeeType(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getEmpType();
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

   updateEmpType() {
    this.formData = new FormData();
    let id;
    if (this.empTypeForm.valid) {

      let empType = new EmployeeType();

      id = this.empTypeIdField.value;

      empType.id = this.empTypeIdField.value;
      empType.name = this.empTypeNameField.value;

      this.formData.append('form', JSON.stringify(empType));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateEmployeeType(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getEmpType();
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

  empTypeDelete(id:any){
    this.allServe.employeeTypesDelete(id).subscribe(
      (data: any) => {
        this.getEmpType();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  getEmpTypeById(id:any) {
    this.allServe.getEmployeeTypeById(id).subscribe(
      (employeeType:any) => {

        this.empTypeIdField.setValue(employeeType.id);
        this.empTypeNameField.setValue(employeeType.name);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
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


  ngOnInit() {
    this.getEmpType();
  }


}

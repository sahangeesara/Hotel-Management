import { Component } from '@angular/core';
import {
  ButtonDirective, ColComponent,
  FormCheckComponent,
  FormCheckInputDirective, FormCheckLabelDirective,
  FormControlDirective, FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {NgForOf} from "@angular/common";
import {Employee} from "../../../../../entities/employee";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    FormControlDirective,
    FormLabelDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    ButtonDirective,
    FormTextDirective,
    FormCheckLabelDirective,
    FormDirective,
    ReactiveFormsModule,
    FormSelectDirective,
    NgForOf,
    RowComponent,
    ColComponent
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent {

  public error=null;
  employeeTypes: any[] = [];
  employeeGenders: any[] = [];
  formData = new FormData();
  empForm: FormGroup;
  employeeData:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.empForm = this.fb.group({

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
    return this.empForm.controls['employee_type_id'] as FormControl;
  }
  get empGenField(): FormControl {
    return this.empForm.controls['gender_id'] as FormControl;
  }

  clearForm() {
    this.empForm.reset();
    this.empTypeField.patchValue("Select Employee Type");
    this.empGenField.patchValue("Select Employee Gender");

  }

  onSubmit() {
    if (this.empForm.valid) {
      this.employeeData = this.empForm.getRawValue();

      this.allServe.submitEmployee(this.employeeData).subscribe(
        (response) => {
          // Handle successful submission
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  getEmpType() {
    this.allServe.getEmployeeTypes().subscribe(
      (response: any) => {
        this.employeeTypes = response.data ?? response;
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


  ngOnInit() {
    this.getEmpType();
    this.getEmGen();
  }
}

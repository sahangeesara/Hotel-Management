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
    RowComponent
  ],
  templateUrl: './employee-type.component.html',
  styleUrl: './employee-type.component.scss'
})
export class EmployeeTypeComponent {
  employeeTypes: any[] = [];
  formData = new FormData();
  empTypeForm: FormGroup;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.empTypeForm = this.fb.group({

      name: ['', [Validators.required]],
    });

  }

  get empTypeNameField(): FormControl {
    return this.empTypeForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.empTypeNameField.setValue("");

  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.empTypeForm.valid) {

      let empType = new EmployeeType();

      empType.name= this.empTypeNameField.value;

      this.formData.append('form', JSON.stringify(empType));
      await this.allServe.submitEmployeeType(this.formData);
      this.getEmpType();
      this.clearForm();
      this.toastr.success("Employee Successfully submit ");
    }
  }
  getEmpType() {
    this.allServe.getEmployeeTypes().subscribe(
      (data: any) => {
        this.employeeTypes = data;
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

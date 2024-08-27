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

  async updateEmpType() {
    this.formData = new FormData();
    let $id;
    if (this.empTypeForm.valid) {

      let empType = new EmployeeType();

      $id = this.empTypeIdField.value;

      empType.id = this.empTypeIdField.value;
      empType.name = this.empTypeNameField.value;

      console.log(empType,$id)
      this.formData.append('form', JSON.stringify(empType));
      console.log(this.formData)
     await this.allServe.updateEmployeeType(this.formData, $id);

      this.getEmpType();
      this.toastr.success("Employee Successfully submit ");
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

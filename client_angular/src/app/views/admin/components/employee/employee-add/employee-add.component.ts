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
  employeeTypes: any[] = [];
  employeeGenders: any[] = [];
  formData = new FormData();
  empForm: FormGroup;
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
  get empNameField(): FormControl {
    return this.empForm.controls['name'] as FormControl;
  }
  get empAddressField(): FormControl {
    return this.empForm.controls['address'] as FormControl;
  }
  get empEmailField(): FormControl {
    return this.empForm.controls['email'] as FormControl;
  }
  get empCityField(): FormControl {
    return this.empForm.controls['city'] as FormControl;
  }
  get empNicField(): FormControl {
    return this.empForm.controls['nic'] as FormControl;
  }
  get empTelNoField(): FormControl {
    return this.empForm.controls['tel_no'] as FormControl;
  }
  get empTypeField(): FormControl {
    return this.empForm.controls['employee_type_id'] as FormControl;
  }
  get empGenField(): FormControl {
    return this.empForm.controls['gender_id'] as FormControl;
  }

  clearForm() {
    this.empNameField.setValue("");
    this.empAddressField.setValue("");
    this.empNicField.setValue("");
    this.empCityField.setValue("");
    this.empTelNoField.setValue("");
    this.empTypeField.setValue("Select Employee Type");
    this.empGenField.setValue("Select Employee Gender");
    this.empEmailField.setValue("");

  }

  async onSubmit() {
    this.formData = new FormData();
    if (this.empForm.valid) {

      let emp = new Employee();

      emp.name= this.empNameField.value;
      emp.address= this.empAddressField.value;
      emp.nic= this.empNicField.value;
      emp.city= this.empCityField.value;
      emp.tel_no= this.empTelNoField.value;
      emp.employee_type_id= this.empTypeField.value;
      emp.gender_id= this.empGenField.value;
      emp.email= this.empEmailField.value;


      this.formData.append('form', JSON.stringify(emp));
      await this.allServe.submitEmployee(this.formData);
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

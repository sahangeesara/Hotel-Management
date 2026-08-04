import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective, ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    FormControlDirective,
    FormLabelDirective,
    ButtonDirective,
    FormTextDirective,
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
export class EmployeeAddComponent implements OnInit {

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

  clearForm() {
    this.empForm.reset();
    this.empForm.patchValue({
      employee_type_id:'',
      gender_id:'',
    });
    if(this.empForm.disabled){
      this.empForm.enable();
    }
  }

  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.empForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false }); // { emitEvent: false } prevents infinite loops
      }
      const val= parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number("19"+val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.empForm.disable();
      }

    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.empForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val= parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number(val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.empForm.disable();
      }
    }
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

    this.empForm.get('nic')?.valueChanges.subscribe(nicValue => {
      this.checkNicAndSetGender(nicValue);
    });
  }
}

import {Component, ViewChild} from '@angular/core';
import {AllServiceService} from "../../../../../services/all-service.service";
import {
  ButtonCloseDirective,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';
import {EmployeeUpdateComponent} from "../employee-update/employee-update.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Employee} from "../../../../../entities/employee";
import {ToastrService} from "ngx-toastr";
import {NgForOf, NgIf} from "@angular/common";
import {SearchService} from "../../../../../services/search.service";

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    IconDirective,
    TableDirective,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    EmployeeUpdateComponent,
    NgIf,
    FormDirective,
    FormsModule,
    RowComponent,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormTextDirective,
    ReactiveFormsModule,
    FormSelectDirective,
    NgForOf
  ],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss'
})
export class EmployeeViewComponent {
  @ViewChild(EmployeeUpdateComponent) employeeUpdateComponent : EmployeeUpdateComponent | undefined;
  employees: any[] = [];
  public visible = false;
  employeeGenders: any[] = [];
  employeeTypes: any[] = [];

  formData = new FormData();
  empSearchForm: FormGroup;

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,) {
    this.empSearchForm = this.fb.group({
      name: [''],
      gender_id:[''],
      employee_type_id:[''],
    });
  }
  get empSearchNameField(): FormControl {
    return this.empSearchForm.controls['name'] as FormControl;
  }
  get empSearchGenderField(): FormControl {
    return this.empSearchForm.controls['gender_id'] as FormControl;
  }
  get empSearchTypeField(): FormControl {
    return this.empSearchForm.controls['employee_type_id'] as FormControl;
  }

  search() {
    let s_name = this.empSearchNameField.value;
    let s_gender = this.empSearchGenderField.value;
    let s_type = this.empSearchTypeField.value;

    if(s_type && s_gender && !(s_name)){
      this.searchServe.getEmployeeByTypeAndGender(s_type,s_gender).subscribe(
        (data: any) => { this.employees = data; },
        (error) => {console.error('Error fetchingEmployee Type and Gender:', error);});
    }
    else if(s_name && s_gender && !(s_type)){
      this.searchServe.getEmployeeByNameAndGender(s_name,s_gender).subscribe(
        (data: any) => {this.employees = data; },
        (error) => {console.error('Error fetching Employee name and Gender:', error); });
    }
    else if(s_name && s_type && !(s_gender)){
      this.searchServe.getEmployeeByNameAndType(s_name,s_type).subscribe(
        (data: any) => {this.employees = data; },
        (error) => {console.error('Error fetching Employee name and Type:', error); });
    }
    else if(s_name && !(s_type) && !(s_gender)){
      this.searchServe.getEmployeeByName(s_name).subscribe(
        (data: any) => {this.employees = data; },
        (error) => {console.error('Error fetching Employee name:', error); });
    }
    else if(s_gender && !(s_name) && !(s_type) ){
      this.searchServe.getEmployeeByGender(s_gender).subscribe(
        (data: any) => { this.employees = data; },
        (error) => {console.error('Error fetching Employee gender:', error);});
    }
    else if(s_type && !(s_name) && !(s_gender)){
      this.searchServe.getEmployeeByType(s_type).subscribe(
        (data: any) => { this.employees = data; },
        (error) => {console.error('Error fetching Employee Type:', error);});
    }
    else if(s_name && s_gender && s_type){
      this.searchServe.getEmployeeByNameAndTypeAndGender(s_name,s_type,s_gender).subscribe(
        (data: any) => {this.employees = data; },
        (error) => {console.error('Error fetching Employee name and Type and Gender:', error); });
    }
  }

  clearSearchForm() {
    this.empSearchNameField.setValue("");
    this.empSearchGenderField.setValue("");
    this.empSearchTypeField.setValue("");
    this.getEmp();
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
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  getEmp() {
    this.allServe.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.data;

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  empDelete(id:any){
    this.allServe.employeeDelete(id).subscribe(
      (data: any) => {
        this.getEmp();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  getShow(id:any) {
    this.allServe.getEmployeeById(id).subscribe(
      (data: any) => {

        this.employeeUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching employee:', error);
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
    this.getEmp();
    this.getEmGen();
    this.getEmpType();
  }


}

import {Component, OnInit, ViewChild} from '@angular/core';
import {AllServiceService} from "../../../../../services/all-service.service";
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
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';
import {EmployeeUpdateComponent} from "../employee-update/employee-update.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgForOf, NgIf} from "@angular/common";
import {SearchService} from "../../../../../services/search.service";

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    IconDirective,
    TableDirective,
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
export class EmployeeViewComponent implements OnInit{
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
    const filters = {
      name: this.empSearchNameField.value?.trim() || '',
      employee_type_id: this.empSearchTypeField.value || '',
      gender_id: this.empSearchGenderField.value || ''
    };

    // If no filters, load all employees
    if (!filters.name && !filters.employee_type_id && !filters.gender_id) {
      this.getEmp();
      return;
    }

    this.searchServe.getEmployees(filters).subscribe({
      next: (data: any) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
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
        console.log(response); // DEBUG
        this.employeeTypes = response.data ?? response;
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

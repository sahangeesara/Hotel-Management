import {Component, OnInit, ViewChild} from '@angular/core';
import {AllServiceService} from "../../../../../services/all-service.service";
import {
  AlertComponent,
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
import {NgForOf, NgIf} from "@angular/common";
import {SearchService} from "../../../../../services/search.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    AlertComponent,
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
export class EmployeeViewComponent implements OnInit {
  @ViewChild(EmployeeUpdateComponent) employeeUpdateComponent : EmployeeUpdateComponent | undefined;
  employees: any[] = [];
  public visible = false;
  employeeGenders: any[] = [];
  employeeTypes: any[] = [];

  formData = new FormData();
  empSearchForm: FormGroup;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
  ) {
    this.empSearchForm = this.fb.group({
      name: [''],
      gender_id: [''],
      employee_type_id: [''],
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
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

    if (!filters.name && !filters.employee_type_id && !filters.gender_id) {
      this.getEmp();
      return;
    }

    this.searchServe.getEmployees(filters).subscribe({
      next: (data: any) => {
        this.employees = data;
        if (data.length === 0) {
          this.showAlert('No employees found matching search criteria.', 'info');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearSearchForm() {
    Swal.fire({
      title: 'Clear Search Filters?',
      text: "This will reset search criteria and reload all employees.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empSearchForm.reset();
        this.empSearchNameField.setValue("");
        this.empSearchGenderField.setValue("");
        this.empSearchTypeField.setValue("");
        this.getEmp();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
  }

  getEmpType() {
    this.allServe.getEmployeeTypes().subscribe({
      next: (response: any) => {
        this.employeeTypes = response.data ?? response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  getEmp() {
    this.allServe.getEmployees().subscribe({
      next: (response: any) => {
        this.employees = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  empDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this employee deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.employeeDelete(id).subscribe({
          next: (data: any) => {
            this.getEmp();
            this.showAlert('Employee deleted successfully.', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  getShow(id: any) {
    this.allServe.getEmployeeById(id).subscribe({
      next: (data: any) => {
        this.employeeUpdateComponent?.getData(data);
        this.toggleLiveDemo();
        this.showAlert('Employee details loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getEmGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.employeeGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  handleError(error: any) {
    console.error('Backend Error:', error);
    let errorMessage = 'An unexpected server error occurred.';

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      errorMessage = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error?.error === 'string') {
      errorMessage = error.error;
    }

    this.showAlert(errorMessage, 'danger');
  }

  ngOnInit() {
    this.getEmp();
    this.getEmGen();
    this.getEmpType();
  }
}

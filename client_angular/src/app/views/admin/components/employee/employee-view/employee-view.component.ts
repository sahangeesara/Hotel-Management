import {Component, ViewChild} from '@angular/core';
import {AllServiceService} from "../../../../../services/all-service.service";
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
  TableDirective
} from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';
import {EmployeeUpdateComponent} from "../employee-update/employee-update.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../../../entities/employee";
import {ToastrService} from "ngx-toastr";
import {NgIf} from "@angular/common";

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
    NgIf
  ],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss'
})
export class EmployeeViewComponent {
  @ViewChild(EmployeeUpdateComponent) employeeUpdateComponent : EmployeeUpdateComponent | undefined;
  employees: any[] = [];
  public visible = false;

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,) {  }


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




  ngOnInit() {
    this.getEmp();
  }
}

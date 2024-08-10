import { Component } from '@angular/core';
import {AllServiceService} from "../../../../../services/all-service.service";
import {TableDirective} from "@coreui/angular";

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    TableDirective
  ],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss'
})
export class EmployeeViewComponent {
  employees: any[] = [];
  constructor(  private allServe: AllServiceService,) {  }
  getEmp() {
    this.allServe.getEmployees().subscribe(
      (data: any) => {
        this.employees = data;
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

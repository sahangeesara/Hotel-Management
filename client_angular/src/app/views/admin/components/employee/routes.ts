import { Routes } from '@angular/router';
import {EmployeeViewComponent} from "./employee-view/employee-view.component";
import {EmployeeAddComponent} from "./employee-add/employee-add.component";
import {EmployeeTypeComponent} from "./employee-type/employee-type.component";

export const routes: Routes = [
  {
    path: 'employee_add',
    loadComponent: () => import('./employee-add/employee-add.component').then(m => m.EmployeeAddComponent),
    data: {
      title: 'Employee Add'
    }
  },
  {
    path: 'employee_view',
    loadComponent: () => import('./employee-view/employee-view.component').then(m => m.EmployeeViewComponent),
    data: {
      title: 'Employee View'
    }
  },
  {
    path: 'employee_type',
    loadComponent: () => import('./employee-type/employee-type.component').then(m => m.EmployeeTypeComponent),
    data: {
      title: 'Employee Type'
    }
  },
];

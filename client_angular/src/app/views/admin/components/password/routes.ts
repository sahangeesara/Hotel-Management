import { Routes } from '@angular/router';;
import {ChangePasswordComponent} from "./change-password/change-password.component";

export const routes: Routes = [
  {
    path: 'password_chang',
    loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent),
    data: {
      title: 'Password Chang'
    }
  },
];

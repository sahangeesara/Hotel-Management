import { Routes } from '@angular/router';;
import {UserComponent} from "./user/user.component";

export const routes: Routes = [
  {
    path: 'user_view',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
    data: {
      title: 'User'
    }
  },
];

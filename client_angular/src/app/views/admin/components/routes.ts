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
  {
    path: 'user_role',
    loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
    data: {
      title: 'Role'
    }
  },
  {
    path: 'user_profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    data: {
      title: 'Profile'
    }
  },
];

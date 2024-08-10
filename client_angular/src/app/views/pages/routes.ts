import { Routes } from '@angular/router';
import {RequestResetComponent} from "./password/request-reset/request-reset.component";
import {ResponseResetComponent} from "./password/response-reset/response-reset.component";

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'request-password-reset',
    loadComponent: () => import('./password/request-reset/request-reset.component').then(m => m.RequestResetComponent),
    data: {
      title: 'Request Password Page'
    }
  },
  {
    path: 'response-password-reset',
    loadComponent: () => import('./password/response-reset/response-reset.component').then(m => m.ResponseResetComponent),
    data: {
      title: 'Response Password Page'
    }
  },
];

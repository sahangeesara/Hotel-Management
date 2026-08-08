import {PreloadingStrategy, Route, Routes} from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from "./guard/auth.guard";
import { roleGuard } from "./guard/role.guard"; // Import your role guard
import { Observable, of } from "rxjs";

export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/admin/dashboard/routes').then((m) => m.routes),
        data: { preload: true }
      },
      // Example: Restrict 'user' management exclusively to 'Admin'
      {
        path: 'user',
        loadChildren: () => import('./views/admin/components/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin'] }
      },
      // Example: Restrict 'employee' management to 'Admin' and 'Manager'
      {
        path: 'employee',
        loadChildren: () => import('./views/admin/components/employee/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin', 'Manager'] }
      },
      {
        path: 'room',
        loadChildren: () => import('./views/admin/components/room/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'report',
        loadChildren: () => import('./views/admin/components/report/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin', 'Manager'] }
      },
      {
        path: 'event',
        loadChildren: () => import('./views/admin/components/event/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'hotel',
        loadChildren: () => import('./views/admin/components/hotel/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'travel',
        loadChildren: () => import('./views/admin/components/travel/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'guest',
        loadChildren: () => import('./views/admin/components/guest/routes').then((m) => m.routes),
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'guide',
        loadChildren: () => import('./views/admin/components/guide/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'order',
        loadChildren: () => import('./views/admin/components/order/routes').then((m) => m.routes),
        data: { preload: true,roles: ['Admin', 'Manager','Receptionist'] }
      },
      {
        path: 'change_password',
        loadChildren: () => import('./views/admin/components/password/routes').then((m) => m.routes),
        data: { preload: true }
      },
      {
        path: 'food',
        loadChildren: () => import('./views/admin/components/food/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true ,roles: ['Admin', 'Manager','Receptionist']}
      },
      {
        path: 'package',
        loadChildren: () => import('./views/admin/components/package/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true ,roles: ['Admin', 'Manager','Receptionist']}
      },
      {
        path: 'role',
        loadChildren: () => import('./views/admin/components/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin'] }
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/admin/components/routes').then((m) => m.routes),
        data: { preload: true }
      },
      {
        path: 'payments',
        loadChildren: () => import('./views/admin/components/payment/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true ,roles: ['Admin', 'Manager','Receptionist']}
      },
      {
        path: 'customer',
        loadChildren: () => import('./views/admin/components/customer/routes').then((m) => m.routes),
        canActivate: [roleGuard],
        data: { preload: true, roles: ['Admin', 'Manager','Receptionist']}
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes),
        data: { preload: true }
      }
    ],
    canActivate: [authGuard] // Ensures user is authenticated before checking specific role guards down the tree
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: { title: 'Page 404' }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: { title: 'Page 500' }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login Page' }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register Page' }
  },
  {
    path: 'request-password-reset',
    loadComponent: () => import('./views/pages/password/request-reset/request-reset.component').then(m => m.RequestResetComponent),
    data: { title: 'Request Password Page' }
  },
  {
    path: 'response-password-reset',
    loadComponent: () => import('./views/pages/password/response-reset/response-reset.component').then(m => m.ResponseResetComponent),
    data: { title: 'Response Password Page' }
  },
  { path: '**', redirectTo: '404' },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/admin/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'room',
        loadChildren: () => import('./views/admin/components/room/routes').then((m) => m.routes)
      },
      {
        path: 'employee',
        loadChildren: () => import('./views/admin/components/employee/routes').then((m) => m.routes)
      },
      {
        path: 'guest',
        loadChildren: () => import('./views/admin/components/guest/routes').then((m) => m.routes)
      },
      {
        path: 'guide',
        loadChildren: () => import('./views/admin/components/guide/routes').then((m) => m.routes)
      },
      {
        path: 'order',
        loadChildren: () => import('./views/admin/components/order/routes').then((m) => m.routes)
      },
      {
        path: 'user',
        loadChildren: () => import('./views/admin/components/routes').then((m) => m.routes)
      },
      {
        path: 'change_password',
        loadChildren: () => import('./views/admin/components/password/routes').then((m) => m.routes)
      },
      {
        path: 'food',
        loadChildren: () => import('./views/admin/components/food/routes').then((m) => m.routes)
      },
      // {
      //   path: 'room_category',
      //   loadChildren: () => import('./views/components/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      // },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'request-password-reset',
    loadComponent: () => import('./views/pages/password/request-reset/request-reset.component').then(m => m.RequestResetComponent),
    data: {
      title: 'Request Password Page'
    }
  },
  {
    path: 'response-password-reset',
    loadComponent: () => import('./views/pages/password/response-reset/response-reset.component').then(m => m.ResponseResetComponent),
    data: {
      title: 'Response Password Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];

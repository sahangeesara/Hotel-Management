import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'customer_view',
    loadComponent: () => import('./customer-view/customer-view.component').then(m => m.CustomerViewComponent),
    data: {
      title: 'Customer View'
    }
  },
];

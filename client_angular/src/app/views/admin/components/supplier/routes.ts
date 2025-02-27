import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'supplier_view',
    loadComponent: () => import('./supplier-view/supplier-view.component').then(m => m.SupplierViewComponent),
    data: {
      title: 'Supplier View'
    }
  },
  {
    path: 'supplier_update',
    loadComponent: () => import('./supplier-update/supplier-update.component').then(m => m.SupplierUpdateComponent),
    data: {
      title: 'Supplier Update'
    }
  },
];

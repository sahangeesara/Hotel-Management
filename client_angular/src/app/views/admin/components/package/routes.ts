import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'package_view',
    loadComponent: () => import('./package.component').then(m => m.PackageComponent),
    data: {
      title: 'Package View'
    }
  },
];

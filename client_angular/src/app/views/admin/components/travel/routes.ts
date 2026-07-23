import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transport_book',
    loadComponent: () => import('./transport-book/transport-book.component').then(m => m.TransportBookComponent),
    data: {
      title: 'Transport Book'
    }
  },
];

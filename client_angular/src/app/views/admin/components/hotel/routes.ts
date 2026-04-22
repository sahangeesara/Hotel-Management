import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'hotel_view',
    loadComponent: () => import('./hotel/hotel.component').then(m => m.HotelComponent),
    data: {
      title: 'Hotel View'
    }
  },
];

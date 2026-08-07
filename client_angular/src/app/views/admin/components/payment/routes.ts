import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'payment_view',
    loadComponent: () => import('./payment-details/payment-details.component').then(m => m.PaymentDetailsComponent),
    data: {
      title: 'Payment Details'
    }
  },

];

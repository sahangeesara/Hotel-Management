import { Routes } from '@angular/router';
import {OrderViewComponent} from "./order-view/order-view.component";
import {OrderAddComponent} from "./order-add/order-add.component";
import {OrderStatusComponent} from "./order-status/order-status.component";

export const routes: Routes = [
  {
    path: 'order_add',
    loadComponent: () => import('./order-add/order-add.component').then(m => m.OrderAddComponent),
    data: {
      title: 'Order Add'
    }
  },
  {
    path: 'order_view',
    loadComponent: () => import('./order-view/order-view.component').then(m => m.OrderViewComponent),
    data: {
      title: 'Order View'
    }
  },
  {
    path: 'order_status',
    loadComponent: () => import('./order-status/order-status.component').then(m => m.OrderStatusComponent),
    data: {
      title: 'Order Status'
    }
  },
];

import { Routes } from '@angular/router';
import {GuestAddComponent} from "./guest-add/guest-add.component";
import {GuestViewComponent} from "./guest-view/guest-view.component";

export const routes: Routes = [
  {
    path: 'guest_add',
    loadComponent: () => import('./guest-add/guest-add.component').then(m => m.GuestAddComponent),
    data: {
      title: 'Guest Add'
    }
  },
  {
    path: 'guest_view',
    loadComponent: () => import('./guest-view/guest-view.component').then(m => m.GuestViewComponent),
    data: {
      title: 'Guest View'
    }
  },

];

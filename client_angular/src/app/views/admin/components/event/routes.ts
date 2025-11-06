import { Routes } from '@angular/router';
import {EventComponent} from "./event/event.component";
import {EventBookComponent} from "./event-book/event-book.component";

export const routes: Routes = [
  {
    path: 'event_view',
    loadComponent: () => import('./event/event.component').then(m => m.EventComponent),
    data: {
      title: 'Event Page'
    }
  },
  {
    path: 'event_book',
    loadComponent: () => import('./event-book/event-book.component').then(m => m.EventBookComponent),
    data: {
      title: 'Event Book'
    }
  },

];

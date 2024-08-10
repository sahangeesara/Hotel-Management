import { Routes } from '@angular/router';
import {RoomAddComponent} from "./room-add/room-add.component";
import {RoomViewComponent} from "./room-view/room-view.component";

export const routes: Routes = [
  {
    path: 'room_add',
    loadComponent: () => import('./room-add/room-add.component').then(m => m.RoomAddComponent),
    data: {
      title: 'Room Add'
    }
  },
  {
    path: 'room_view',
    loadComponent: () => import('./room-view/room-view.component').then(m => m.RoomViewComponent),
    data: {
      title: 'Room View'
    }
  },
  {
    path: 'room_book_view',
    loadComponent: () => import('./room-book/room-book.component').then(m => m.RoomBookComponent),
    data: {
      title: 'Room Book'
    }
  },
  {
    path: 'room_category_view',
    loadComponent: () => import('./rooms-category/rooms-category.component').then(m => m.RoomsCategoryComponent),
    data: {
      title: 'Room Category'
    }
  }
];

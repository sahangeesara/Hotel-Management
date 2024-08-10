import { Routes } from '@angular/router';
import {GuideAddComponent} from "./guide-add/guide-add.component";
import {GuideViewComponent} from "./guide-view/guide-view.component";
export const routes: Routes = [
  {
    path: 'guide_add',
    loadComponent: () => import('./guide-add/guide-add.component').then(m => m.GuideAddComponent),
    data: {
      title: 'Guide Add'
    }
  },
  {
    path: 'guide_view',
    loadComponent: () => import('./guide-view/guide-view.component').then(m => m.GuideViewComponent),
    data: {
      title: 'Guide View'
    }
  },

];

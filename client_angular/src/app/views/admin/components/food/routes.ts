import { Routes } from '@angular/router';
import {FoodAddComponent} from "./food-add/food-add.component";
import {FoodStatusComponent} from "./food-status/food-status.component";
import {FoodViewComponent} from "./food-view/food-view.component";
import {ItemCategoryComponent} from "./item-category/item-category.component";

export const routes: Routes = [
  {
    path: 'food_add',
    loadComponent: () => import('./food-add/food-add.component').then(m => m.FoodAddComponent),
    data: {
      title: 'Food Add'
    }
  },
  {
    path: 'food_view',
    loadComponent: () => import('./food-view/food-view.component').then(m => m.FoodViewComponent),
    data: {
      title: 'Food View'
    }
  },
  {
    path: 'food_status',
    loadComponent: () => import('./food-status/food-status.component').then(m => m.FoodStatusComponent),
    data: {
      title: 'Food Status'
    }
  },
  {
    path: 'item_category',
    loadComponent: () => import('./item-category/item-category.component').then(m => m.ItemCategoryComponent),
    data: {
      title: 'Item Category'
    }
  },
];

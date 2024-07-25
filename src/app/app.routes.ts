import { Routes } from '@angular/router';
import { PosComponent } from './pages/pos/pos.component';
import { AdminCategoryListComponent } from './pages/admin-category-list/admin-category-list.component';
import { AdminCategoryComponent } from './pages/admin-category/admin-category.component';
import { AdminProductOptionListComponent } from './pages/admin-product-option-list/admin-product-option-list.component';
import { AdminProductOptionComponent } from './pages/admin-product-option/admin-product-option.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pos/category',
  },
  {
    path: 'pos',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'category',
      },
      {
        path: 'category',
        component: PosComponent,
      },
      {
        path: 'category/:categoryId',
        component: PosComponent,
      },
    ]
  },
  {
    path: 'category',
    children: [
      {
        path: '',
        component: AdminCategoryListComponent,
        pathMatch: 'full',
      },
      {
        path: ':categoryId',
        component: AdminCategoryComponent,
      },
    ]
  },
  {
    path: 'product-option',
    children: [
      {
        path: '',
        component: AdminProductOptionListComponent,
        pathMatch: 'full',
      },
      {
        path: ':productOptionId',
        component: AdminProductOptionComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

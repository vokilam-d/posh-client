import { Routes } from '@angular/router';
import { PosComponent } from './pages/pos/pos.component';
import { AdminCategoryListComponent } from './pages/admin-category-list/admin-category-list.component';
import { AdminCategoryComponent } from './pages/admin-category/admin-category.component';
import { AdminIngredientListComponent } from './pages/admin-ingredient-list/admin-ingredient-list.component';
import { AdminIngredientComponent } from './pages/admin-ingredient/admin-ingredient.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { AdminProductComponent } from './pages/admin-product/admin-product.component';
import { AdminOrderListComponent } from './pages/admin-order-list/admin-order-list.component';
import { AdminOrderComponent } from './pages/admin-order/admin-order.component';
import { PAGE_ACTION_ADD } from './constants';
import { RouteDataKey } from './enums/route-data-key.enum';
import { RouteParamKey } from './enums/route-param-key.enum';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pos/category',
  },
  {
    path: 'pos',
    title: 'Термінал',
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
        title: 'Категорії',
        component: AdminCategoryListComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        title: '',
        component: AdminCategoryComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `add/:${RouteParamKey.ItemIdBasedOn}`,
        title: '',
        component: AdminCategoryComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `:${RouteParamKey.ItemId}`,
        title: '',
        component: AdminCategoryComponent,
      },
    ]
  },
  {
    path: 'product',
    children: [
      {
        path: '',
        title: 'Товари',
        component: AdminProductListComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        title: '',
        component: AdminProductComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `add/:${RouteParamKey.ItemIdBasedOn}`,
        title: '',
        component: AdminProductComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `:${RouteParamKey.ItemId}`,
        title: '',
        component: AdminProductComponent,
      },
    ]
  },
  {
    path: 'ingredient',
    children: [
      {
        path: '',
        title: 'Інгредієнти',
        component: AdminIngredientListComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        title: '',
        component: AdminIngredientComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `add/:${RouteParamKey.ItemIdBasedOn}`,
        title: '',
        component: AdminIngredientComponent,
        data: { [RouteDataKey.PageAction]: PAGE_ACTION_ADD },
      },
      {
        path: `:${RouteParamKey.ItemId}`,
        title: '',
        component: AdminIngredientComponent,
      },
    ]
  },
  {
    path: 'order',
    children: [
      {
        path: '',
        title: 'Замовлення',
        component: AdminOrderListComponent,
        pathMatch: 'full',
      },
      {
        path: `:${RouteParamKey.ItemId}`,
        title: route => `Замовлення #${route.params[RouteParamKey.ItemId]}`,
        component: AdminOrderComponent,
      },
    ]
  },
  {
    path: 'reports',
    component: ReportComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

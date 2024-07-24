import { Routes } from '@angular/router';
import { PosComponent } from './pages/pos/pos.component';

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
    path: 'pos/category/:categoryId',
    component: PosComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

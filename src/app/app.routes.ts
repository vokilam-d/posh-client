import { Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { PosComponent } from './pages/pos/pos.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pos',
  },
  {
    path: 'pos',
    component: PosComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'category',
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'category/:categoryId',
        component: CategoryComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

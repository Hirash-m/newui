import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'shop',
        loadChildren: () => import ('./views/shop/routes').then((m) => m.routes)

      }
      , 
      {
        path: 'base',
        loadChildren: () => import ('./views/base/routes').then((m) => m.routes)

      }
      ,
      {
        path: 'dashboard',
        loadComponent: () => import('./views/shop/product/product.component').then(m => m.ProductComponent)
      },
      {
        path: 'template',
        loadChildren: () => import('./views/template/routes').then((m) => m.routes)
      }
    ]
  }
];

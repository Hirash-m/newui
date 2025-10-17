import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './services/auth/login/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
     canActivate: [authGuard],
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
  } ,
    // 👇 مسیر لاگین جدا باشه بدون گارد
  {
    path: 'login',
    loadComponent: () => import('./views/base/login/loginForm/login/login.component').then(m => m.LoginComponent)
  }
];

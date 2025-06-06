import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'shop'
    },
    children: [
      {
        path: '',
        redirectTo: 'coreui-icons',
        pathMatch: 'full'
      },
      {
        path: 'product',
        loadComponent: () => import('./product/product.component').then(m => m.ProductComponent),
        data: {
          title: 'لیست محصولات '
        }
      },
      {
        path: 'countType',
        loadComponent: () => import('./count-type/count-type.component').then(m => m.CountTypeComponent),
        data: {
          title: ' واحد شمارش '
        }
      }
    ]
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'base'
    },
    children: [
      {
        path: '',
        redirectTo: 'coreui-icons',
        pathMatch: 'full'
      },
      {
        path: 'user',
        loadComponent: () => import('./userManage/user/user.component').then(m => m.UserComponent),
        data: {
          title: 'لیست محصولات '
        }
      },
      
    ]
  }
];

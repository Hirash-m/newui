import { Routes } from '@angular/router';

export const routes: Routes =[

      {
        path: 'dashboardold',
        loadChildren: () => import('./dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/routes').then((m) => m.routes)
      }

 ,
  {
    path: '404',
    loadComponent: () => import('./pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];

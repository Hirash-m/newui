import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 👇 بررسی لاگین بودن
  const isLoggedIn = !!localStorage.getItem('token'); // یا هر نشانه‌ای که ذخیره کردی

  if (!isLoggedIn) {
    // اگر لاگین نیست، بره به صفحه login
    router.navigate(['/login']); // مسیر لاگین پروژه‌ت
    return false;
  }

  return true;
};

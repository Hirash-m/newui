// src/app/core/interceptors/auth.interceptor.ts
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utilities/toast.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('token');
  const toast = inject(ToastService);
  const router = inject(Router);

  let cloned = req;
  if (token) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'خطای ناشناخته';

      if (error.status === 401) {
        message = 'لطفاً وارد حساب کاربری خود شوید.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'شما دسترسی لازم برای این عملیات را ندارید.';
      } else if (error.status === 404) {
        message = 'مورد مورد نظر یافت نشد.';
      } else if (error.status === 500) {
        message = 'خطای سرور رخ داده است.';
      } else {
        message = error.error?.errors?.[0] || error.message || 'خطا در ارتباط با سرور';
      }

      toast.showToast.error({ message });
      return throwError(() => error);
    })
  );
}
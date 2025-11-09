import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utilities/toast.service';
import { ApiResult } from 'src/app/dto/api-result';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const toast = inject(ToastService);
  const router = inject(Router);

  let cloned = req;
  const token = localStorage.getItem('token');
  if (token) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. اگر پاسخ JSON با ساختار ApiResult بود
      if (error.error && typeof error.error === 'object') {
        const apiResult = error.error as ApiResult;

        // فقط اگر ساختار ApiResult داشت
        if ('isSucceeded' in apiResult) {
          if (!apiResult.isSucceeded) {
            toast.handleApiResponse(apiResult);
          }

          // 401: لاگ‌اوت خودکار
          if (apiResult.statusCode === 401 || error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.navigate(['/login']);
          }

          return throwError(() => error);
        }
      }

      // 2. اگر ApiResult نبود → خطای خام HTTP
      toast.handleHttpError(error);

      // 401 خام
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
}
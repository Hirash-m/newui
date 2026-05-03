import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utilities/toast.service';
import { StatusResult } from 'src/app/dto/result';

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
        const apiResult = error.error as StatusResult;

        // فقط اگر ساختار ApiResult داشت
        if (apiResult && typeof apiResult.status === 'number') {
          if (apiResult.status >= 200 && apiResult.status < 300 ) {
            toast.handleResult(apiResult);
          }

          // 401: لاگ‌اوت خودکار
          if (apiResult.status === 401 ) {
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
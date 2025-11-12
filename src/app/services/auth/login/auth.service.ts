// src/app/services/auth/login/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastService } from '../../utilities/toast.service';
import { Domain } from '../../../../utilities/path';
import { ApiResult } from 'src/app/dto/api-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${Domain}/api/Auth`;

  // ذخیره پرمیشن‌ها
  private permissions = new BehaviorSubject<string[]>([]);
  public readonly permissions$ = this.permissions.asObservable();

  constructor(private http: HttpClient, private toast: ToastService) {
    this.loadPermissionsFromStorage();
  }

  private loadPermissionsFromStorage(): void {
    const stored = localStorage.getItem('permissions');
    if (stored) {
      this.permissions.next(JSON.parse(stored)); // اینجا اصلاح شد: داخل بلاک if
    }
  }

// src/app/services/auth/login/auth.service.ts

login(username: string, password: string): Observable<any> {
  const body = { username, password };

  return this.http.post<ApiResult<any>>(`${this.apiUrl}/login`, body).pipe(
    map(response => {
      if (response.isSucceeded && response.data?.token) {
        const token = response.data.token;
        const user = response.data;

        // زمان انقضا: ۲۴ ساعت از الان
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 ساعت به میلی‌ثانیه

        // ذخیره در localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token_expires_at', expiresAt.toString());

        // بارگذاری permissions
        this.fetchPermissions();
      }
      return response;
    }),
    tap(() => this.fetchPermissions()),
    catchError(error => {
      this.toast.error('خطا در ورود به سیستم');
      return throwError(() => error);
    })
  );
}

  private fetchPermissions(): void {
    this.http.get<ApiResult<string[]>>(`/api/user/permissions`).pipe(
      catchError(() => {
        this.toast.error('خطا در دریافت دسترسی‌ها');
        return of(null);
      })
    ).subscribe(res => {
      if (res?.isSucceeded && res.data) {
        this.permissions.next(res.data);
        localStorage.setItem('permissions', JSON.stringify(res.data));
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions.value.includes(permission);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    this.permissions.next([]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // متد برای بروزرسانی دستی (اختیاری)
  refreshPermissions(): void {
    this.fetchPermissions();
  }
}